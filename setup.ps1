docker network inspect mctheer-network >$null 2>&1
if ($LASTEXITCODE -ne 0) {
    docker network create mctheer-network
}
docker-compose up -d --build
Write-Host "Application is running at http://localhost:1000"
