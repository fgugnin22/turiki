FROM python:3.13

WORKDIR /usr/src/app

RUN pip install --upgrade pip
RUN pip install --upgrade setuptools wheel

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .
