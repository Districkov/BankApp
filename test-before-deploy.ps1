# Test script for pre-deployment checks

Write-Host "Testing BankApp before deployment..." -ForegroundColor Cyan
Write-Host ""

# 1. Check required files
Write-Host "Checking required files..." -ForegroundColor Yellow
$requiredFiles = @(
    "Dockerfile",
    "docker-compose.yml",
    "next.config.js",
    "package.json",
    "pages/code/callback.js",
    "src/utils/api.js",
    "src/context/AuthContext.js"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  OK: $file" -ForegroundColor Green
    } else {
        Write-Host "  MISSING: $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "Some files are missing. Check project structure." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Checking dependencies..." -ForegroundColor Yellow

# 2. Check node_modules
if (Test-Path "node_modules") {
    Write-Host "  OK: node_modules installed" -ForegroundColor Green
} else {
    Write-Host "  WARNING: node_modules not found. Running npm install..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ERROR: Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Checking build..." -ForegroundColor Yellow

# 3. Test build
Write-Host "  Running npm run build..." -ForegroundColor Gray
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Build failed" -ForegroundColor Red
    exit 1
} else {
    Write-Host "  OK: Build successful" -ForegroundColor Green
}

Write-Host ""
Write-Host "Checking Docker..." -ForegroundColor Yellow

# 4. Check Docker
try {
    $dockerVersion = docker --version
    Write-Host "  OK: Docker installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Docker not installed" -ForegroundColor Red
    exit 1
}

try {
    $composeVersion = docker-compose --version
    Write-Host "  OK: Docker Compose installed: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Docker Compose not installed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Final checklist:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  [OK] All files present" -ForegroundColor Green
Write-Host "  [OK] Dependencies installed" -ForegroundColor Green
Write-Host "  [OK] Project builds successfully" -ForegroundColor Green
Write-Host "  [OK] Docker ready" -ForegroundColor Green
Write-Host ""
Write-Host "Project is ready for deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Configure Yandex OAuth redirect_uri: https://bank.korzik.space/code/callback"
Write-Host "  2. Check backend settings in next.config.js"
Write-Host "  3. Run deployment: .\deploy.ps1"
Write-Host ""
