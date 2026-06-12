import pytest


@pytest.mark.api
@pytest.mark.regression
def test_technician_dispatch_persists_and_notifies(admin_api):
    reefers_response = admin_api.get('/reefers')
    reefers_data = admin_api.json_or_fail(reefers_response)
    reefer = next((r for r in reefers_data['data'] if r.get('containerId')), None)
    if not reefer:
        pytest.skip('No reefer records available for dispatch test.')

    container_id = reefer['containerId']
    technician_name = 'Rafiq Ahmed'

    before_notifications = admin_api.get('/notifications')
    before_count = admin_api.json_or_fail(before_notifications)['count']

    dispatch_response = admin_api.post('/technicians', json={
        'containerId': container_id,
        'reeferId': reefer['_id'],
        'issueType': 'Temperature',
        'priority': 'High',
        'technicianName': technician_name,
        'notes': f'Technician {technician_name} dispatched',
    })
    dispatch_data = admin_api.json_or_fail(dispatch_response, expected_status=(200, 201))
    request = dispatch_data['data']

    assert dispatch_data['success'] is True
    assert request['containerId'] == container_id
    assert request['technicianName'] == technician_name
    assert request['status'] == 'Dispatched'
    assert request['resolutionStatus'] == 'Open'
    assert request['dispatchedAt'] is not None
    assert request['requestedBy'] is not None

    requests_response = admin_api.get('/technicians', params={'containerId': container_id})
    requests_data = admin_api.json_or_fail(requests_response)
    assert any(item['_id'] == request['_id'] for item in requests_data['data'])

    reefer_response = admin_api.get(f"/reefers/{reefer['_id']}")
    reefer_data = admin_api.json_or_fail(reefer_response)['data']
    assert any(
        alert.get('type') == 'Technician Request'
        and technician_name in alert.get('message', '')
        for alert in reefer_data.get('alerts', [])
    )

    after_notifications = admin_api.get('/notifications')
    after_data = admin_api.json_or_fail(after_notifications)
    assert after_data['count'] >= before_count + 1
    assert any(
        n.get('action') == 'Technician Dispatch'
        and container_id in n.get('message', '')
        for n in after_data['data']
    )

    audit_response = admin_api.get('/audit', params={'moduleName': 'Reefer Operations'})
    audit_data = admin_api.json_or_fail(audit_response)
    assert any(
        entry.get('actionType') == 'dispatch'
        and container_id in (entry.get('description') or '')
        for entry in audit_data.get('data', [])
    )
