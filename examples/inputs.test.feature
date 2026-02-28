@inputs
Feature: Inputs and Forms Test

  Scenario: Form Filling (Login)
    Given I pw visit "https://the-internet.herokuapp.com/login"
    # 1. Fill Form
    When I pw find input by ID "username"
    When I pw type "tomsmith"
    When I pw find input by ID "password"
    When I pw type "SuperSecretPassword!"
    # 2. Submit
    When I pw submit
    # 3. Verify Success
    # FIRST: Check URL (this confirms page load)
    Then I pw expect the url to contain "secure"
    # SECOND: Find a NEW element on this page (The green success banner)
    When I pw find element by selector "#flash"
    # THIRD: Now check if THAT element is visible
    Then I pw expect element to be visible

  Scenario: Checkboxes and Dropdowns
    Given I pw visit "https://the-internet.herokuapp.com/checkboxes"
    # 4. Test Checkboxes
    # Find the first checkbox (it is usually unchecked)
    When I pw find elements by selector "input[type='checkbox']"
    When I pw get first element
    When I pw check
    Then I pw expect element to be enabled
    # 5. Test Dropdowns
    Given I pw visit "https://the-internet.herokuapp.com/dropdown"
    When I pw find element by selector "#dropdown"
    When I pw select option "Option 2"
    # Verify the value (Option 2 has value "2")
    Then I pw expect element to have value "2"
