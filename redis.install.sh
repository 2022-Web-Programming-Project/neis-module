docker pull redis:alpine
docker network create redis-net
docker run --name redis -p 6379:6379 --network redis-net -v D:/Projects/Github_new/neis-module/redis/data:/data -d redis:alpine redis-server --appendonly yes
docker run -it --network redis-net --rm redis:alpine redis-cli -h redis