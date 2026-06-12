import os
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.edge.options import Options as EdgeOptions
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.edge.service import Service as EdgeService
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager


def _install_with_retry(install_callable, attempts: int = 3, stale_seconds: int = 60):
    last_exc = None
    for attempt in range(attempts):
        try:
            return install_callable()
        except TimeoutError as e:
            last_exc = e
            # Try clearing stale lock files under ~/.wdm
            try:
                wdm_dir = os.path.join(os.path.expanduser('~'), '.wdm')
                if os.path.isdir(wdm_dir):
                    for fname in os.listdir(wdm_dir):
                        if fname.startswith('.wdm-lock'):
                            fpath = os.path.join(wdm_dir, fname)
                            try:
                                if time.time() - os.path.getmtime(fpath) > stale_seconds:
                                    os.remove(fpath)
                            except Exception:
                                pass
            except Exception:
                pass
            time.sleep(1 + attempt)
    # final attempt (let it raise if it fails)
    if last_exc:
        return install_callable()
    return install_callable()


class DriverFactory:
    @staticmethod
    def create_driver(browser: str = 'chrome', headless: bool = False):
        browser = browser.lower()

        if browser == 'edge':
            options = EdgeOptions()
            if headless:
                options.add_argument('--headless=new')
            options.add_argument('--disable-gpu')
            options.add_argument('--window-size=1920,1080')
            options.add_argument('--no-sandbox')
            driver_path = _install_with_retry(lambda: EdgeChromiumDriverManager().install())
            service = EdgeService(driver_path)
            driver = webdriver.Edge(service=service, options=options)
        else:
            options = ChromeOptions()
            if headless:
                options.add_argument('--headless=new')
            options.add_argument('--disable-gpu')
            options.add_argument('--window-size=1920,1080')
            options.add_argument('--no-sandbox')
            driver_path = _install_with_retry(lambda: ChromeDriverManager().install())
            service = ChromeService(driver_path)
            driver = webdriver.Chrome(service=service, options=options)

        try:
            driver.maximize_window()
        except Exception:
            pass
        return driver
