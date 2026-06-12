from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from utilities.helper_methods import select_option, hover


class BasePage:
    def __init__(self, driver: WebDriver, timeout: int = 10):
        self.driver = driver
        self.timeout = timeout

    def find_element(self, locator: tuple) -> WebElement:
        return self.wait_for_element(locator)

    def find_elements(self, locator: tuple):
        return self.driver.find_elements(*locator)

    def click_element(self, locator: tuple):
        element = self.wait_until_clickable(locator)
        self.scroll_to_element(locator)
        element.click()
        return element

    def enter_text(self, locator: tuple, text: str):
        field = self.wait_for_element(locator)
        field.clear()
        field.send_keys(text)
        return field

    def clear_field(self, locator: tuple):
        field = self.wait_for_element(locator)
        field.clear()
        return field

    def get_text(self, locator: tuple) -> str:
        element = self.wait_for_element(locator)
        return element.text.strip()

    def get_attribute(self, locator: tuple, attribute_name: str) -> str:
        element = self.wait_for_element(locator)
        return element.get_attribute(attribute_name)

    def wait_for_element(self, locator: tuple, timeout: int | None = None) -> WebElement:
        wait_timeout = timeout or self.timeout
        return WebDriverWait(self.driver, wait_timeout).until(
            EC.presence_of_element_located(locator)
        )

    def wait_until_clickable(self, locator: tuple, timeout: int | None = None) -> WebElement:
        wait_timeout = timeout or self.timeout
        return WebDriverWait(self.driver, wait_timeout).until(
            EC.element_to_be_clickable(locator)
        )

    def scroll_to_element(self, locator: tuple):
        element = self.wait_for_element(locator)
        self.driver.execute_script('arguments[0].scrollIntoView({block: "center", inline: "center"});', element)
        return element

    def select_dropdown(self, locator: tuple, value: str = None, visible_text: str = None):
        dropdown = self.wait_for_element(locator)
        return select_option(dropdown, value=value, visible_text=visible_text)

    def hover_element(self, locator: tuple):
        element = self.wait_for_element(locator)
        hover(self.driver, element)
        return element

    def upload_file(self, locator: tuple, file_path: str):
        input_element = self.wait_for_element(locator)
        input_element.send_keys(file_path)
        return input_element

    def take_screenshot(self, file_name: str = 'screenshot') -> str:
        path = f'screenshots/{file_name}.png'
        self.driver.save_screenshot(path)
        return path
