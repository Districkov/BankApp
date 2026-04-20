# Bank App - Next.js

Современное банковское веб-приложение на Next.js с интеграцией бэкенд API и антифрод системой.

## 📋 Содержание

- [Технологии](#технологии)
- [Установка](#установка)
- [Запуск](#запуск)
- [API Интеграция](#api-интеграция)
- [Антифрод Система](#антифрод-система)
- [Тестирование](#тестирование)
- [Структура проекта](#структура-проекта)

## 🚀 Технологии

- **Next.js 14** - React фреймворк
- **Tailwind CSS** - стилизация
- **React Icons** - иконки
- **Jest + React Testing Library** - тестирование

## 📦 Установка

```bash
npm install
```

## 🏃 Запуск

### Режим разработки (HTTP)
```bash
npm run dev
```
Приложение доступно: http://localhost:3000

### Режим разработки (HTTPS)
```bash
npm run dev:https
```
Приложение доступно: https://dev.bank.korzik.space:3000

### Production
```bash
npm run build
npm start
```

## 🔌 API Интеграция

### Конфигурация

API проксируется через Next.js rewrites в `next.config.js`:

```javascript
{
  source: '/api/auth/:path*',
  destination: 'https://bank.korzik.space/api/auth/v1/:path*'
},
{
  source: '/api/accounts/:path*',
  destination: 'https://bank.korzik.space/api/accounts/v1/:path*'
},
{
  source: '/api/transfers/:path*',
  destination: 'https://bank.korzik.space/api/transfers/v1/:path*'
}
```

### Основные эндпоинты

#### Авторизация
- `GET /api/auth/simple/yandex/url` - URL для Yandex OAuth
- `POST /api/auth/simple/yandex/callback` - Подтверждение кода
- `GET /api/auth/whoami` - Проверка сессии
- `POST /api/auth/logout` - Выход

#### Счета
- `GET /api/accounts/accounts` - Список счетов
- `GET /api/accounts/accounts/:id` - Счёт по ID
- `GET /api/accounts/accounts/:id/balance` - Баланс счёта

#### Переводы
- `POST /api/transfers/transfers/phone` - Перевод по телефону
- `POST /api/transfers/transfers/card` - Перевод по карте
- `POST /api/transfers/transfers/internal` - Между счетами

#### Транзакции
- `GET /api/accounts/transactions` - История транзакций
- `GET /api/accounts/transactions/:id` - Транзакция по ID

## 🛡️ Антифрод Система

### Как работает

1. **Фронтенд** отправляет запрос на перевод:
```javascript
await transfersAPI.transferToPhone({
  phone: '79001234567',
  amount: 5000.00,
  message: 'За обед'
});
```

2. **Бэкенд** проверяет:
   - ✅ Лимиты (одиночный, дневной, месячный)
   - ✅ Подозрительную активность
   - ✅ Баланс пользователя
   - ✅ Валидность получателя

3. **Результат**:
   - **Успех (201)** → Редирект на `/main/success`
   - **Ошибка (400/403/429)** → Редирект на `/main/failed` с причиной

### Коды ошибок

| Код | Описание | Пример |
|-----|----------|--------|
| 400 | Некорректные данные | Неверный формат телефона |
| 403 | Превышен лимит / Подозрительная активность | "Превышен дневной лимит. Доступно: 15000 ₽" |
| 429 | Слишком много запросов | "Превышено количество попыток" |
| 500 | Внутренняя ошибка сервера | "Технические неполадки" |

### Лимиты (настраиваются на бэкенде)

- **Одиночный перевод**: до 600,000 ₽
- **Дневной лимит**: до 1,000,000 ₽
- **Месячный лимит**: до 5,000,000 ₽

### Пример обработки ошибок

```javascript
try {
  await transfersAPI.transferToPhone(data);
  router.push('/main/success');
} catch (error) {
  if (error.status === 403) {
    // Антифрод заблокировал
    router.push(`/main/failed?reason=${error.message}`);
  } else {
    // Другая ошибка
    setErrors({ amount: error.message });
  }
}
```

## 🧪 Тестирование

### Запуск тестов

```bash
# Все тесты
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Написанные тесты

1. **TransferPhone** (`__tests__/pages/transfers/phone.test.js`)
   - Рендеринг формы
   - Валидация телефона
   - Валидация суммы
   - Успешный перевод
   - Обработка антифрод ошибок

2. **MainLayout** (`__tests__/components/MainLayout.test.js`)
   - Рендеринг children
   - Нижняя навигация
   - Активный элемент навигации

3. **API Utils** (`__tests__/utils/api.test.js`)
   - GET запросы
   - POST запросы
   - Обработка ошибок
   - transfersAPI методы
   - accountsAPI методы

4. **Home Page** (`__tests__/pages/main/home.test.js`)
   - Loading state
   - Отображение данных пользователя
   - Расчет общего баланса
   - Секция партнеров
   - Расчет месячных расходов

## 📁 Структура проекта

```
BankApp/
├── pages/                      # Next.js страницы
│   ├── _app.js                # Главный компонент
│   ├── _document.js           # HTML документ
│   ├── index.js               # Редирект на welcome
│   ├── welcome.js             # Экран приветствия
│   ├── auth/                  # Авторизация
│   │   ├── callback.js
│   │   ├── code-input.js
│   │   └── yandex.js
│   ├── main/                  # Основные страницы
│   │   ├── home.js           # Главная
│   │   ├── operations.js     # История операций
│   │   ├── success.js        # Успешный перевод
│   │   └── failed.js         # Неудачный перевод
│   ├── transfers/            # Переводы
│   │   ├── phone.js          # По телефону
│   │   ├── accounts.js       # Между счетами
│   │   └── payments.js       # Платежи
│   ├── profile/              # Профиль
│   │   ├── more.js
│   │   ├── settings.js
│   │   ├── personal-data.js
│   │   └── support.js
│   └── partners/             # Партнеры
│       ├── list.js
│       ├── astra.js
│       └── yanima.js
├── src/
│   ├── components/           # React компоненты
│   │   └── MainLayout.js    # Layout с навигацией
│   └── utils/
│       └── api.js           # API клиент
├── public/
│   └── partners/            # Логотипы партнеров
│       ├── astra-logo.svg
│       └── yanima-logo.png
├── __tests__/               # Тесты
│   ├── components/
│   ├── pages/
│   └── utils/
├── styles/
│   └── globals.css          # Глобальные стили
├── next.config.js           # Конфигурация Next.js
├── tailwind.config.js       # Конфигурация Tailwind
├── jest.config.js           # Конфигурация Jest
└── package.json
```

## 🎨 Особенности

### Дизайн
- Полностью адаптивный
- Tailwind CSS для стилизации
- Градиенты и тени
- Анимации переходов

### Навигация
- Нижняя навигация (Bottom Tabs)
- Next.js Router
- Защищенные маршруты

### Безопасность
- Сессии в localStorage
- HTTPS в production
- Антифрод проверки на бэкенде
- Валидация на фронте и бэкенде

### Партнеры
- **Astra RP**: GTA 5 RolePlay проект (красный цвет, черный логотип)
- **Yanima**: Онлайн-просмотр аниме (фиолетовый цвет, белый логотип)

## 🔧 Конфигурация

### Environment Variables

Создайте `.env.local` для локальной разработки:

```env
NEXT_PUBLIC_API_URL=https://bank.korzik.space/api
```

### HTTPS Development

Сертификаты генерируются автоматически при запуске `npm run dev:https`:

```bash
node generate-cert.js
node server.js
```

## 📝 Лицензия

Private

## 👥 Авторы

Bank App Team - 2026
