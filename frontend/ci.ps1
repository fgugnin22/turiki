#Для этого скрипта необходимо выполнить условия из Readme.md!!!
Remove-Item $pwd"\backend\dist" -Recurse
cd $pwd"\frontend"
npm i
npm run build
cd ..
Copy-Item  $pwd"\frontend\dist" -Destination $pwd"\backend" -Recurse