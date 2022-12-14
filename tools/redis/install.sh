docker pull redis:alpine
docker network create redis-net
docker run --name redis -p 6379:6379 --network redis-net -v /tmp/redis/data:/data -d redis:alpine redis-server --appendonly yes