import requests
import json

ENDPOINT = "http://localhost:8000/api"
AUTH_ENDPOINT = "http://localhost:8000/auth"
SAMPLE_ADMIN_EMAIL = "axtung210@mail.ru"
SAMPLE_ADMIN_PASSWORD = "Fedor_223"


def get_tokens():
    request = requests.post(AUTH_ENDPOINT + "/jwt/create/",
                            data={"email": SAMPLE_ADMIN_EMAIL, "password": SAMPLE_ADMIN_PASSWORD})
    data = request.json()
    return data["access"], data["refresh"]


ACCESS, REFRESH = get_tokens()


def test_get_tournament_list():
    response = requests.get(ENDPOINT + "/tournament/")
    assert response.status_code == 200


def test_post_and_put_tournaments():
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"JWT {ACCESS}"
    }

    response_post = requests.post(ENDPOINT + "/tournament/", headers=headers)
    data_post = response_post.json()
    body_put = json.dumps({"status": "REGISTRATION_CLOSED"})
    tourn_id = str(data_post["id"])
    response_put = requests.put(ENDPOINT + "/tournament/" + tourn_id + "/", headers=headers, data=body_put)
    data_put = response_put.json()
    assert data_put["id"] == data_post["id"] and response_post.status_code == 200 and response_put.status_code == 200


def test_get_match_list():
    response = requests.get(ENDPOINT + "/match/")
    assert response.status_code == 200


def test_get_team_list():
    response = requests.get(ENDPOINT + "/team/")
    assert response.status_code == 200


def test_get_chat_list():
    response = requests.get(ENDPOINT + "/chat/")
    assert response.status_code == 200


def test_chat_message():
    test_data = json.dumps({"content": "test_content"})
    response = requests.put(ENDPOINT + "/chat/1/", data=test_data, \
                            headers={"Authorization": f"JWT {ACCESS}", "Content-Type": "application/json"})
    data = response.json()
    print(data)
    keys = data.keys()
    assert "messages" in keys and data["id"] == 1 and len(data["messages"]) > 0

# def test_team_create_update(): <-- тестировать api команды только вручную пока что
# тестирование матчей тоже пока что вручную
