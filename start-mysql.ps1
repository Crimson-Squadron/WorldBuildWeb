# Start Native MySQL 8.4 Server locally
$mysqld = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"
$datadir = "C:\ProgramData\MySQL\Data"

Write-Host "Starting MySQL Server on port 3306..." -ForegroundColor Cyan
& $mysqld --datadir="$datadir" --port=3306 --console
