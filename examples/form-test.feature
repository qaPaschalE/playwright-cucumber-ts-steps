@form
Feature: Data Table Form Step

  Scenario: Login using Data Table
    Given I visit "https://the-internet.herokuapp.com/login"
    # One step to rule them all:
    When I fill the following "Login Action" form data:
      | Target        | Value                                                                         |
      | #username     | tomsmith                                                                      |
      | #password     | SuperSecretPassword!                                                          |
      | button.radius | click                                                                         |
      | wait          | wait:1000                                                                     |
      | #flash        | assert:visible                                                                |
      | .subheader    | assert:text:Welcome to the Secure Area. When you are done click logout below. |
