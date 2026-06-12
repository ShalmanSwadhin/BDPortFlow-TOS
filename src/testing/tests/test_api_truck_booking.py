import pytest
import uuid
from datetime import date, timedelta


@pytest.mark.api
@pytest.mark.regression
def test_create_truck_booking_persists(admin_api):
    truck_number = f'DHK-API-{uuid.uuid4().hex[:6].upper()}'
    appointment_date = (date.today() + timedelta(days=45)).isoformat()

    payload = {
        'truckNumber': truck_number,
        'driverName': 'API Test Driver',
        'driverContact': '+8801711111111',
        'containerId': 'TCLU8888888',
        'appointmentDate': appointment_date,
        'appointmentTime': '09:00',
        'purpose': 'Pickup',
    }

    create_response = admin_api.post('/trucks', json=payload)
    create_data = admin_api.json_or_fail(create_response, expected_status=(200, 201))
    booking_id = create_data['data']['_id']

    list_response = admin_api.get('/bookings', params={'date': appointment_date})
    list_data = admin_api.json_or_fail(list_response)
    assert list_data['date'] == appointment_date
    assert any(item['truckNumber'] == truck_number for item in list_data['data'])

    delete_response = admin_api.delete(f'/trucks/{booking_id}')
    admin_api.json_or_fail(delete_response)


@pytest.mark.api
@pytest.mark.regression
def test_duplicate_truck_booking_rejected(admin_api):
    truck_number = f'DHK-DUP-{uuid.uuid4().hex[:6].upper()}'
    appointment_date = (date.today() + timedelta(days=50)).isoformat()
    payload = {
        'truckNumber': truck_number,
        'driverName': 'Duplicate Driver',
        'driverContact': '+8801722222222',
        'containerId': 'TCLU7777777',
        'appointmentDate': appointment_date,
        'appointmentTime': '10:00',
        'purpose': 'Delivery',
    }

    first = admin_api.post('/trucks', json=payload)
    first_data = admin_api.json_or_fail(first, expected_status=(200, 201))
    booking_id = first_data['data']['_id']

    duplicate = admin_api.post('/trucks', json=payload)
    assert duplicate.status_code == 400
    assert duplicate.json()['success'] is False

    admin_api.delete(f'/trucks/{booking_id}')


@pytest.mark.api
@pytest.mark.regression
def test_bookings_filtered_by_date_only(admin_api):
    future_date = (date.today() + timedelta(days=60)).isoformat()
    other_date = (date.today() + timedelta(days=61)).isoformat()
    truck_number = f'DHK-DATE-{uuid.uuid4().hex[:6].upper()}'

    payload = {
        'truckNumber': truck_number,
        'driverName': 'Date Filter Driver',
        'driverContact': '+8801733333333',
        'containerId': 'TCLU6666666',
        'appointmentDate': future_date,
        'appointmentTime': '11:00',
        'purpose': 'Pickup',
    }

    create_response = admin_api.post('/trucks', json=payload)
    create_data = admin_api.json_or_fail(create_response, expected_status=(200, 201))
    booking_id = create_data['data']['_id']

    matching = admin_api.get('/bookings', params={'date': future_date})
    matching_data = admin_api.json_or_fail(matching)
    assert matching_data['date'] == future_date
    assert any(item['_id'] == booking_id for item in matching_data['data'])

    other = admin_api.get('/bookings', params={'date': other_date})
    other_data = admin_api.json_or_fail(other)
    assert all(item['_id'] != booking_id for item in other_data['data'])

    admin_api.delete(f'/trucks/{booking_id}')


@pytest.mark.api
@pytest.mark.regression
def test_reschedule_moves_booking_between_dates(admin_api):
    original_date = (date.today() + timedelta(days=70)).isoformat()
    new_date = (date.today() + timedelta(days=71)).isoformat()
    truck_number = f'DHK-RS-{uuid.uuid4().hex[:6].upper()}'

    payload = {
        'truckNumber': truck_number,
        'driverName': 'Reschedule Driver',
        'driverContact': '+8801744444444',
        'containerId': 'TCLU5555555',
        'appointmentDate': original_date,
        'appointmentTime': '12:00',
        'purpose': 'Delivery',
    }

    create_response = admin_api.post('/trucks', json=payload)
    create_data = admin_api.json_or_fail(create_response, expected_status=(200, 201))
    booking_id = create_data['data']['_id']

    update_response = admin_api.put(f'/trucks/{booking_id}', json={
        'appointmentDate': new_date,
        'appointmentTime': '13:00',
    })
    admin_api.json_or_fail(update_response)

    original_list = admin_api.get('/bookings', params={'date': original_date})
    original_data = admin_api.json_or_fail(original_list)
    assert all(item['_id'] != booking_id for item in original_data['data'])

    new_list = admin_api.get('/bookings', params={'date': new_date})
    new_data = admin_api.json_or_fail(new_list)
    assert any(item['_id'] == booking_id for item in new_data['data'])

    admin_api.delete(f'/trucks/{booking_id}')


@pytest.mark.api
@pytest.mark.regression
def test_cancelled_booking_removed_from_date_view(admin_api):
    target_date = (date.today() + timedelta(days=80)).isoformat()
    truck_number = f'DHK-CX-{uuid.uuid4().hex[:6].upper()}'

    payload = {
        'truckNumber': truck_number,
        'driverName': 'Cancel Driver',
        'driverContact': '+8801755555555',
        'containerId': 'TCLU4444444',
        'appointmentDate': target_date,
        'appointmentTime': '14:00',
        'purpose': 'Pickup',
    }

    create_response = admin_api.post('/trucks', json=payload)
    create_data = admin_api.json_or_fail(create_response, expected_status=(200, 201))
    booking_id = create_data['data']['_id']

    before_cancel = admin_api.get('/bookings', params={'date': target_date})
    before_data = admin_api.json_or_fail(before_cancel)
    assert any(item['_id'] == booking_id for item in before_data['data'])

    cancel_response = admin_api.delete(f'/trucks/{booking_id}')
    admin_api.json_or_fail(cancel_response)

    after_cancel = admin_api.get('/bookings', params={'date': target_date})
    after_data = admin_api.json_or_fail(after_cancel)
    assert all(item['_id'] != booking_id for item in after_data['data'])
