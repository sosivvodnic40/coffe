# Сборка ZIP-архива для сдачи диплома
# Запуск: powershell -ExecutionPolicy Bypass -File scripts/create-diploma-archive.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$archiveName = "ДП_ИС-23-19б_Новик_Cappuccino_2026.zip"
$staging = Join-Path $env:TEMP "cappuccino-diploma-staging"
$zipPath = Join-Path $root $archiveName

if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
New-Item -ItemType Directory -Path $staging | Out-Null

# Copy diploma sections
Copy-Item (Join-Path $root "diploma\01_PZ") (Join-Path $staging "01_PZ") -Recurse
Copy-Item (Join-Path $root "diploma\02_Presentation") (Join-Path $staging "02_Presentation") -Recurse
Copy-Item (Join-Path $root "diploma\03_Schemes") (Join-Path $staging "03_Schemes") -Recurse
Copy-Item (Join-Path $root "diploma\05_DB_API") (Join-Path $staging "05_DB_API") -Recurse
Copy-Item (Join-Path $root "diploma\06_Testing") (Join-Path $staging "06_Testing") -Recurse
Copy-Item (Join-Path $root "diploma\07_UI_Docs_Economics") (Join-Path $staging "07_UI_Docs_Economics") -Recurse
Copy-Item (Join-Path $root "diploma\08_Screenshots") (Join-Path $staging "08_Screenshots") -Recurse
Copy-Item (Join-Path $root "diploma\README.txt") (Join-Path $staging "README.txt")

# Copy code (exclude node_modules, dist, data)
$codeDest = Join-Path $staging "04_Code"
New-Item -ItemType Directory -Path $codeDest | Out-Null
robocopy $root $codeDest /E /XD node_modules dist dist-server data .git /XF $archiveName *.db *.db-wal *.db-shm | Out-Null

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "$staging\*" -DestinationPath $zipPath -Force
Remove-Item $staging -Recurse -Force

Write-Host "Archive created: $zipPath"
