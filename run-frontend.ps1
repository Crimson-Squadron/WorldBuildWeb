# Run Next.js Frontend with Node.js
$env:Path = "C:\Program Files\nodejs;" + $env:Path

Set-Location "$PSScriptRoot\frontend"
Write-Host "Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Blue
& "C:\Program Files\nodejs\npm.cmd" run dev
