import json
import os


def load_test_data(file_name: str = 'test_data.json') -> dict:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    testdata_path = os.path.join(base_dir, '..', 'testdata', file_name)
    with open(testdata_path, 'r', encoding='utf-8') as file:
        return json.load(file)


def get_base_url(config: dict, override: str | None = None) -> str:
    if override:
        return override
    return config.get('base_url', 'http://localhost:5173')


def get_api_url(config: dict, override: str | None = None) -> str:
    if override:
        return override
    return config.get('api_url', 'http://localhost:5000/api')
