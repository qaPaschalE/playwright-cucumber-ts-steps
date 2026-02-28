@mouse
Feature: Mouse and Scroll Actions

  Scenario: Hover and Scroll
    Given I pw visit "https://the-internet.herokuapp.com/hovers"
    # Test Hovering (User 1's avatar)
    When I pw hover over the element ".figure:nth-child(3) img"
    # Test State: Check if the caption appeared after hover
    Then I pw expect element to be visible
    When I pw find element by text "name: user1"
    Then I pw expect element to be visible
    # Test Scrolling
    Given I pw visit "https://the-internet.herokuapp.com/infinite_scroll"
    When I pw scroll to "bottom"
    When I pw scroll mouse window to position top:0 left:0
