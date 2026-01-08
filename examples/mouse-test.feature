@mouse
Feature: Mouse and Scroll Actions

  Scenario: Hover and Scroll
    Given I visit "https://the-internet.herokuapp.com/hovers"
    # Test Hovering (User 1's avatar)
    When I hover over the element ".figure:nth-child(3) img"
    # Test State: Check if the caption appeared after hover
    Then I expect element to be visible
    When I find element by text "name: user1"
    Then I expect element to be visible
    # Test Scrolling
    Given I visit "https://the-internet.herokuapp.com/infinite_scroll"
    When I scroll to "bottom"
    When I scroll mouse window to position top:0 left:0
