import builtins
import json
import random

from .tournamentAPI_test import get_tokens

ENDPOINT = "http://localhost:8000/api"
AUTH_ENDPOINT = "http://localhost:8000/auth"
SAMPLE_ADMIN_EMAIL = "axtung210@mail.ru"
SAMPLE_ADMIN_PASSWORD = "Fedor_223"
import requests


def test_get_tokens():
    tokens = get_tokens()
    ACCESS, REFRESH = tokens
    assert type(tokens) == builtins.tuple and type(ACCESS) == builtins.str and type(REFRESH) == builtins.str


ACCESS, REFRESH = get_tokens()


def test_get_users_list():
    headers = {
        "Authorization": f"JWT {ACCESS}"
    }
    response = requests.get(AUTH_ENDPOINT + "/users/", headers=headers)
    assert response.status_code == 200 and len(response.json()) > 0


def test_get_new_access():
    headers = {
        "Content-Type": "application/json"
    }
    body = json.dumps({"refresh": REFRESH})
    response = requests.post(AUTH_ENDPOINT + "/jwt/refresh/", headers=headers, data=body)
    assert response.status_code == 200 and type(response.json()["access"]) == builtins.str


def test_users_me():
    headers = {
        "Authorization": f"JWT {ACCESS}"
    }
    response = requests.get(AUTH_ENDPOINT + "/users/me/", headers=headers)
    user = response.json()
    assert user["email"] == SAMPLE_ADMIN_EMAIL


def test_user_create():
    headers = {
        "Content-Type": "application/json"
    }
    name = str(random.random())
    body = json.dumps({
        "name": f"test_user{name}",
        "email": f"user{name + name}@example.com",
        "password": "Qwerty_987",
        "re_password": "Qwerty_987"
    })
    response = requests.post(AUTH_ENDPOINT + "/users/", data=body, headers=headers)
    assert response.status_code == 201 and type(response.json()) == builtins.dict
