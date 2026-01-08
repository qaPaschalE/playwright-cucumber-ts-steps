Feature: Click Action Test

  @smoke
  Scenario: Test Click Actions
    Given I visit "https://the-internet.herokuapp.com/add_remove_elements/"
    # Test 1: Click by Text (Fuzzy)
    When I click on text "Add Element"
    # Test 2: Click by Button Label (Role)
    When I click on button "Delete"
    # Test 3: Click by Selector (Regex step)
    When I click on selector "button[onclick='addElement()']"
    # Test 4: Double Click (State test)
    When I click on text "Add Element"
    When I double click
    
