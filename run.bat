@echo off
echo Starting docker-compose...
docker-compose up -d --build
echo Waiting for 2 seconds...
ping 127.0.0.1 -n 2 > nul
echo Opening browser...
start http://localhost:3000/
