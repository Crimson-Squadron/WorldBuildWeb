# Run Spring Boot 3 Backend with Java 21
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.13.21-hotspot"
$env:Path = "C:\Program Files\Microsoft\jdk-21.0.13.21-hotspot\bin;C:\Program Files\MySQL\MySQL Server 8.4\bin;" + $env:Path

Set-Location "$PSScriptRoot\backend"
Write-Host "Starting Spring Boot 3 Backend on http://localhost:8080..." -ForegroundColor Green
.\mvnw.cmd spring-boot:run
