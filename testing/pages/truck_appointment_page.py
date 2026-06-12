from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class TruckAppointmentPage(BasePage):
    DATE_INPUT = (By.CSS_SELECTOR, "input[type='date']")
    TIME_SLOT_BUTTON = "//button[normalize-space()='{time}']"
    TRUCK_INPUT = (By.XPATH, "//input[@placeholder='DHK-GA-1234']")
    CONTAINER_INPUT = (By.XPATH, "//input[@placeholder='TCLU3456789']")
    DRIVER_INPUT = (By.XPATH, "//input[@placeholder='Enter driver name']")
    CONTACT_INPUT = (By.XPATH, "//input[@placeholder='+880 1XXX-XXXXXX']")
    OPERATION_TYPE_SELECT = (By.XPATH, "//label[contains(., 'Operation Type')]/following-sibling::select")
    BOOK_SLOT_HEADER = (By.XPATH, "//h3[contains(., 'Book Slot:')]")
    SUBMIT_BUTTON = (By.XPATH, "//button[normalize-space()='Confirm Booking' or normalize-space()='Book Slot' or normalize-space()='Create Booking']")
    RECENT_BOOKING_CARD = "//div[contains(@class, 'bg-slate-800') or contains(@class, 'rounded-lg')]//span[contains(., '{truck}')]]"

    def __init__(self, driver):
        super().__init__(driver)

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
        self.click_element(self.SUBMIT_BUTTON)

    def is_slot_selected(self) -> bool:
        return self.wait_for_element(self.BOOK_SLOT_HEADER).is_displayed()

    def booking_exists(self, truck: str) -> bool:
        locator = (By.XPATH, self.RECENT_BOOKING_CARD.format(truck=truck))
        return len(self.find_elements(locator)) > 0
