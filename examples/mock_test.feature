Feature: Advanced API & Mocking

  # Scenario: Mocking and Tables
  #   # This passed! We keep it as is.
  #   Given I mock the API endpoint "*/**/users/1" with body '{"name": "Mocked User", "email": "fake@test.com"}'
  #   When I visit "https://jsonplaceholder.typicode.com/users/1"
  #   Then I expect "body" to contain text "Mocked User"

  # Scenario: API POST with Data Table
  #   # CHANGE: Use jsonplaceholder instead of reqres
  #   When I make a POST request to "https://jsonplaceholder.typicode.com/posts" with data:
  #     | title  | My New Post |
  #     | body   | Content     |
  #     | userId |           1 |
  #   Then I expect the response status to be 201
  #   # JSONPlaceholder returns the data you sent, so we verify 'title'
  #   And I expect the response property "title" to be "My New Post"

  Scenario: API POST with File Payload
    When I make a POST request to "https://jsonplaceholder.typicode.com/posts" with payload from "examples/data/post.json"
    Then I expect the response status to be 201
    And I expect the response property "title" to be "File Payload"
