@inputs
Feature: Inputs and Forms Test

  Scenario: Form Filling (Login)
    Given I visit "https://the-internet.herokuapp.com/login"
    # 1. Fill Form
    When I find input by ID "username"
    When I type "tomsmith"
    When I find input by ID "password"
    When I type "SuperSecretPassword!"
    # 2. Submit
    When I submit
    # 3. Verify Success
    # FIRST: Check URL (this confirms page load)
    Then I expect the url to contain "secure"
    # SECOND: Find a NEW element on this page (The green success banner)
    When I find element by selector "#flash"
    # THIRD: Now check if THAT element is visible
    Then I expect element to be visible

  Scenario: Checkboxes and Dropdowns
    Given I visit "https://the-internet.herokuapp.com/checkboxes"
    # 4. Test Checkboxes
    # Find the first checkbox (it is usually unchecked)
    When I find elements by selector "input[type='checkbox']"
    When I get first element
    When I check
    Then I expect element to be enabled
    # 5. Test Dropdowns
    Given I visit "https://the-internet.herokuapp.com/dropdown"
    When I find element by selector "#dropdown"
    When I select option "Option 2"
    # Verify the value (Option 2 has value "2")
    Then I expect element to have value "2"
