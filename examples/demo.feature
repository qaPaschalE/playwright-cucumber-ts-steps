@smoke
Feature: Search Engine Test

  Scenario: Visit Herokuapp and Validate
    Given I pw visit "https://the-internet.herokuapp.com/"
    Then I pw expect the title to contain "The Internet"
    And I pw expect "a[href='/abtest']" to be visible

  Scenario: Advanced Elements -- Dropdown Test
    Given I pw visit "https://the-internet.herokuapp.com/dropdown"
    When I pw select option "Option 1" from "#dropdown"
    Then I pw get element by selector "#dropdown" to have value "1"

  @api
  Scenario: Fetch User Data
    When I pw make a GET request to "https://jsonplaceholder.typicode.com/users/1"
    Then I pw expect the response status to be 200
    And I pw expect the response property "name" to be "Leanne Graham"
    And I pw expect the response property "address.city" to be "Gwenborough"

  @api
  Scenario: API Testing - POST Request with Data Table
    When I pw make a POST request to "https://jsonplaceholder.typicode.com/posts" with data:
      | title | My New Post        |
      | body  | This is the content|
      | userId| 1                  |
    Then I pw expect the response status to be 201
    And I pw expect the response property "title" to be "My New Post"
    And I pw expect the response property "id" to be "101"

  @api
  Scenario: API Testing - DELETE Request
    When I pw make a DELETE request to "https://jsonplaceholder.typicode.com/posts/1"
    Then I pw expect the response status to be 200

  @api
  Scenario: API Testing - Response Body Contains
    When I pw make a GET request to "https://jsonplaceholder.typicode.com/users/1"
    Then I pw expect the response status to be 200
    And I pw expect the response body to contain "Leanne Graham"
    And I pw expect the response body to contain "Sincere@april.biz"
