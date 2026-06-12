import os
import sys

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import pytest
from utilities.driver_factory import DriverFactory
from utilities.config_reader import load_test_data, get_base_url, get_api_url
from utilities.logger import get_logger
from utilities.screenshot import save_screenshot
from utilities.api_client import ApiClient


def pytest_addoption(parser):
    parser.addoption('--browser', action='store', default='chrome', help='Browser: chrome or edge')
    parser.addoption('--base-url', action='store', default=None, help='Frontend base URL')
    parser.addoption('--api-url', action='store', default=None, help='Backend API URL')
    parser.addoption('--headless', action='store_true', default=False, help='Run browser headless')


@pytest.fixture(scope='session')
def config():
    return load_test_data('test_data.json')


@pytest.fixture(scope='session')
def env(request, config):
    return {
        'browser': request.config.getoption('--browser'),
        'headless': request.config.getoption('--headless'),
        'base_url': get_base_url(config, request.config.getoption('--base-url')),
        'api_url': get_api_url(config, request.config.getoption('--api-url')),
        'credentials': config.get('credentials', {}),
    }


@pytest.fixture(scope='session')
def logger():
    return get_logger('bdportflow_tests')


@pytest.fixture(scope='function', autouse=True)
def require_frontend_for_ui_tests(request, env):
    if request.node.get_closest_marker('ui') is None:
        return
    import requests
    try:
        response = requests.get(env['base_url'], timeout=3)
        if response.status_code >= 500:
            pytest.skip(f"Frontend not healthy at {env['base_url']}")
    except requests.RequestException:
        pytest.skip(
            f"Frontend not running at {env['base_url']}. "
            'Start it with `npm run dev` and pass --base-url if using a different port.'
        )


@pytest.fixture(scope='session')
def api_client(env):
    client = ApiClient(env['api_url'])
    yield client
    client.session.close()


@pytest.fixture(scope='session')
def admin_api(api_client, env):
    api_client.login(
        env['credentials']['admin']['email'],
        env['credentials']['admin']['password'],
    )
    return api_client


@pytest.fixture(scope='function')
def driver(request, env, logger):
    driver = DriverFactory.create_driver(browser=env['browser'], headless=env['headless'])
    request.node.driver = driver
    logger.info('Browser launched: %s', env['browser'])
    yield driver
    if driver:
        driver.quit()
        logger.info('Browser closed')


@pytest.fixture(scope='function')
def login_page(driver, env):
    from pages.login_page import LoginPage
    return LoginPage(driver, env['base_url'])


@pytest.fixture(scope='function')
def dashboard_page(driver):
    from pages.dashboard_page import DashboardPage
    return DashboardPage(driver)


@pytest.fixture(scope='function')
def user_page(driver):
    from pages.user_page import UserPage
    return UserPage(driver)


@pytest.fixture(scope='function')
def truck_appointment_page(driver):
    from pages.truck_appointment_page import TruckAppointmentPage
    return TruckAppointmentPage(driver)


@pytest.fixture(scope='session')
def test_data(config):
    return config


@pytest.hookimpl(hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    result = outcome.get_result()
    if result.when == 'call' and result.failed:
        driver = getattr(item, 'driver', None) or item.funcargs.get('driver', None)
        if driver:
            screenshot_path = save_screenshot(driver, name=item.name)
            logger = get_logger('bdportflow_tests')
            logger.error('Test failed: %s', item.name)
            logger.error('Screenshot: %s', screenshot_path)
