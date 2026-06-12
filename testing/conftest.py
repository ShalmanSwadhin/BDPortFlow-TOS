import os
import sys
import pytest
from selenium.webdriver.common.by import By
from utilities.driver_factory import DriverFactory
from utilities.config_reader import load_test_data, get_base_url, get_api_url
from utilities.logger import get_logger
from utilities.screenshot import save_screenshot

# Ensure the testing package path is available for imports
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)


def pytest_addoption(parser):
    parser.addoption('--browser', action='store', default='chrome', help='Browser to run tests: chrome or edge')
    parser.addoption('--base-url', action='store', default=None, help='Base URL for the application under test')
    parser.addoption('--api-url', action='store', default=None, help='API URL for backend tests')
    parser.addoption('--headless', action='store_true', default=False, help='Run browser in headless mode')


@pytest.fixture(scope='session')
def config():
    config_data = load_test_data('test_data.json')
    return config_data


@pytest.fixture(scope='session')
def env(request, config):
    browser = request.config.getoption('--browser')
    headless = request.config.getoption('--headless')
    base_url = get_base_url(config, request.config.getoption('--base-url'))
    api_url = get_api_url(config, request.config.getoption('--api-url'))

    return {
        'browser': browser,
        'headless': headless,
        'base_url': base_url,
        'api_url': api_url,
        'credentials': config.get('credentials', {})
    }


@pytest.fixture(scope='session')
def logger():
    return get_logger('bdportflow_tests')


@pytest.fixture(scope='function')
def driver(request, env, logger):
    driver = DriverFactory.create_driver(browser=env['browser'], headless=env['headless'])
    request.node.driver = driver
    logger.info('Browser launched: %s', env['browser'])

    yield driver

    if driver:
        driver.quit()
        logger.info('Browser instance closed')


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


def pytest_runtest_makereport(item, call):
    outcome = yield
    result = outcome.get_result()

    if result.when == 'call' and result.failed:
        driver = getattr(item, 'driver', None) or item.funcargs.get('driver')
        if driver:
            screenshot_path = save_screenshot(driver, name=item.name)
            logger = get_logger('bdportflow_tests')
            logger.error('Test failed: %s', item.name)
            logger.error('Saved screenshot to %s', screenshot_path)
            if hasattr(result, 'longrepr'):
                result.longrepr = f'{result.longrepr}\nScreenshot: {screenshot_path}'
