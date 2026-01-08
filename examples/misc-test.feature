@misc
Feature: Miscellaneous Utilities

  Scenario: Timers and Focus
    Given I visit "https://the-internet.herokuapp.com/login"
    # 1. Test Focus
    When I find input by ID "username"
    When I focus
    # (Visual check: The cursor should be in the box)
    # 2. Test Wait (The test should pause here for 2 seconds)
    When I log "Starting wait..."
    When I wait for 2 seconds
    When I log "Wait finished."
    # 3. Test Blur (Unfocus)
    When I blur

  Scenario: Browser Storage
    Given I visit "https://the-internet.herokuapp.com/"
    # 4. Test Local Storage
    When I set local storage item "theme" to "dark_mode"
    When I get local storage item "theme"
    When I clear local storage
    # 5. Test Cookies
    When I set cookie "session_test" to "active"
    # We can verify cookies by clearing them (logs will confirm execution)
    When I clear all cookies
