import pytest


def _find_movable_container(admin_api):
    response = admin_api.get('/containers')
    payload = admin_api.json_or_fail(response)
    for container in payload['data']:
        block = container.get('location', {}).get('block', '')
        if block.upper().startswith('D-') and container.get('customsStatus') != 'Hold':
            return container
    pytest.skip('No cleared container found in Stack-D for move test.')


@pytest.mark.api
@pytest.mark.regression
def test_stack_move_updates_container_location(admin_api, test_data):
    container = _find_movable_container(admin_api)
    container_id = container['containerId']
    source_block = container['location']['block'][0].upper()
    dest_block = test_data['stack_move']['destStackId'].split('-')[-1]

    move_payload = {
        'containerId': container_id,
        'sourceStackId': f'Stack-{source_block}',
        'destStackId': test_data['stack_move']['destStackId'],
        'placements': [
            {
                'containerId': container_id,
                'location': {
                    'block': f'{dest_block}-01',
                    'bay': '01',
                    'row': '01',
                    'tier': '01',
                },
            }
        ],
        'optimizationApplied': False,
        'overrideWarning': False,
    }

    move_response = admin_api.post('/containers/stack/move', json=move_payload)
    move_data = admin_api.json_or_fail(move_response)

    assert move_data['data']['movedContainer']['location']['block'].upper().startswith(f'{dest_block}-')

    verify_response = admin_api.get(f'/containers/{container_id}')
    verify_data = admin_api.json_or_fail(verify_response)
    assert verify_data['data']['location']['block'].upper().startswith(f'{dest_block}-')
    assert verify_data['data']['location']['bay'] == '01'


@pytest.mark.api
@pytest.mark.regression
def test_stack_move_rejects_customs_hold(admin_api):
    response = admin_api.get('/containers')
    payload = admin_api.json_or_fail(response)
    held = next((c for c in payload['data'] if c.get('customsStatus') == 'Hold'), None)
    if not held:
        pytest.skip('No customs-hold container available.')

    move_payload = {
        'containerId': held['containerId'],
        'sourceStackId': 'Stack-D',
        'destStackId': 'Stack-B',
        'placements': [
            {
                'containerId': held['containerId'],
                'location': {'block': 'B-01', 'bay': '01', 'row': '01', 'tier': '01'},
            }
        ],
    }
    move_response = admin_api.post('/containers/stack/move', json=move_payload)
    assert move_response.status_code == 400
    assert move_response.json()['success'] is False
