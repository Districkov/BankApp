# Быстрый старт для деплоя

## Что было сделано

✅ Настроен `next.config.js` с проксированием API запросов на бэкенд
✅ Создан `Dockerfile` для сборки Next.js приложения
✅ Создан `docker-compose.yml` для запуска фронтенда
✅ Добавлен `.dockerignore` для оптимизации сборки

## Как это работает

**До изменений:**
```
Yandex OAuth → https://bank.korzik.space/code/callback (404 на бэкенде)
```

**После изменений:**
```
Yandex OAuth → https://bank.korzik.space/code/callback (Next.js обрабатывает)
              → Извлекает код из URL
              → POST /api/auth/v1/simple/yandex/callback?code=xxx (проксируется на бэкенд)
              → Получает session_cookie
              → Редирект на /welcome
```

## Команды для деплоя

```bash
# 1. Перейти в папку проекта
cd C:\Users\solom\Desktop\BankApp

# 2. Собрать Docker образ
docker build -t bank-frontend:latest .

# 3. Запустить (если бэкенд уже работает)
docker run -d \
  --name bank-frontend \
  -p 80:3000 \
  -e NODE_ENV=production \
  bank-frontend:latest

# Или с docker-compose
docker-compose up -d
```

## Важные изменения в коде

### next.config.js
Добавлено проксирование `/api/*` на бэкенд:
```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://backend:8080/api/:path*',
    },
  ];
}
```

### Что НЕ нужно менять
- `pages/code/callback.js` - уже правильно обрабатывает код
- `src/utils/api.js` - уже отправляет запросы правильно
- `src/context/AuthContext.js` - уже сохраняет сессию

## Настройка на сервере

1. **Убедитесь, что бэкенд доступен** по имени `backend` в Docker сети
2. **Или измените** `next.config.js`, если бэкенд на другом хосте:
   ```javascript
   destination: 'https://your-backend-host:8080/api/:path*'
   ```
3. **Настройте Yandex OAuth** redirect_uri на `https://bank.korzik.space/code/callback`

## Проверка

После деплоя откройте:
- `https://bank.korzik.space` - главная страница
- `https://bank.korzik.space/auth/yandex` - страница входа
- `https://bank.korzik.space/code/callback?code=test` - должна показать "Авторизация..."
