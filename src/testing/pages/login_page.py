import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pages.base_page import BasePage


class LoginPage(BasePage):
    PUBLIC_SIGNIN = (By.XPATH, "//button[contains(normalize-space(.), 'Sign In')]")
    EMAIL_INPUT = (By.CSS_SELECTOR, "input[placeholder='Enter your email or username']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "input[placeholder='Enter your password']")
    LOGIN_SUBMIT = (By.XPATH, "//form//button[@type='submit']")
    MAIN_LAYOUT = (By.XPATH, "//aside[contains(@class, 'border-r')]")
    ERROR_MESSAGE = (
        By.XPATH,
        "//div[contains(@class, 'text-red-400') and (contains(., 'Login failed') or contains(., 'Please enter email and password'))]",
    )

    def __init__(self, driver, base_url):
        super().__init__(driver, timeout=15)
        self.base_url = base_url

    def load(self):
        self.driver.get(self.base_url)
        try:
            self.click_element(self.PUBLIC_SIGNIN)
        except Exception:
            pass
        self.wait_for_element(self.EMAIL_INPUT)
        return self

    def login(self, email: str, password: str, wait_for_dashboard: bool = True):
        self.enter_text(self.EMAIL_INPUT, email)
        self.enter_text(self.PASSWORD_INPUT, password)
        self.click_element(self.LOGIN_SUBMIT)
        if wait_for_dashboard:
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located(self.MAIN_LAYOUT)
            )
            time.sleep(1)

    def is_public_landing_visible(self) -> bool:
        try:
            return self.wait_for_element(self.PUBLIC_SIGNIN, timeout=5).is_displayed()
        except Exception:
            return False

    def get_error_message(self) -> str:
        try:
            return self.get_text(self.ERROR_MESSAGE)
        except Exception:
            return ''
