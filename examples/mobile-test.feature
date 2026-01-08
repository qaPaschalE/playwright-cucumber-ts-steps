@mobile
Feature: Mobile Web Testing

  Scenario: Responsive Layout Check
    Given I visit "https://the-internet.herokuapp.com/"
    # 1. Desktop View
    When I simulate device "Desktop"
    When I log "Checking Desktop View..."
    # (In a real app, you would check for a desktop navigation bar here)
    # 2. Switch to Mobile
    When I simulate device "iPhone 12"
    When I log "Switched to iPhone 12 View..."
    # 3. Test Touch Interaction
    When I tap element "a[href='/login']"
    Then I expect the url to contain "login"

  Scenario: Geolocation Test
    Given I visit "https://the-internet.herokuapp.com/geolocation"
    # 4. Set Location to Google HQ
    When I set geolocation to lat: 37.422 long: -122.084
    # 5. Trigger Location Check (This button usually asks for permission, which we auto-granted)
    When I find element by selector "button"
    When I tap
    # 6. Verify Google Maps Link appears (shows coordinates were read)
    When I find element by selector "#map-link"
    Then I expect element to be visible
