import requests


class ApiClient:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.token = None
        self.session = requests.Session()
        self.session.headers.update({'Content-Type': 'application/json'})

    def login(self, email: str, password: str) -> dict:
        response = self.session.post(
            f'{self.base_url}/auth/login',
            json={'email': email, 'password': password},
            timeout=30,
        )
        response.raise_for_status()
        payload = response.json()
        if not payload.get('success'):
            raise AssertionError(payload.get('message', 'Login failed'))
        self.token = payload['data']['token']
        self.session.headers['Authorization'] = f'Bearer {self.token}'
        return payload

    def get(self, path: str, **kwargs):
        return self.session.get(f'{self.base_url}{path}', timeout=30, **kwargs)

    def post(self, path: str, **kwargs):
        return self.session.post(f'{self.base_url}{path}', timeout=30, **kwargs)

    def put(self, path: str, **kwargs):
        return self.session.put(f'{self.base_url}{path}', timeout=30, **kwargs)

    def delete(self, path: str, **kwargs):
        return self.session.delete(f'{self.base_url}{path}', timeout=30, **kwargs)

    def json_or_fail(self, response, expected_status=(200, 201)):
        if response.status_code not in expected_status:
            raise AssertionError(
                f'Expected {expected_status}, got {response.status_code}: {response.text}'
            )
        payload = response.json()
        if not payload.get('success', True):
            raise AssertionError(payload.get('message', 'Request failed'))
        return payload
