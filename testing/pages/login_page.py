from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class LoginPage(BasePage):
    EMAIL_INPUT = (By.CSS_SELECTOR, "input[placeholder='Enter your email or username']")
    PASSWORD_INPUT = (By.CSS_SELECTOR, "input[placeholder='Enter your password']")
    SIGNIN_BUTTON = (By.XPATH, "//button[normalize-space()='Sign In']")
    FORGOT_PASSWORD_BUTTON = (By.XPATH, "//button[normalize-space()='Forgot Password?']")
    ERROR_MESSAGE = (By.XPATH, "//div[contains(@class, 'text-red-400') and contains(., 'Login failed') or contains(., 'Please enter email and password')]")

    def __init__(self, driver, base_url):
        super().__init__(driver)
        self.base_url = base_url

    def load(self):
        self.driver.get(self.base_url)
        return self

    def login(self, email: str, password: str):
        self.wait_for_element(self.EMAIL_INPUT)
        self.enter_text(self.EMAIL_INPUT, email)
        self.enter_text(self.PASSWORD_INPUT, password)
        self.click_element(self.SIGNIN_BUTTON)

    def is_login_page_displayed(self) -> bool:
        return self.wait_for_element(self.SIGNIN_BUTTON).is_displayed()

    def get_error_message(self) -> str:
        try:
            return self.get_text(self.ERROR_MESSAGE)
        except Exception:
            return ''
