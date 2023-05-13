import requests

ENDPOINT = "http://localhost:8000/api"
AUTH_ENDPOINT = "http://localhost:8000/auth"
SAMPLE_ADMIN_EMAIL = "axtung210@mail.ru"
SAMPLE_ADMIN_PASSWORD = "epsteindidntkillhimself"


# def get_tokens(email, password):
#     request = requests.post(AUTH_ENDPOINT, data={"email": email, "password": password})
#     print(request.json())


def test_get_tournament_list():
    response = requests.get(ENDPOINT + "/tournament/")
    assert response.status_code == 200


def test_get_match_list():
    response = requests.get(ENDPOINT + "/match/")
    assert response.status_code == 200


def test_get_team_list():
    response = requests.get(ENDPOINT + "/team/")
    assert response.status_code == 200


def test_get_chat_list():
    response = requests.get(ENDPOINT + "/chat/")
    assert response.status_code == 200
