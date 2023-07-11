# Используем официальный образ Python в качестве базового образа
FROM python:3.9-alpine
# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app
COPY . .
RUN mkdir -p /usr/src/app/turiki/migrations && touch /usr/src/app/turiki/migrations/__init__.py
RUN apk update && apk add python3-dev \
    gcc \
    libc-dev \
    libffi-dev
RUN pip install --upgrade setuptools wheel
RUN pip install -r requirements.txt