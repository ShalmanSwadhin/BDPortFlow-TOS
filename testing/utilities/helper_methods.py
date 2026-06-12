from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.remote.webdriver import WebDriver


def select_option(select_element: WebElement, value: str = None, visible_text: str = None):
    select = Select(select_element)
    if value:
        select.select_by_value(value)
    elif visible_text:
        select.select_by_visible_text(visible_text)
    else:
        raise ValueError('Either value or visible_text must be provided')


def hover(driver: WebDriver, element: WebElement):
    ActionChains(driver).move_to_element(element).perform()
