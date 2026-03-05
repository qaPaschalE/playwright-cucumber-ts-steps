@smoke
Feature: Search Engine Test

  Scenario: Visit Herokuapp and Validate
    Given I pw visit "https://the-internet.herokuapp.com/"
    Then I pw expect the title to contain "The Internet"
    And I pw expect "a[href='/abtest']" to be visible

  Scenario: Advanced Elements -- Dropdown Test
    Given I pw visit "https://the-internet.herokuapp.com/dropdown"
    When I pw select option "Option 1" from "#dropdown"
    Then I pw get element by selector "#dropdown" to have value "1"

  @api
  Scenario: Fetch User Data
    When I pw make a GET request to "https://jsonplaceholder.typicode.com/users/1"
    Then I pw expect the response status to be "200"
    And I pw expect the response property "name" to be "Leanne Graham"
    And I pw expect the response property "address.city" to be "Gwenborough"

  @api
  Scenario: API Testing - POST Request with Data Table
    When I pw make a POST request to "https://jsonplaceholder.typicode.com/posts" with data:
      | title | My New Post        |
      | body  | This is the content|
      | userId| 1                  |
    Then I pw expect the response status to be "201"
    And I pw expect the response property "title" to be "My New Post"
    And I pw expect the response property "id" to be "101"

  @api
  Scenario: API Testing - DELETE Request
    When I pw make a DELETE request to "https://jsonplaceholder.typicode.com/posts/1"
    Then I pw expect the response status to be "200"

  @api
  Scenario: API Testing - Response Body Contains
    When I pw make a GET request to "https://jsonplaceholder.typicode.com/users/1"
    Then I pw expect the response status to be "200"
    And I pw expect the response body to contain "Leanne Graham"
    And I pw expect the response body to contain "Sincere"

  @faker
  Scenario: Faker - Generate Names
    When I pw generate first name as "firstName"
    And I pw generate last name as "lastName"
    And I pw generate full name as "fullName"
    And I pw generate job title as "jobTitle"

  @faker
  Scenario: Faker - Generate Text Content
    When I pw generate word as "word"
    And I pw generate 3 words as "words"
    And I pw generate sentence as "sentence"
    And I pw generate 2 sentences as "sentences"
    And I pw generate short paragraph as "shortParagraph"
    And I pw generate long paragraph as "longParagraph"
    And I pw generate 3 paragraphs as "paragraphs"

  @faker
  Scenario: Faker - Generate Numbers and Strings
    When I pw generate number as "number"
    And I pw generate number between 10 and 100 as "randomNumber"
    And I pw generate 5 digit number as "fiveDigitNumber"
    And I pw generate digit as "digit"
    And I pw generate 5 digits as "digits"
    And I pw generate float as "floatNumber"
    And I pw generate alphanumeric as "alphanumeric"
    And I pw generate alphanumeric with 10 characters as "alphanumeric10"
    And I pw generate alpha as "alpha"
    And I pw generate alpha with 10 characters as "alpha10"
    And I pw generate numeric as "numeric"
    And I pw generate numeric with 10 digits as "numeric10"
    And I pw generate uuid as "uuid"
    And I pw generate nanoid as "nanoid"

  @faker
  Scenario: Faker - Generate User Data
    When I pw generate username as "username"
    And I pw generate email as "email"
    And I pw generate password as "password"
    And I pw generate password with 12 characters as "password12"
    And I pw generate phone number as "phoneNumber"
    And I pw generate country code "+1" with random 10 digits as "randomPhoneNumber"

  @faker
  Scenario: Faker - Generate Address Data
    When I pw generate street address as "streetAddress"
    And I pw generate city as "city"
    And I pw generate state as "state"
    And I pw generate country as "country"
    And I pw generate zip code as "zipCode"

  @faker
  Scenario: Faker - Generate Company and Finance Data
    When I pw generate company name as "companyName"
    And I pw generate catch phrase as "catchPhrase"
    And I pw generate amount as "amount"
    And I pw generate amount between 100 and 1000 as "randomAmount"
    And I pw generate iban as "iban"
    And I pw generate credit card number as "creditCard"

  @faker
  Scenario: Faker - Generate Dates and Colors
    When I pw generate past date as "pastDate"
    And I pw generate future date as "futureDate"
    And I pw generate recent date as "recentDate"
    And I pw generate birthdate as "birthdate"
    And I pw generate color as "color"
    And I pw generate rgb color as "rgbColor"

  @faker
  Scenario: Faker - Text Length and Validation
    When I pw generate text with 50 characters as "loremText"
    And I pw get length of "loremText" as "textLength"
    Then I pw expect "@loremText" to have length 50
