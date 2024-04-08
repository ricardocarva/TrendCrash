#!/bin/bash

echo "Starting docker-compose..."
docker-compose up -d
echo "Waiting for 2 seconds..."
sleep 2
echo "Opening browser..."

# Attempt to open in default browser for Linux
xdg-open http://localhost:3000/ >/dev/null 2>&1 && exit

# Attempt to open in default browser for macOS
open http://localhost:3000/ >/dev/null 2>&1 && exit

cmd.exe /c start http://localhost:3000/ && exit

# Fallback: Attempt to open in default browser for other systems
echo "Unable to detect default browser, please open http://localhost:3000/ manually."
