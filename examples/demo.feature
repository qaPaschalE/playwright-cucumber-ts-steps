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
