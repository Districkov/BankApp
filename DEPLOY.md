# Инструкция по деплою BankApp

## Архитектура
Фронтенд и бэкенд работают на одном домене `https://bank.korzik.space`:
- Фронтенд (Next.js) обрабатывает все страницы и `/code/callback`
- API запросы `/api/*` проксируются на бэкенд

## Деплой с Docker

### 1. Сборка образа
```bash
docker build -t bank-frontend:latest .
```

### 2. Запуск с docker-compose
```bash
docker-compose up -d
```

### 3. Или запуск вручную
```bash
docker run -d \
  --name bank-frontend \
  -p 80:3000 \
  -e NODE_ENV=production \
  --network bank-network \
  bank-frontend:latest
```

## Настройка Nginx (если используется)

Если перед Docker стоит Nginx, настройте его так:

```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name bank.korzik.space;

    # SSL сертификаты
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Проксирование на фронтенд
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API проксируется фронтендом на бэкенд
}
```

## Проверка работы

1. Откройте `https://bank.korzik.space/auth/yandex`
2. Нажмите "Войти через Яндекс"
3. После авторизации Yandex перенаправит на `https://bank.korzik.space/code/callback?code=...`
4. Фронтенд извлечет код и отправит на бэкенд
5. После успешной авторизации произойдет редирект на `/welcome`

## Важно

- Убедитесь, что в настройках Yandex OAuth redirect_uri установлен на `https://bank.korzik.space/code/callback`
- Бэкенд должен быть доступен по имени `backend` в Docker сети или измените `next.config.js`
- Для локальной разработки используйте `npm run dev`
