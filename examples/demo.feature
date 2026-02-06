@smoke 
Feature: Search Engine Test

  Scenario: Visit Herokuapp and Validate
    Given I visit "https://the-internet.herokuapp.com/"
    Then I expect the title to contain "The Internet"
    And I expect "a[href='/abtest']" to be visible

  Scenario: Advanced Elements -- Dropdown Test
    Given I visit "https://the-internet.herokuapp.com/dropdown"
    When I select option "Option 1" from "#dropdown"
    Then I expect "#dropdown" to have value "1"

  @api
  Scenario: Fetch User Data
    When I make a GET request to "https://jsonplaceholder.typicode.com/users/1"
    Then I expect the response status to be 200
    And I expect the response property "name" to be "Leanne Graham"
    And I expect the response property "address.city" to be "Gwenborough"
