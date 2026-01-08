Feature: Database Testing
  @database @PostgreSQL
  Scenario: Verify Order Placement
    Given I click "#submit-order"
    And I run the database query "SELECT status, total FROM orders WHERE user_id = 101 ORDER BY created_at DESC LIMIT 1"
    Then I expect the database to return 1 record
    And I expect the first database record to contain:
      | status | pending |
      | total  | 59.99   |


@database @sqlite3
    Scenario: Update User Bio
    When I fill "#bio-input" with "Automation Engineer"
    And I click "#save-bio"
    Then I run the database query "SELECT bio FROM profiles WHERE username = 'tester123'"
    And I expect the first database record to contain:
      | bio | Automation Engineer |

  @database @MySQL
  Scenario: Verify Soft Delete -Account Deactivation
    When I click "text=Deactivate Account"
    Then I run the database query "SELECT deleted_at, is_active FROM users WHERE email = 'bob@example.com'"
    And I expect the first database record to contain:
      | is_active | 0 |


  @database @MSSQL
  Scenario: Check Inventory Sync- Enterprise Data Sync

    Given I run the database query "SELECT top 1 Quantity FROM WarehouseInventory WHERE SKU = 'PRD-99'"
    Then I expect the database to return 1 record
    And I expect the first database record to contain:
      | Quantity | 500 |

  @database @MongoDB

  Scenario: Verify JSON Metadata -   NoSQL Content Verification
    When I update the document settings
    And I run the database query "db.collection('settings').find({appId: '123'})"
    Then I expect the database to return 1 record
    And I expect the first database record to contain:
      | theme | dark    |
      | notifications | 1 |