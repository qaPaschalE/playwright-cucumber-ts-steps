@mobile
Feature: Mobile Web Testing

  Scenario: Responsive Layout Check
    Given I pw visit "https://the-internet.herokuapp.com/"
    # 1. Desktop View
    When I pw simulate device "Desktop"
    When I pw log "Checking Desktop View..."
    # (In a real app, you would check for a desktop navigation bar here)
    # 2. Switch to Mobile
    When I pw simulate device "iPhone 12"
    When I pw log "Switched to iPhone 12 View..."
    # 3. Test Touch Interaction
    When I pw tap element "a[href='/login']"
    Then I pw expect the url to contain "login"

  Scenario: Geolocation Test
    Given I pw visit "https://the-internet.herokuapp.com/geolocation"
    # 4. Set Location to Google HQ
    When I pw set geolocation to lat: 37.422 long: -122.084
    # 5. Trigger Location Check (This button usually asks for permission, which we auto-granted)
    When I pw find element by selector "button"
    When I pw tap
    # 6. Verify Google Maps Link appears (shows coordinates were read)
    When I pw find element by selector "#map-link"
    Then I pw expect element to be visible
