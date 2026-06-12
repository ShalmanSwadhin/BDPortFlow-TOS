import pytest


@pytest.mark.ui
@pytest.mark.smoke
def test_login_with_valid_admin_credentials(login_page, dashboard_page, env):
    login_page.load()
    login_page.login(env['credentials']['admin']['email'], env['credentials']['admin']['password'])
    assert dashboard_page.is_dashboard_loaded(), 'Sidebar should be visible after valid login.'


@pytest.mark.ui
@pytest.mark.regression
def test_login_fails_with_invalid_credentials(login_page):
    login_page.load()
    login_page.login('invalid@bdport.gov.bd', 'invalidPassword123', wait_for_dashboard=False)
    error_message = login_page.get_error_message()
    redirected_to_public = login_page.is_public_landing_visible()
    assert error_message or redirected_to_public, (
        'Invalid login should show an error or redirect back to the public landing page.'
    )
