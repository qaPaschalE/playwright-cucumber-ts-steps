@Keyboard
Feature: Keyboard Interaction Test

  Scenario: Search using Keyboard
    Given I pw visit "https://google.com"
    # 1. Focus Search Box
    When I pw find element by selector "textarea[name='q']"
    When I pw focus
    # 2. Type and Press Enter
    When I pw press keys "Playwright Testing"
    When I pw press key "Enter"
    # 3. Verify Results
    Then I pw expect the url to contain "search"
