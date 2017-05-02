#!/bin/bash
echo "Killing container"

docker kill location-integrator

docker rm location-integrator

docker rmi location-integrator

echo "Building image"

docker build -t location-integrator .

echo "Starting container"
docker run -t -i -d -p 3000:3000 --name location-integrator \
--env NODE_ENV=production \
--env MONGODB=mongodb://username:password@localhost:27017/dbname \
--env TRACKERHOST=http://139.59.19.80:3000/api \
location-integrator

echo "Runnig containers"
docker ps
