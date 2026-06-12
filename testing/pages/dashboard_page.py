from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class DashboardPage(BasePage):
    HEADER = (By.CSS_SELECTOR, 'h2, h1')
    MODULE_BUTTON = "//button[normalize-space()='{label}']"
    LOGOUT_BUTTON = (By.XPATH, "//button[@title='Logout' or contains(., 'Logout')]")
    PROFILE_BUTTON = (By.XPATH, "//button[contains(@title, 'View Profile') or contains(., 'Profile')]")

    def __init__(self, driver):
        super().__init__(driver)

    def is_dashboard_loaded(self) -> bool:
        return 'Dashboard' in self.get_text(self.HEADER)

    def navigate_to_module(self, module_label: str):
        locator = (By.XPATH, self.MODULE_BUTTON.format(label=module_label))
        self.click_element(locator)

    def open_admin_panel(self):
        self.navigate_to_module('Admin Panel')

    def open_truck_booking(self):
        self.navigate_to_module('Truck Booking')

    def open_gate_operations(self):
        self.navigate_to_module('Gate Operations')

    def open_billing_tariff(self):
        self.navigate_to_module('Billing & Tariff')

    def get_metric_value(self, metric_label: str) -> str:
        locator = (By.XPATH, f"//div[contains(., '{metric_label}')]/preceding-sibling::div[1]")
        return self.get_text(locator)

    def logout(self):
        self.click_element(self.LOGOUT_BUTTON)

    def open_profile(self):
        self.click_element(self.PROFILE_BUTTON)
