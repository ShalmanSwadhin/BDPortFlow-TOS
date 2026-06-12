import time
from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class UserPage(BasePage):
    SEARCH_INPUT = (By.CSS_SELECTOR, "input[placeholder='Search users...']")
    ADD_USER_BUTTON = (By.XPATH, "//button[normalize-space()='Add User']")
    CREATE_USER_BUTTON = (By.XPATH, "//button[normalize-space()='Create User']")
    USER_ROW = "//tr[.//div[contains(., '{name}')] and .//div[contains(., '{email}')]]"
    DELETE_BUTTON = ".//button[@title='Delete user']"
    NAME_FIELD = (By.CSS_SELECTOR, "input[placeholder='Full Name']")
    EMAIL_FIELD = (By.CSS_SELECTOR, "input[placeholder='Email Address']")
    ROLE_SELECT = (By.XPATH, "//input[@placeholder='Full Name']/ancestor::div[contains(@class,'grid')]/select")
    PASSWORD_FIELD = (By.CSS_SELECTOR, "input[placeholder='Initial Password']")

    def search_user(self, query: str):
        field = self.wait_for_element(self.SEARCH_INPUT)
        field.clear()
        field.send_keys(query)
        time.sleep(0.5)

    def is_user_visible(self, name: str, email: str) -> bool:
        locator = (By.XPATH, self.USER_ROW.format(name=name, email=email))
        return len(self.find_elements(locator)) > 0

    def open_add_user_form(self):
        self.click_element(self.ADD_USER_BUTTON)

    def enter_new_user_details(self, name: str, email: str, role: str, password: str):
        self.enter_text(self.NAME_FIELD, name)
        self.enter_text(self.EMAIL_FIELD, email)
        self.select_dropdown(self.ROLE_SELECT, visible_text=role)
        self.enter_text(self.PASSWORD_FIELD, password)

    def create_user(self):
        self.click_element(self.CREATE_USER_BUTTON)
        time.sleep(1)

    def delete_user(self, name: str, email: str):
        row_locator = (By.XPATH, self.USER_ROW.format(name=name, email=email))
        row = self.wait_for_element(row_locator)
        delete = row.find_element(By.XPATH, self.DELETE_BUTTON)
        delete.click()

    def confirm_deletion(self):
        self.driver.switch_to.alert.accept()
        time.sleep(1)
