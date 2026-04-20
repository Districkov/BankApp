#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const forge = require('node-forge');

const certDir = path.join(__dirname, 'certificates');
const domain = 'dev.bank.korzik.space';
const keyPath = path.join(certDir, `${domain}-key.pem`);
const certPath = path.join(certDir, `${domain}.pem`);

// Создаем директорию для сертификатов
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

// Проверяем, существуют ли сертификаты
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('✓ SSL сертификаты уже существуют');
  process.exit(0);
}

console.log(`Генерация самоподписанных SSL сертификатов для ${domain}...`);

try {
  // Генерируем ключевую пару
  const keys = forge.pki.rsa.generateKeyPair(2048);
  
  // Создаем сертификат
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = '01';
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  
  const attrs = [{
    name: 'commonName',
    value: domain
  }];
  
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  
  // Добавляем расширения
  cert.setExtensions([{
    name: 'subjectAltName',
    altNames: [{
      type: 2, // DNS
      value: domain
    }, {
      type: 2,
      value: 'localhost'
    }]
  }]);
  
  // Подписываем сертификат
  cert.sign(keys.privateKey, forge.md.sha256.create());
  
  // Конвертируем в PEM формат
  const pemKey = forge.pki.privateKeyToPem(keys.privateKey);
  const pemCert = forge.pki.certificateToPem(cert);
  
  // Сохраняем сертификаты
  fs.writeFileSync(keyPath, pemKey, 'utf8');
  fs.writeFileSync(certPath, pemCert, 'utf8');
  
  console.log('✓ SSL сертификаты успешно созданы в папке certificates/');
  console.log(`  - ${domain}-key.pem (приватный ключ)`);
  console.log(`  - ${domain}.pem (сертификат)`);
  console.log('\nВнимание: Это самоподписанный сертификат для разработки.');
  console.log('Браузер покажет предупреждение о безопасности - это нормально.');
  console.log('\n⚠️  ВАЖНО: Добавьте в файл hosts:');
  console.log(`127.0.0.1 ${domain}`);
} catch (error) {
  console.error('Ошибка при генерации сертификатов:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
}
