# Bank App - Next.js

Банковское приложение, переведенное с React Native на Next.js с сохранением дизайна.

## Технологии

- **Next.js 14** - React фреймворк
- **Tailwind CSS** - стилизация
- **React Icons** - иконки
- **React Context API** - управление состоянием

## Установка

```bash
npm install
```

## Запуск

### Режим разработки
```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

### Production сборка
```bash
npm run build
npm start
```

## Структура проекта

```
BankApp/
├── pages/                    # Next.js страницы
│   ├── _app.js              # Главный компонент приложения
│   ├── _document.js         # HTML документ
│   ├── index.js             # Главная страница (редирект)
│   ├── welcome.js           # Экран приветствия
│   ├── auth/                # Страницы авторизации
│   │   ├── telegram.js      # Вход через Telegram
│   │   └── code-input.js    # Ввод кода подтверждения
│   ├── main/                # Основные страницы
│   │   └── home.js          # Главная страница
│   ├── transfers/           # Переводы
│   ├── profile/             # Профиль
│   └── partners/            # Партнеры
├── src/
│   ├── components/          # React компоненты
│   │   ├── MainLayout.js    # Layout с нижней навигацией
│   │   ├── Header.js        # Заголовок
│   │   ├── IconButton.js    # Кнопка с иконкой
│   │   ├── TransactionItem.js # Элемент транзакции
│   │   ├── LoadingStates.js # Компоненты загрузки
│   │   └── ErrorBoundary.js # Обработка ошибок
│   ├── context/
│   │   └── AuthContext.js   # Контекст авторизации
│   ├── utils/
│   │   ├── api.js           # API клиент
│   │   ├── validation.js    # Валидация форм
│   │   ├── format.js        # Форматирование данных
│   │   ├── errorHandler.js  # Обработка ошибок
│   │   └── constants.js     # Константы
│   └── styles/
│       └── themes.js        # Цвета и стили
├── styles/
│   └── globals.css          # Глобальные стили
├── public/                  # Статические файлы
├── next.config.js           # Конфигурация Next.js
├── tailwind.config.js       # Конфигурация Tailwind
└── package.json

```

## Основные страницы

### Авторизация
- `/auth/telegram` - Вход через Telegram
- `/auth/code-input` - Ввод кода подтверждения
- `/welcome` - Экран приветствия

### Главные страницы
- `/main/home` - Главная страница с балансом и быстрыми действиями
- `/main/operations` - История операций

### Переводы
- `/transfers/phone` - Перевод по номеру телефона
- `/transfers/accounts` - Перевод между счетами
- `/transfers/payments` - Платежи

### Профиль
- `/profile/more` - Меню профиля
- `/profile/settings` - Настройки
- `/profile/personal-data` - Личные данные
- `/profile/support` - Поддержка

### Партнеры
- `/partners/list` - Список партнеров
- `/partners/astra` - Astra RP
- `/partners/yanima` - Yanima

## API

API базовый URL: `https://bank.korzik.space/api/auth/v1`

### Основные эндпоинты:
- `GET /simple/telegram/url` - Получить URL для авторизации
- `POST /simple/telegram/callback` - Подтверждение кода
- `GET /whoami` - Проверка сессии
- `POST /logout` - Выход
- `GET /user/profile` - Профиль пользователя
- `GET /accounts` - Счета пользователя
- `GET /transactions` - История транзакций

## Особенности

### Авторизация
- Авторизация через Telegram
- Сохранение сессии в localStorage
- Автоматическая проверка сессии при загрузке

### Навигация
- Нижняя навигация (Bottom Tabs)
- Роутинг через Next.js Router
- Защищенные маршруты

### Дизайн
- Полностью адаптивный дизайн
- Сохранен оригинальный дизайн из React Native
- Tailwind CSS для стилизации
- Градиенты и тени

### Компоненты
- Переиспользуемые компоненты
- Мемоизация для оптимизации
- Error Boundary для обработки ошибок
- Loading states

## Отличия от React Native версии

1. **Навигация**: React Navigation → Next.js Router
2. **Стили**: StyleSheet → Tailwind CSS
3. **Хранилище**: AsyncStorage → localStorage
4. **Иконки**: @expo/vector-icons → react-icons
5. **Градиенты**: expo-linear-gradient → CSS градиенты
6. **Платформа**: Mobile → Web

## Разработка

### Добавление новой страницы
1. Создайте файл в папке `pages/`
2. Используйте `MainLayout` для страниц с навигацией
3. Используйте `useRouter` для навигации

### Пример:
```jsx
import MainLayout from '../../src/components/MainLayout';
import { useRouter } from 'next/router';

export default function MyPage() {
  const router = useRouter();
  
  return (
    <MainLayout>
      <div>My Page Content</div>
    </MainLayout>
  );
}
```

## Тестирование

```bash
npm test
```

## Лицензия

Private
