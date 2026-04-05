# 💳 Finance Data Processing Backend

A professional, secure Node.js backend for managing financial records with a strictly enforced Role-Based Access Control (RBAC) system.

---

## 📂 Project Structure
```text
src/
├── app.js               # App entry & middleware
├── server.js            # Server listener
├── config/              # DB connection & migrations
├── controllers/         # Business logic
├── middleware/          # Auth & Validation
└── routes/              # API Endpoints (with Swagger JSDoc)
```

---

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=supersecretkey
PORT=8000
```

### 3. Database Initialization
Run the migration script to create tables and seed the base roles:
```bash
npm run migrate
```

### 4. Seed Test Users
To test the system immediately with all three roles, run the seeding script:
```bash
node seed.js
```

### 5. Start the Server
```bash
npm run dev
```

---

## 📡 API Overview

| Module | Description | Access |
| :--- | :--- | :--- |
| **Auth** | Login, Registration, and Session management (JWT) | Public |
| **Users** | Full CRUD for account management | Admin Only |
| **Records** | Financial transactions (Income/Expenses) | Admin, Analyst |
| **Dashboard** | Aggregated financial insights and trends | Admin, Analyst, Viewer |

**Interactive API Documentation:** [http://localhost:8000/api-docs](http://localhost:8000/api-docs)

---

## 🧠 Assumptions & Decisions

1. **Role Hierarchy**: We assumed a strict "least-privilege" model. A **Viewer** should not see raw transaction data, only higher-level analytics.
2. **Soft Deletion**: Financial records are never truly "deleted." We use a `deleted_at` timestamp. This preserves the data integrity if an audit is required.
3. **Data Types**: All currency is stored as `NUMERIC(15, 2)` to avoid floating-point arithmetic errors commonly found in `FLOAT` or `REAL` types.

---

## ⚖️ Tradeoffs

1. **Raw SQL vs. ORM**: I chose **Raw SQL** (using `pg` pool) instead of an ORM like Sequelize.
   - *Reason:* Dashboard queries (monthly trends, weekly aggregations) are much more performant and readable in raw SQL than complex ORM function chains.
2. **Stateless Auth**: Used JWT instead of Sessions for simplicity and scalability.
   - *Tradeoff:* We cannot "force logout" a user instantly until the token expires, though I mitigated this by checking the user's `status` in the DB on every request.

---

# 📖 **[TESTING_GUIDE.MD](./TESTING_GUIDE.md) - CLICK HERE FOR COMPLETE TESTING STEPS**
