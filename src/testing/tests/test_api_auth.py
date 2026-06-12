import pytest


@pytest.mark.api
@pytest.mark.smoke
def test_login_returns_token(api_client, env):
    payload = api_client.login(
        env['credentials']['admin']['email'],
        env['credentials']['admin']['password'],
    )
    assert payload['data']['token']
    assert payload['data']['user']['email'] == env['credentials']['admin']['email']


@pytest.mark.api
@pytest.mark.regression
def test_login_rejects_invalid_credentials(api_client):
    response = api_client.post(
        '/auth/login',
        json={'email': 'bad@bdport.gov.bd', 'password': 'wrong'},
    )
    assert response.status_code in (401, 400)
    payload = response.json()
    assert payload['success'] is False
