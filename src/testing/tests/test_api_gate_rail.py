import pytest


@pytest.mark.api
@pytest.mark.regression
def test_gate_operations_list(admin_api):
    response = admin_api.get('/gates')
    data = admin_api.json_or_fail(response)
    assert isinstance(data['data'], list)
    assert data['count'] >= 0


@pytest.mark.api
@pytest.mark.regression
def test_gate_transactions_endpoint(admin_api):
    response = admin_api.get('/gates/transactions/all')
    data = admin_api.json_or_fail(response)
    assert isinstance(data['data'], list)


@pytest.mark.api
@pytest.mark.regression
def test_rail_coordination_list(admin_api):
    response = admin_api.get('/rails')
    data = admin_api.json_or_fail(response)
    assert isinstance(data['data'], list)
    assert data['count'] >= 0
