@network
Feature: Network Mocking and API

  Scenario: Intercept and Mock Response
    # 1. Mock the API
    When I pw intercept URL "**/api/users" and stub body:
      """
      {
        "users": [
          {"id": 1, "name": "Mocked User"}
        ]
      }
      """
    # 2. Trigger request (simulating UI call or direct fetch)
    When I pw make request to "https://example.com/api/users"
    # 3. Assert (We need to add API assertions next, but logs will show success)
    # Check console for "📡 Stubbed" and "✅ Status: 200"

  Scenario: Real POST Request
    When I pw make a POST request to "https://jsonplaceholder.typicode.com/posts" with JSON body:
      """
      {
        "title": "foo",
        "body": "bar",
        "userId": 1
      }
      """
    # Check console for Status: 201
