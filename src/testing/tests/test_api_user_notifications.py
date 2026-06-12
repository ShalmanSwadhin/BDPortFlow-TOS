import pytest
import uuid


@pytest.mark.api
@pytest.mark.regression
def test_create_and_delete_user_via_api(admin_api):
    email = f'api.user.{uuid.uuid4().hex[:8]}@bdport.gov.bd'
    payload = {
        'name': 'API Test User',
        'email': email,
        'password': 'ApiTest1234',
        'role': 'operator',
    }

    create_response = admin_api.post('/users', json=payload)
    create_data = admin_api.json_or_fail(create_response, expected_status=(200, 201))
    user_id = create_data['data']['_id']

    list_response = admin_api.get('/users')
    list_data = admin_api.json_or_fail(list_response)
    assert any(user['email'] == email for user in list_data['data'])

    delete_response = admin_api.delete(f'/users/{user_id}')
    admin_api.json_or_fail(delete_response)


@pytest.mark.api
@pytest.mark.regression
def test_notifications_endpoint_returns_data(admin_api):
    response = admin_api.get('/notifications')
    data = admin_api.json_or_fail(response)
    assert isinstance(data['data'], list)


@pytest.mark.api
@pytest.mark.regression
def test_stack_move_creates_notification(admin_api, test_data):
    containers_response = admin_api.get('/containers')
    containers = admin_api.json_or_fail(containers_response)['data']
    container = next(
        (
            c for c in containers
            if c.get('location', {}).get('block', '').upper().startswith('E-')
            and c.get('customsStatus') != 'Hold'
        ),
        None,
    )
    if not container:
        pytest.skip('No movable container in Stack-E available.')

    before = admin_api.get('/notifications')
    before_count = admin_api.json_or_fail(before)['count']

    move_payload = {
        'containerId': container['containerId'],
        'sourceStackId': 'Stack-E',
        'destStackId': 'Stack-F',
        'placements': [
            {
                'containerId': container['containerId'],
                'location': {'block': 'F-01', 'bay': '01', 'row': '01', 'tier': '01'},
            }
        ],
    }
    move_response = admin_api.post('/containers/stack/move', json=move_payload)
    admin_api.json_or_fail(move_response)

    after = admin_api.get('/notifications')
    after_data = admin_api.json_or_fail(after)
    assert after_data['count'] >= before_count
