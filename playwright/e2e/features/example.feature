@example
Feature: Example

  Scenario: See document title
    Given I visit "https://example.com/"
    Then I see document title "Example Domain"
      | log     | true |
      | timeout |    0 |
    And I see document title contains "Example"
      | log     | true |
      | timeout |    0 |

  Scenario: Heading
    Given I visit "https://example.com/"
    Then I see heading "Example Domain"
    When I find headings by text "Example Domain"
    Then I count 1 element
    When I find heading by text "Example Domain"
    Then I count 1 element
    And I do not see heading "Foo"
    When I make a "POST" request to "https://httpbin.org/post"
      | body | {"foo":"bar"} |

  Scenario: Text
    Given I visit "https://example.com/"
    Then I see text "Example Domain"
    And I see text "More information"
    And I do not see text "Lorem ipsum"

  Scenario: See and not see link
    Given I visit "https://example.com/"
    Then I see link "More information"
    And I do not see link "Lorem ipsum"

  Scenario: See attribute
    Given I visit "https://example.com/"
    When I find element by text "More information..."
    Then I see element has attribute "href"
    And I see element attribute "href" equals "https://www.iana.org/domains/example"
    When I find link by text "More information..."
    Then I see element attribute "href" contains "iana.org"

  Scenario: Reload and assert URL
    Given I visit "https://example.com/index.html"
    And I reload the page
    And I wait 1 millisecond
    Then I see URL "https://example.com/index.html"
    And I see URL contains "/index.html"
    Then I do not see URL "https://example.com/index.htm"
    And I do not see URL contains "foo"

  Scenario: Location
    Given I visit "https://example.com/?key=value#hash"
    Then I see location
      | hash     | #hash                               |
      | host     | example.com                         |
      | hostname | example.com                         |
      | href     | https://example.com/?key=value#hash |
      | origin   | https://example.com                 |
      | pathname | /                                   |
      | port     |                                     |
      | protocol | https:                              |
      | search   | ?key=value                          |

  Scenario: Hash
    Given I visit "https://example.com/#foobar"
    Then I see hash "#foobar"
    And I see hash contains "bar"

  Scenario: Search
    Given I visit "https://example.com/?key=value"
    Then I see search "?key=value"
    And I see search contains "key=value"

  Scenario: Screenshot
    Given I visit "https://example.com/"
    Then I screenshot
    And I screenshot "path/to/screenshot"

  Scenario: Log
    Then I log "Hello, world!"

  Scenario: Viewport
    Given I visit "https://example.com/"
    When I set viewport to "Iphone 6"
    And I set viewport to "ipadmini" and "landscape"
    And I set viewport to 800px by 600px

  Scenario: Get selector
    Given I visit "https://example.com/"
    When I get element by selector "p"

  Scenario: Playwright config
    When I set Playwright config "defaultCommandTimeout" to "10000"
    And I set Playwright config
      | defaultCommandTimeout | 10000 |
