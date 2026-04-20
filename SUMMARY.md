# 🎯 Итоговая сводка: Решение проблемы OAuth callback

## Проблема
Yandex OAuth перенаправлял на `https://bank.korzik.space/code/callback?code=...`, но бэкенд возвращал 404, так как этот URL должен обрабатываться фронтендом.

## Решение
Развернуть фронтенд Next.js на том же домене `https://bank.korzik.space` с проксированием API запросов на бэкенд.

## Что было сделано

### 1. Конфигурация Next.js (`next.config.js`)
- ✅ Добавлен `output: 'standalone'` для Docker
- ✅ Настроено проксирование `/api/*` → `http://backend:8080/api/*`

### 2. Docker конфигурация
- ✅ `Dockerfile` - многоступенчатая сборка Next.js
- ✅ `docker-compose.yml` - оркестрация фронтенда и бэкенда
- ✅ `.dockerignore` - оптимизация сборки

### 3. Скрипты деплоя
- ✅ `deploy.sh` - автоматический деплой для Linux/Mac
- ✅ `deploy.ps1` - автоматический деплой для Windows

### 4. Документация
- ✅ `DEPLOY.md` - подробная инструкция по деплою
- ✅ `README-DEPLOY.md` - быстрый старт
- ✅ `CHECKLIST.md` - чеклист для деплоя
- ✅ `.env.production.example` - пример переменных окружения

## Как это работает

```
┌─────────────────────────────────────────────────────────────┐
│  https://bank.korzik.space                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │   Next.js        │         │     Backend      │        │
│  │   Frontend       │────────▶│   (Port 8080)    │        │
│  │   (Port 3000)    │  /api/* │                  │        │
│  └──────────────────┘         └──────────────────┘        │
│         │                                                   │
│         │ /code/callback?code=xxx                          │
│         ▼                                                   │
│  1. Извлекает код из URL                                   │
│  2. POST /api/auth/v1/simple/yandex/callback?code=xxx      │
│  3. Получает session_cookie                                │
│  4. Редирект на /welcome                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Следующие шаги

### 1. Настройка Yandex OAuth
Зайдите в настройки вашего OAuth приложения на Yandex и установите:
```
Redirect URI: https://bank.korzik.space/code/callback
```

### 2. Деплой фронтенда
```bash
# Windows
.\deploy.ps1

# Linux/Mac
./deploy.sh
```

### 3. Проверка
1. Откройте https://bank.korzik.space/auth/yandex
2. Нажмите "Войти через Яндекс"
3. После авторизации должен произойти редирект на `/code/callback`
4. Затем автоматический вход и редирект на `/welcome`

## Важные файлы

| Файл | Описание |
|------|----------|
| `next.config.js` | Конфигурация Next.js с rewrites |
| `Dockerfile` | Сборка Docker образа |
| `docker-compose.yml` | Оркестрация контейнеров |
| `pages/code/callback.js` | Обработчик OAuth callback |
| `src/utils/api.js` | API клиент с методом verifyCode |

## Что НЕ нужно менять

- ❌ `pages/code/callback.js` - уже правильно работает
- ❌ `src/utils/api.js` - уже отправляет запросы корректно
- ❌ `src/context/AuthContext.js` - уже сохраняет сессию

## Поддержка

Если возникнут проблемы, проверьте:
1. Логи фронтенда: `docker logs -f bank-frontend`
2. Доступность бэкенда из контейнера
3. Настройки Yandex OAuth redirect_uri
4. Файл `CHECKLIST.md` для troubleshooting

---

**Дата создания:** 2026-04-20  
**Статус:** ✅ Готово к деплою
