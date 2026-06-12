import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pages.base_page import BasePage


class TruckAppointmentPage(BasePage):
    DATE_INPUT = (By.CSS_SELECTOR, "input[type='date']")
    TIME_SLOT_BUTTON = "//button[.//div[normalize-space()='{time}']]"
    TRUCK_INPUT = (By.XPATH, "//input[@placeholder='DHK-GA-1234']")
    CONTAINER_INPUT = (By.XPATH, "//input[@placeholder='TCLU3456789']")
    DRIVER_INPUT = (By.XPATH, "//input[@placeholder='Enter driver name']")
    CONTACT_INPUT = (By.XPATH, "//input[@placeholder='+880 1XXX-XXXXXX']")
    OPERATION_TYPE_SELECT = (By.XPATH, "//label[contains(., 'Operation Type')]/following-sibling::select")
    MODULE_HEADER = (By.XPATH, "//h3[contains(., 'Available Time Slots')]")
    BOOK_SLOT_HEADER = (By.XPATH, "//h3[contains(., 'Book Slot:')]")
    SUBMIT_BUTTON = (By.XPATH, "//button[normalize-space()='Confirm Booking']")
    SUCCESS_TOAST = (By.XPATH, "//*[contains(text(), 'Booking confirmed successfully')]")
    BOOKING_ROW = "//*[contains(@class, 'text-slate-300') and contains(normalize-space(), '{truck}')]"

    def select_date(self, date_str: str):
        self.enter_text(self.DATE_INPUT, date_str)

    def choose_slot(self, slot_time: str):
        locator = (By.XPATH, self.TIME_SLOT_BUTTON.format(time=slot_time))
        self.click_element(locator)

    def fill_booking_details(self, truck: str, container: str, driver: str, contact: str, operation_type: str):
        self.enter_text(self.TRUCK_INPUT, truck)
        self.enter_text(self.CONTAINER_INPUT, container)
        self.enter_text(self.DRIVER_INPUT, driver)
        self.enter_text(self.CONTACT_INPUT, contact)
        self.select_dropdown(self.OPERATION_TYPE_SELECT, visible_text=operation_type)

    def submit_booking(self):
        self.scroll_to_element(self.SUBMIT_BUTTON)
        self.click_element(self.SUBMIT_BUTTON)

    def wait_for_confirmation(self, truck: str) -> bool:
        toast_locator = self.SUCCESS_TOAST
        booking_locator = (By.XPATH, self.BOOKING_ROW.format(truck=truck))
        end_time = time.time() + 20
        while time.time() < end_time:
            if self.driver.find_elements(*toast_locator):
                return True
            if self.driver.find_elements(*booking_locator):
                return True
            time.sleep(0.5)
        return False

    def is_module_loaded(self) -> bool:
        return self.wait_for_element(self.MODULE_HEADER).is_displayed()

    def is_booking_form_visible(self) -> bool:
        return self.wait_for_element(self.BOOK_SLOT_HEADER).is_displayed()
