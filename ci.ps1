#Для этого скрипта необходимо выполнить условия из Readme.md!!!
Copy-Item  $pwd"\backend\dist\assets\img" -Destination $pwd -Recurse
Remove-Item $pwd"\backend\dist" -Recurse
cd $pwd"\frontend"
npm i
npm run build
cd ..
Copy-Item  $pwd"\frontend\dist" -Destination $pwd"\backend" -Recurse
Copy-Item  $pwd"\img" -Destination $pwd"\backend\dist\assets" -Recurse