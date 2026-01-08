@find
Feature: Advanced Element Finding

  Scenario: Find, Pick, and Store Elements
    # 1. Setup
    Given I visit "https://the-internet.herokuapp.com/"
    # 2. Test Finding Single Element (Heading)
    When I find heading by text "Welcome to the-internet"
    # 3. Test Finding List of Elements (Links)
    When I find elements by selector "ul li a"
    # 4. Test Selecting from List
    When I get 18th element
    When I store element text as "tenthLink"
    When I click
    And I wait for 2000 milliseconds
    # 5. Verify Alias Usage (We clicked 10th link, should be 'File Upload')
    Then I expect the url to contain "upload"
    # 6. Test Finding by Exact Text
    Given I visit "https://the-internet.herokuapp.com/login"
    When I find element by text "Login"
    When I click
