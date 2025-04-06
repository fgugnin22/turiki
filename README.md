# turiki  
Инструкция:
0) Для начала работы необходимы следующие программы(Windows 10):
 - Docker Desktop
 - wsl2 + Ubuntu

1) Скопируйте себе
2) ```docker-compose -f ./docker-compose.dev.yml up -d```
3) Если не произошло ошибок, то должно работать)))))))(адрес - localhost:5173 - frontend, localhost:8000 - backend)

4) в консоли контейнера django нужно создать админа с помощью ```python manage.py createsuperuser```

# чтобы верстка на фронте не ехала
# самописная админка более красивая))
# бэк чтобы был надежный(транзакции епта)
# переделать дев окружение(docker compose)