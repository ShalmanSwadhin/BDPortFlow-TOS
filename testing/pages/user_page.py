from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class UserPage(BasePage):
    SEARCH_INPUT = (By.CSS_SELECTOR, "input[placeholder='Search users...']")
    ROLE_FILTER = (By.XPATH, "//select[contains(., 'All Roles')]")
    ADD_USER_BUTTON = (By.XPATH, "//button[normalize-space()='Add User']")
    CREATE_USER_BUTTON = (By.XPATH, "//button[normalize-space()='Create User']")
    CANCEL_BUTTON = (By.XPATH, "//button[normalize-space()='Cancel']")
    USER_ROW = "//tr[.//div[contains(., '{name}')] and .//div[contains(., '{email}')]]"
    EDIT_BUTTON = ".//button[@title='Edit user' or contains(., 'Edit')]"
    TOGGLE_STATUS_BUTTON = ".//button[@title='Deactivate' or @title='Activate' or contains(., 'Deactivate') or contains(., 'Activate')]"
    DELETE_BUTTON = ".//button[@title='Delete user' or contains(., 'Delete')]"
    NAME_FIELD = (By.CSS_SELECTOR, "input[placeholder='Full Name']")
    EMAIL_FIELD = (By.CSS_SELECTOR, "input[placeholder='Email Address']")
    ROLE_SELECT = (By.XPATH, "//select[contains(., 'Select Role') or contains(., 'Admin')]")
    PASSWORD_FIELD = (By.CSS_SELECTOR, "input[placeholder='Initial Password']")

    def __init__(self, driver):
        super().__init__(driver)

    def search_user(self, query: str):
        self.enter_text(self.SEARCH_INPUT, query)

    def filter_role(self, role: str):
        self.select_dropdown(self.ROLE_FILTER, visible_text=role)

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

    def get_user_row_actions(self, name: str, email: str):
        row_locator = (By.XPATH, self.USER_ROW.format(name=name, email=email))
        row = self.wait_for_element(row_locator)
        edit = row.find_element(By.XPATH, self.EDIT_BUTTON)
        toggle = row.find_element(By.XPATH, self.TOGGLE_STATUS_BUTTON)
        delete = row.find_element(By.XPATH, self.DELETE_BUTTON)
        return edit, toggle, delete

    def open_edit_user(self, name: str, email: str):
        edit, _, _ = self.get_user_row_actions(name, email)
        edit.click()

    def toggle_user_status(self, name: str, email: str):
        _, toggle, _ = self.get_user_row_actions(name, email)
        toggle.click()

    def delete_user(self, name: str, email: str):
        _, _, delete = self.get_user_row_actions(name, email)
        delete.click()

    def confirm_deletion(self):
        self.driver.switch_to.alert.accept()
