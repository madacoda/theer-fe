# Check if the network exists, create it if not
docker network inspect mctheer-network >/dev/null 2>&1 || docker network create mctheer-network

# Build and start the containers
docker-compose up -d --build

echo "Application is running at http://localhost:1000"
