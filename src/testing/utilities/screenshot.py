import os
from datetime import datetime


def save_screenshot(driver, name: str = 'failure') -> str:
    screenshots_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'screenshots')
    os.makedirs(screenshots_dir, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'{name}_{timestamp}.png'
    file_path = os.path.join(screenshots_dir, filename)
    driver.save_screenshot(file_path)
    return file_path
