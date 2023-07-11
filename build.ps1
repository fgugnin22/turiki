#вместо C:\Users\fgugn\projects\proh\ поставьте свои пути до каждой из папок шо бы скрипты працували

Remove-Item "C:\Users\fgugn\projects\proh\backend\dist" -Recurse
Set-Location "C:\Users\fgugn\projects\proh\frontend"
npm i
npm run build
Copy-Item "C:\Users\fgugn\projects\proh\frontend\dist" -Destination "C:\Users\fgugn\projects\proh\backend" -Recurse
Set-Location "C:\Users\fgugn\projects\proh\backend"
docker-compose up