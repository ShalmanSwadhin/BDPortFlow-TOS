from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class DashboardPage(BasePage):
    SIDEBAR_DASHBOARD = (By.XPATH, "//aside//button[.//span[normalize-space()='Dashboard']]")
    MAIN_LAYOUT = (By.XPATH, "//aside[contains(@class, 'border-r')]")
    MODULE_BUTTON = "//aside//button[.//span[normalize-space()='{label}']]"

    def __init__(self, driver):
        super().__init__(driver, timeout=15)

    def is_dashboard_loaded(self) -> bool:
        try:
            return self.wait_for_element(self.MAIN_LAYOUT).is_displayed()
        except Exception:
            return False

    def navigate_to_module(self, module_label: str):
        locator = (By.XPATH, self.MODULE_BUTTON.format(label=module_label))
        self.click_element(locator)

    def open_admin_panel(self):
        self.navigate_to_module('Admin Panel')

    def open_truck_booking(self):
        self.navigate_to_module('Truck Booking')

    def open_container_stack(self):
        self.navigate_to_module('Container Stack')

    def open_gate_operations(self):
        self.navigate_to_module('Gate Operations')

    def open_billing_tariff(self):
        self.navigate_to_module('Billing & Tariff')

    def open_rail_coordination(self):
        self.navigate_to_module('Rail Coordination')
