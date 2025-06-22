@forms @critical
Feature: httpbin

  Background:
    When I set Playwright config "defaultCommandTimeout" to "30000"
    Given I visit "https://httpbin.org/forms/post"

  Scenario: See form
    Then I see label "Customer name"
    And I do not see label "Customers"
    And I see text "Large"
    And I do not see text "Extra Large"
    And I see button "Submit order"
    And I do not see button "Enter"
    When I find input by label text "E-mail address"
    And I type "john.smith@example.com"
    Then I see value "john.smith@example.com"
    And I do not see value "foo"
    And I see input value "john.smith@example.com"
    And I see input value contains "example"
    When I find textarea by label text "Delivery instructions"
    And I type "Please leave the box on the porch."
    Then I see textarea value "Please leave the box on the porch."
    And I see textarea value contains "leave the box"

  Scenario: Input form
    When I find element by label text "Customer name"
    And I type "John Smith"
    Then I see input value "John Smith"
    When I find element by label text "Telephone"
    And I type "1234567890"
    Then I see input value "1234567890"
    When I find input by label text "E-mail address"
    And I type "john.smith@example.com"
    Then I see value "john.smith@example.com"
    When I click on label "Small"
    And I click on label "Bacon"
    And I click on label "Extra Cheese"
    And I wait 1 second
    When I find input by name "delivery"
    And I type "12:00"
    When I find textarea by name "comments"
    And I type "Please leave the box on the porch."
    Then I find textarea by label text "Delivery instructions"
    And I see value "Please leave the box on the porch."

  Scenario: Input form Table Data
    When I fill the following "form" form data:
      | Target                   | Value                              |
      | input[name="custname"]   | John Smith                         |
      | input[name="custtel"]    |                         1234567890 |
      | input[name="custemail"]  | john.smith@example.com             |
      | label:has-text("Small")  | click                              |
      | label:has-text("Bacon")  | click                              |
      | label:has-text("Cheese") | click                              |
      | [name="delivery"]        |                              12:00 |
      | [name="comments"]        | Please leave the box on the porch. |
    Then I find textarea by label text "Delivery instructions"
    And I see value "Please leave the box on the porch."
