@alert
Feature: Alert

  Scenario: OK alert
    Given I visit "https://testpages.eviltester.com/styled/alerts/alert-test.html"
    When I click on button "Show alert box"
    Then I see text "You triggered and handled the alert dialog"
