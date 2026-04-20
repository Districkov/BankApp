# 🚀 Быстрый старт - 3 шага до деплоя

## Шаг 1: Настройте Yandex OAuth (5 минут)

Зайдите в настройки вашего OAuth приложения на Yandex и измените:

```
Redirect URI: https://bank.korzik.space/code/callback
```

## Шаг 2: Настройте бэкенд (если нужно)

Если ваш бэкенд НЕ доступен по имени `backend` в Docker, откройте `next.config.js` и измените строку 10:

```javascript
// Было:
destination: 'http://backend:8080/api/:path*',

// Станет (например):
destination: 'http://localhost:8080/api/:path*',
// или
destination: 'http://your-backend-ip:8080/api/:path*',
```

## Шаг 3: Запустите деплой

### Windows:
```powershell
cd C:\Users\solom\Desktop\BankApp
.\deploy.ps1
```

### Linux/Mac:
```bash
cd /path/to/BankApp
chmod +x deploy.sh
./deploy.sh
```

## Готово! 🎉

Откройте https://bank.korzik.space и проверьте:
- ✅ Главная страница загружается
- ✅ Вход через Яндекс работает
- ✅ После авторизации редирект на `/welcome`

---

## Если что-то пошло не так

Смотрите логи:
```bash
docker logs -f bank-frontend
```

Полная документация:
- `CHECKLIST.md` - чеклист и troubleshooting
- `DEPLOY.md` - подробная инструкция
- `SUMMARY.md` - полная сводка изменений
