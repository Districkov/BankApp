# Настройка HTTPS для dev.bank.korzik.space

## Шаг 1: Настройка hosts файла

Добавьте следующую строку в файл hosts:

```
127.0.0.1 dev.bank.korzik.space
```

### Windows:
1. Откройте Блокнот от имени администратора
2. Откройте файл: `C:\Windows\System32\drivers\etc\hosts`
3. Добавьте строку: `127.0.0.1 dev.bank.korzik.space`
4. Сохраните файл

### Linux/Mac:
```bash
sudo nano /etc/hosts
```
Добавьте строку: `127.0.0.1 dev.bank.korzik.space`

## Шаг 2: Запуск приложения

```bash
npm run dev:https
```

При первом запуске автоматически создадутся SSL сертификаты.

## Шаг 3: Открытие в браузере

Откройте: `https://dev.bank.korzik.space:3000`

Браузер покажет предупреждение о безопасности (это нормально для самоподписанных сертификатов):
- Chrome: Нажмите "Дополнительно" → "Продолжить на dev.bank.korzik.space"
- Firefox: Нажмите "Дополнительно" → "Принять риск и продолжить"

## Команды

- `npm run dev` - обычный HTTP сервер (http://localhost:3000)
- `npm run dev:https` - HTTPS сервер (https://dev.bank.korzik.space:3000)
- `npm run start:https` - production HTTPS сервер
