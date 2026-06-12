import pytest
from datetime import date, datetime, timedelta


@pytest.mark.ui
@pytest.mark.regression
def test_book_truck_slot(login_page, dashboard_page, truck_appointment_page, test_data, env):
    login_page.load()
    login_page.login(env['credentials']['admin']['email'], env['credentials']['admin']['password'])
    assert dashboard_page.is_dashboard_loaded(), 'Dashboard should be visible after login.'

    dashboard_page.open_truck_booking()
    assert truck_appointment_page.is_module_loaded(), 'Truck booking module should be displayed.'

    booking = test_data['truck_booking']
    future_date = (date.today() + timedelta(days=120)).isoformat()
    truck_number = f"DHK-TST-{datetime.now().strftime('%H%M%S')}"

    truck_appointment_page.select_date(future_date)
    truck_appointment_page.choose_slot(booking['slot'])
    assert truck_appointment_page.is_booking_form_visible(), 'Booking form should appear after slot selection.'

    truck_appointment_page.fill_booking_details(
        truck=truck_number,
        container=booking['container'],
        driver=booking['driver'],
        contact=booking['contact'],
        operation_type=booking['operationType'],
    )
    truck_appointment_page.submit_booking()

    assert truck_appointment_page.wait_for_confirmation(truck_number), (
        'Booking should show a success toast or appear in recent bookings.'
    )
