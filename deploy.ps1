# PowerShell скрипт для деплоя BankApp фронтенда

Write-Host "🚀 Начинаем деплой BankApp..." -ForegroundColor Green

# Проверка Docker
try {
    docker --version | Out-Null
} catch {
    Write-Host "❌ Docker не установлен. Установите Docker и попробуйте снова." -ForegroundColor Red
    exit 1
}

# Остановка старого контейнера
Write-Host "🛑 Остановка старого контейнера..." -ForegroundColor Yellow
docker stop bank-frontend 2>$null
docker rm bank-frontend 2>$null

# Сборка нового образа
Write-Host "🔨 Сборка Docker образа..." -ForegroundColor Cyan
docker build -t bank-frontend:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка при сборке образа" -ForegroundColor Red
    exit 1
}

# Запуск контейнера
Write-Host "▶️  Запуск контейнера..." -ForegroundColor Cyan
docker-compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Ошибка при запуске контейнера" -ForegroundColor Red
    exit 1
}

# Проверка статуса
Write-Host "✅ Проверка статуса..." -ForegroundColor Green
Start-Sleep -Seconds 3
docker ps | Select-String "bank-frontend"

Write-Host ""
Write-Host "✨ Деплой завершен!" -ForegroundColor Green
Write-Host "📍 Приложение доступно на https://bank.korzik.space" -ForegroundColor Cyan
Write-Host ""
Write-Host "Для просмотра логов: docker logs -f bank-frontend" -ForegroundColor Gray
