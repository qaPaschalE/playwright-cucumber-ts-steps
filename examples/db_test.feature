Feature: Database Testing
  @database @PostgreSQL
  Scenario: Verify Order Placement
    Given I click "#submit-order"
    And I run the database query "SELECT status, total FROM orders WHERE user_id = 101 ORDER BY created_at DESC LIMIT 1"
    Then I expect the database to return 1 record
    And I expect the first database record to contain:
      | status | pending |
      | total  | 59.99   |

  @database @PostgreSQL
  Scenario: Verify Multiple Orders Exist
    When I navigate to "/orders"
    And I run the database query "SELECT id, status, user_id FROM orders WHERE user_id = 101 ORDER BY created_at DESC LIMIT 5"
    Then I expect the database to return 3 records
    And I expect all database records to contain:
      | user_id | 101 |
    And I expect database row 2 to contain:
      | status | completed |
    And I expect database column "id" to exist
    And I expect database column "status" to contain "pending"

  @database @PostgreSQL
  Scenario: Verify No Deleted Orders Exist
    When I apply filter "deleted=false"
    And I run the database query "SELECT * FROM orders WHERE user_id = 999 AND deleted_at IS NOT NULL"
    Then I expect the database to return no records

  @database @SQLite3
  Scenario: Verify Column Data Types
    When I fill "#bio-input" with "Automation Engineer"
    And I click "#save-bio"
    Then I run the database query "SELECT bio, age, is_active FROM profiles WHERE username = 'tester123'"
    And I expect the first database record to contain:
      | bio | Automation Engineer |
    And I expect database column "age" to be of type "number"
    And I expect database column "bio" to be of type "string"
    And I expect database column "is_active" to be of type "boolean"

  @database @MySQL
  Scenario: Verify Soft Delete - Account Deactivation
    When I click "text=Deactivate Account"
    Then I run the database query "SELECT deleted_at, is_active FROM users WHERE email = 'bob@example.com'"
    And I expect the first database record to contain:
      | is_active | 0 |

  @database @MySQL
  Scenario: Verify Email Exists in User Table
    When I navigate to "/users"
    And I run the database query "SELECT id, email, status FROM users WHERE status = 'active' LIMIT 10"
    Then I expect the database to return 6 records
    And I expect database column "email" to contain "bob@example.com"
    And I expect all database records to contain:
      | status | active |

  @database @MSSQL
  Scenario: Check Inventory Sync - Enterprise Data Sync
    Given I run the database query "SELECT top 1 Quantity FROM WarehouseInventory WHERE SKU = 'PRD-99'"
    Then I expect the database to return 1 record
    And I expect the first database record to contain:
      | Quantity | 500 |

  @database @MSSQL
  Scenario: Verify SKU with Low Inventory
    When I run the database query "SELECT top 5 SKU, Quantity, ReorderLevel FROM WarehouseInventory WHERE Quantity < ReorderLevel ORDER BY Quantity ASC"
    Then I expect the database to return 3 records
    And I expect database column "SKU" to exist
    And I expect database row 1 to contain:
      | SKU | CRITICAL-001 |

  @database @MongoDB
  Scenario: Verify JSON Metadata - NoSQL Content Verification
    When I update the document settings
    And I run the database query "db.collection('settings').find({appId: '123'})"
    Then I expect the database to return 1 record
    And I expect the first database record to contain:
      | theme | dark    |
      | notifications | 1 |

  @database @MongoDB
  Scenario: Verify Multiple User Settings Exist
    When I navigate to "/settings"
    And I run the database query "db.collection('userSettings').find({status: 'active'}).limit(10)"
    Then I expect the database to return 7 records
    And I expect all database records to contain:
      | status | active |
    And I expect database column "userId" to exist
