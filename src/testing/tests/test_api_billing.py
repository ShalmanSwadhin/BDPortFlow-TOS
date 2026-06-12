import pytest
import uuid


@pytest.mark.api
@pytest.mark.regression
def test_create_invoice_generates_number(admin_api, test_data):
    billing = dict(test_data['billing'])
    billing['customerEmail'] = f"billing.{uuid.uuid4().hex[:8]}@example.com"

    response = admin_api.post('/billing', json=billing)
    data = admin_api.json_or_fail(response, expected_status=(200, 201))

    invoice = data['data']
    assert invoice.get('invoiceNumber')
    assert invoice.get('dueDate')
    assert invoice['total'] == billing['total']

    delete_response = admin_api.delete(f"/billing/{invoice['_id']}")
    admin_api.json_or_fail(delete_response)


@pytest.mark.api
@pytest.mark.regression
def test_billing_requires_customer_name(admin_api):
    response = admin_api.post('/billing', json={'total': 1000, 'services': []})
    assert response.status_code == 400
    assert response.json()['success'] is False
