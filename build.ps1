#вместо C:\Users\fgugn\OneDrive\Рабочий стол\github test repos\balls\ поставьте свои пути до каждой из папок шо бы скрипты працували

Remove-Item "C:\Users\fgugn\OneDrive\Рабочий стол\github test repos\balls\backend\dist" -Recurse
Set-Location "C:\Users\fgugn\OneDrive\Рабочий стол\github test repos\balls\frontend"
npm i
npm run build
Copy-Item "C:\Users\fgugn\OneDrive\Рабочий стол\github test repos\balls\frontend\dist" -Destination "C:\Users\fgugn\OneDrive\Рабочий стол\github test repos\balls\backend" -Recurse
Set-Location "C:\Users\fgugn\OneDrive\Рабочий стол\github test repos\balls\backend"
docker-compose up