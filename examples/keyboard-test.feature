@Keyboard
Feature: Keyboard Interaction Test

  Scenario: Search using Keyboard
    Given I visit "https://google.com"
    # 1. Focus Search Box
    When I find element by selector "textarea[name='q']"
    When I focus
    # 2. Type and Press Enter
    When I press keys "Playwright Testing"
    When I press key "Enter"
    # 3. Verify Results
    Then I expect the url to contain "search"
