@misc
Feature: Miscellaneous Utilities

  Scenario: Timers and Focus
    Given I pw visit "https://the-internet.herokuapp.com/login"
    # 1. Test Focus
    When I pw find input by ID "username"
    When I pw focus
    # (Visual check: The cursor should be in the box)
    # 2. Test Wait (The test should pause here for 2 seconds)
    When I pw log "Starting wait..."
    When I pw wait for 2 seconds
    When I pw log "Wait finished."
    # 3. Test Blur (Unfocus)
    When I pw blur

  Scenario: Browser Storage
    Given I pw visit "https://the-internet.herokuapp.com/"
    # 4. Test Local Storage
    When I pw set local storage item "theme" to "dark_mode"
    When I pw get local storage item "theme"
    When I pw clear local storage
    # 5. Test Cookies
    When I pw set cookie "session_test" to "active"
    # We can verify cookies by clearing them (logs will confirm execution)
    When I pw clear all cookies
