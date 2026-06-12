import pytest


@pytest.mark.ui
@pytest.mark.regression
def test_create_and_delete_user(login_page, dashboard_page, user_page, test_data, env):
    login_page.load()
    login_page.login(env['credentials']['admin']['email'], env['credentials']['admin']['password'])
    assert dashboard_page.is_dashboard_loaded(), 'Dashboard should be visible after login.'

    dashboard_page.open_admin_panel()

    user = test_data['users']['new_user']
    user_page.open_add_user_form()
    user_page.enter_new_user_details(user['name'], user['email'], user['role'], user['password'])
    user_page.create_user()

    user_page.search_user(user['email'])
    assert user_page.is_user_visible(user['name'], user['email']), 'Newly created user should appear in the user list.'

    user_page.delete_user(user['name'], user['email'])
    user_page.confirm_deletion()

    user_page.search_user(user['email'])
    assert not user_page.is_user_visible(user['name'], user['email']), 'Deleted user should no longer be visible in the user list.'
