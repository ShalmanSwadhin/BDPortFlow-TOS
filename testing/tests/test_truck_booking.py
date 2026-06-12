import pytest


@pytest.mark.ui
@pytest.mark.regression
def test_book_truck_slot(login_page, dashboard_page, truck_appointment_page, test_data, env):
    login_page.load()
    login_page.login(env['credentials']['operator']['email'], env['credentials']['operator']['password'])
    assert dashboard_page.is_dashboard_loaded(), 'Dashboard should be visible after login.'

    dashboard_page.open_truck_booking()
    assert truck_appointment_page.is_slot_selected(), 'Truck booking module should be displayed.'

    booking = test_data['truck_booking']
    truck_appointment_page.select_date('2026-12-31')
    truck_appointment_page.choose_slot('08:00 AM')
    truck_appointment_page.fill_booking_details(
        truck=booking['truck'],
        container=booking['container'],
        driver=booking['driver'],
        contact=booking['contact'],
        operation_type=booking['operationType'],
    )
    truck_appointment_page.submit_booking()

    assert truck_appointment_page.booking_exists(booking['truck']), 'The new truck booking should be visible in the booking history.'
