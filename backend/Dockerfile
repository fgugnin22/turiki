# Используем официальный образ Python в качестве базового образа
FROM python:3.13
# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app
# RUN apk update && apk add python3-dev \
#     gcc \
#     libc-dev \
#     libffi-dev
# RUN apk add --virtual build-deps file make gcc musl-dev libffi-dev
RUN pip install --upgrade pip
RUN pip install --upgrade setuptools wheel
COPY . .
RUN pip install -r requirements.txt