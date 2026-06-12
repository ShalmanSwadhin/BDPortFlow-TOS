import pytest
import requests


TEST_EMAIL = 'testuser@bdportflow.com'
TEST_PASSWORD = 'TestUser1234'


@pytest.mark.api
@pytest.mark.regression
def test_created_user_persists_and_can_login(admin_api, api_client, env):
    payload = {
        'name': 'Persistence Test User',
        'email': TEST_EMAIL,
        'password': TEST_PASSWORD,
        'role': 'operator',
        'status': 'active',
    }

    create_response = admin_api.post('/users', json=payload)
    create_data = admin_api.json_or_fail(create_response, expected_status=(200, 201))
    user_id = create_data['data']['_id']

    get_response = admin_api.get(f'/users/{user_id}')
    get_data = admin_api.json_or_fail(get_response)
    assert get_data['data']['email'] == TEST_EMAIL
    assert get_data['data']['role'] == 'operator'
    assert get_data['data']['status'] == 'active'
    assert 'password' not in get_data['data']

    list_response = admin_api.get('/users')
    list_data = admin_api.json_or_fail(list_response)
    assert any(user['_id'] == user_id for user in list_data['data'])

    fresh_client = requests.Session()
    fresh_client.headers.update({'Content-Type': 'application/json'})
    login_response = fresh_client.post(
        f"{env['api_url'].rstrip('/')}/auth/login",
        json={'email': TEST_EMAIL, 'password': TEST_PASSWORD},
        timeout=30,
    )
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert login_data['success'] is True
    assert login_data['data']['user']['email'] == TEST_EMAIL

    delete_response = admin_api.delete(f'/users/{user_id}')
    admin_api.json_or_fail(delete_response)

    after_delete = admin_api.get('/users')
    after_data = admin_api.json_or_fail(after_delete)
    assert all(user['_id'] != user_id for user in after_data['data'])


@pytest.mark.api
@pytest.mark.regression
def test_deleted_user_cannot_login(admin_api, env):
    email = 'deleted.user@bdportflow.com'
    password = 'DeleteUser1234'

    create_response = admin_api.post('/users', json={
        'name': 'Deleted User',
        'email': email,
        'password': password,
        'role': 'operator',
    })
    create_data = admin_api.json_or_fail(create_response, expected_status=(200, 201))
    user_id = create_data['data']['_id']

    delete_response = admin_api.delete(f'/users/{user_id}')
    admin_api.json_or_fail(delete_response)

    login_response = requests.post(
        f"{env['api_url'].rstrip('/')}/auth/login",
        json={'email': email, 'password': password},
        timeout=30,
    )
    assert login_response.status_code == 401


@pytest.mark.api
@pytest.mark.regression
def test_user_status_toggle_persists(admin_api):
    email = 'status.user@bdportflow.com'

    create_response = admin_api.post('/users', json={
        'name': 'Status User',
        'email': email,
        'password': 'StatusUser1234',
        'role': 'operator',
        'status': 'active',
    })
    create_data = admin_api.json_or_fail(create_response, expected_status=(200, 201))
    user_id = create_data['data']['_id']

    toggle_response = admin_api.session.patch(
        f"{admin_api.base_url}/users/{user_id}/status",
        timeout=30,
    )
    toggle_data = admin_api.json_or_fail(toggle_response)
    assert toggle_data['data']['status'] == 'inactive'

    refetch = admin_api.get(f'/users/{user_id}')
    refetch_data = admin_api.json_or_fail(refetch)
    assert refetch_data['data']['status'] == 'inactive'

    admin_api.delete(f'/users/{user_id}')
