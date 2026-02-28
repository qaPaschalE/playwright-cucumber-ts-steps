@find
Feature: Advanced Element Finding

  Scenario: Find, Pick, and Store Elements
    # 1. Setup
    Given I pw visit "https://the-internet.herokuapp.com/"
    # 2. Test Finding Single Element (Heading)
    When I pw find heading by text "Welcome to the-internet"
    # 3. Test Finding List of Elements (Links)
    When I pw find elements by selector "ul li a"
    # 4. Test Selecting from List
    When I pw get 18th element
    When I pw store element text as "tenthLink"
    When I pw click
    And I pw wait for 2000 milliseconds
    # 5. Verify Alias Usage (We clicked 10th link, should be 'File Upload')
    Then I pw expect the url to contain "upload"
    # 6. Test Finding by Exact Text
    Given I pw visit "https://the-internet.herokuapp.com/login"
    When I pw find element by text "Login"
    When I pw click
