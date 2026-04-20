#!/bin/bash

# Скрипт для деплоя BankApp фронтенда

echo "🚀 Начинаем деплой BankApp..."

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

# Остановка старого контейнера
echo "🛑 Остановка старого контейнера..."
docker stop bank-frontend 2>/dev/null || true
docker rm bank-frontend 2>/dev/null || true

# Сборка нового образа
echo "🔨 Сборка Docker образа..."
docker build -t bank-frontend:latest . || {
    echo "❌ Ошибка при сборке образа"
    exit 1
}

# Запуск контейнера
echo "▶️  Запуск контейнера..."
docker-compose up -d || {
    echo "❌ Ошибка при запуске контейнера"
    exit 1
}

# Проверка статуса
echo "✅ Проверка статуса..."
sleep 3
docker ps | grep bank-frontend

echo ""
echo "✨ Деплой завершен!"
echo "📍 Приложение доступно на https://bank.korzik.space"
echo ""
echo "Для просмотра логов: docker logs -f bank-frontend"
