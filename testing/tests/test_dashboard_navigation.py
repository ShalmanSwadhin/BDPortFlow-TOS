import pytest


@pytest.mark.ui
@pytest.mark.regression
def test_open_truck_booking_from_dashboard(login_page, dashboard_page, truck_appointment_page, env):
    login_page.load()
    login_page.login(env['credentials']['admin']['email'], env['credentials']['admin']['password'])
    assert dashboard_page.is_dashboard_loaded(), 'Dashboard should be visible after login.'

    dashboard_page.open_truck_booking()
    assert truck_appointment_page.is_slot_selected(), 'Truck booking page should be shown after navigation.'
