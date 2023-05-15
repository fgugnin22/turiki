import builtins

ENDPOINT = "http://localhost:8000/auth"
AUTH_ENDPOINT = "http://localhost:8000/auth"
SAMPLE_ADMIN_EMAIL = "axtung210@mail.ru"
SAMPLE_ADMIN_PASSWORD = "Fedor_223"
import requests


def get_tokens():
    request = requests.post(AUTH_ENDPOINT + "/jwt/create/",
                            data={"email": SAMPLE_ADMIN_EMAIL, "password": SAMPLE_ADMIN_PASSWORD})
    data = request.json()
    return data


def test_get_tokens():
    tokens = get_tokens()
    assert type(tokens) == builtins.dict and "access" in tokens.keys() and "refresh" in tokens.keys()
