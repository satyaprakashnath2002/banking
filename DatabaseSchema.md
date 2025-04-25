# Banking Application Database Schema

## Database Tables and Relationships

### Users Table
- **id**: INT, Primary Key, Auto Increment
- **firstName**: VARCHAR(255), Not Null
- **lastName**: VARCHAR(255), Not Null
- **email**: VARCHAR(255), Not Null, Unique
- **password**: VARCHAR(255), Not Null
- **phoneNumber**: VARCHAR(15), Not Null
- **address**: VARCHAR(255), Not Null
- **city**: VARCHAR(100), Not Null
- **state**: VARCHAR(100), Not Null
- **zipCode**: VARCHAR(20), Not Null
- **role**: ENUM('admin', 'customer'), Not Null, Default 'customer'
- **isActive**: BOOLEAN, Default true
- **lastLogin**: DATETIME
- **createdAt**: DATETIME, Not Null
- **updatedAt**: DATETIME, Not Null

### Accounts Table
- **id**: INT, Primary Key, Auto Increment
- **userId**: INT, Foreign Key (Users.id), Not Null
- **accountNumber**: VARCHAR(16), Not Null, Unique
- **accountType**: ENUM('savings', 'checking', 'fixed_deposit'), Not Null, Default 'savings'
- **balance**: DECIMAL(15,2), Not Null, Default 0.00
- **isActive**: BOOLEAN, Default true
- **kycVerified**: BOOLEAN, Default false
- **dateOpened**: DATETIME, Default CURRENT_TIMESTAMP
- **lastActivity**: DATETIME, Default CURRENT_TIMESTAMP
- **createdAt**: DATETIME, Not Null
- **updatedAt**: DATETIME, Not Null

### Transactions Table
- **id**: INT, Primary Key, Auto Increment
- **accountId**: INT, Foreign Key (Accounts.id), Not Null
- **transactionType**: ENUM('deposit', 'withdrawal', 'transfer', 'fee'), Not Null
- **amount**: DECIMAL(15,2), Not Null
- **description**: VARCHAR(255)
- **reference**: VARCHAR(50)
- **toAccount**: VARCHAR(16) (for transfers)
- **fromAccount**: VARCHAR(16) (for transfers)
- **balanceAfter**: DECIMAL(15,2), Not Null
- **status**: ENUM('pending', 'completed', 'failed', 'cancelled'), Not Null, Default 'completed'
- **performedBy**: INT, Not Null (User ID)
- **createdAt**: DATETIME, Not Null
- **updatedAt**: DATETIME, Not Null

### Beneficiaries Table
- **id**: INT, Primary Key, Auto Increment
- **accountId**: INT, Foreign Key (Accounts.id), Not Null
- **name**: VARCHAR(255), Not Null
- **accountNumber**: VARCHAR(255), Not Null
- **bankName**: VARCHAR(255), Not Null
- **transferLimit**: DECIMAL(15,2), Not Null, Default 10000.00
- **nickname**: VARCHAR(100)
- **isActive**: BOOLEAN, Default true
- **createdAt**: DATETIME, Not Null
- **updatedAt**: DATETIME, Not Null

## Relationships

### One-to-One Relationships
- One User can have one Account (1:1)

### One-to-Many Relationships
- One Account can have many Transactions (1:N)
- One Account can have many Beneficiaries (1:N)

## Database Normalization

The database schema follows normalization principles:

- **First Normal Form (1NF)**: All tables have a primary key, and all columns contain atomic values.
- **Second Normal Form (2NF)**: All non-key attributes are fully dependent on the primary key.
- **Third Normal Form (3NF)**: No transitive dependencies between non-key attributes.

## ACID Properties

- **Atomicity**: Transactions in the system are atomic, especially for money transfers, deposits, and withdrawals, using Sequelize transactions.
- **Consistency**: Foreign key constraints and validation ensure data consistency.
- **Isolation**: Transactions are isolated from each other.
- **Durability**: Once a transaction is committed, it remains in the system even after system restarts.

## Indexes

The following columns should be indexed for better performance:
- Users.email
- Accounts.userId
- Accounts.accountNumber
- Transactions.accountId
- Transactions.createdAt
- Beneficiaries.accountId

## Schema Diagram

```
+----------------+       +------------------+       +-------------------+
|    Users       |       |     Accounts     |       |   Transactions    |
+----------------+       +------------------+       +-------------------+
| id (PK)        |<----->| id (PK)          |<----->| id (PK)           |
| firstName      |       | userId (FK)      |       | accountId (FK)    |
| lastName       |       | accountNumber    |       | transactionType   |
| email          |       | accountType      |       | amount            |
| password       |       | balance          |       | description       |
| phoneNumber    |       | isActive         |       | reference         |
| address        |       | kycVerified      |       | toAccount         |
| city           |       | dateOpened       |       | fromAccount       |
| state          |       | lastActivity     |       | balanceAfter      |
| zipCode        |       | createdAt        |       | status            |
| role           |       | updatedAt        |       | performedBy (FK)  |
| isActive       |       +------------------+       | createdAt         |
| lastLogin      |                                  | updatedAt         |
| createdAt      |                                  +-------------------+
| updatedAt      |
+----------------+
       |
       |
       |
+----------------+
|  Beneficiaries |
+----------------+
| id (PK)        |
| accountId (FK) |
| name           |
| accountNumber  |
| bankName       |
| transferLimit  |
| nickname       |
| isActive       |
| createdAt      |
| updatedAt      |
+----------------+
``` 