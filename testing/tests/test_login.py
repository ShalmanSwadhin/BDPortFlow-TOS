import pytest


@pytest.mark.ui
@pytest.mark.smoke
def test_login_with_valid_admin_credentials(login_page, dashboard_page, env):
    login_page.load()
    login_page.login(env['credentials']['admin']['email'], env['credentials']['admin']['password'])
    assert dashboard_page.is_dashboard_loaded(), 'Dashboard should load after valid login.'


@pytest.mark.ui
@pytest.mark.regression
def test_login_fails_with_invalid_credentials(login_page):
    login_page.load()
    login_page.login('invalid@bdport.gov.bd', 'invalidPassword123')
    error_message = login_page.get_error_message()
    assert error_message, 'An error message should be displayed for invalid login attempts.'
    assert 'Login failed' in error_message or 'Please enter email and password' in error_message
