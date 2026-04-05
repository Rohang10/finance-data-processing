# 🚀 Step-by-Step API Testing Guide (Swagger)

This document provides exact instructions to test all APIs and verify that **Admin**, **Analyst**, and **Viewer** roles are working correctly.

---

## 🏗️ Phase 1: Preparation (One-Time Setup)

To test all roles, you need one test user for each role. Run this command in your terminal:

```bash
node seed.js
```
**Password for all users:** `Password123!`

---

## 🔐 Phase 2: Authentication (Login & Authorize)

### 1. Identify Your User
| Role | Email | Use for... |
| :--- | :--- | :--- |
| **Admin** | `admin@test.com` | Full access (Users, Records, Dashboard) |
| **Analyst** | `analyst@test.com` | Reports & Dashboard (Cannot Manage Users) |
| **Viewer** | `viewer@test.com` | Dashboard Only (Cannot see Records) |

### 2. Login
1. Open [http://localhost:8000/api-docs](http://localhost:8000/api-docs).
2. Go to `POST /api/auth/login`.
3. Click "Try it out".
4. Enter the email (e.g., `admin@test.com`) and password `Password123!`.
5. Click **Execute**.
6. **Copy the `token` string** from the response body (it looks like `eyJhbGci...`).

### 3. Authorize (CRITICAL)
1. Scroll to the very top of Swagger UI.
2. Click the green **"Authorize"** lock button.
3. Paste **ONLY** the token string (do NOT type "Bearer").
4. Click **Authorize** and then **Close**.
5. Your lock icon should now be **CLOSED 🔒**.

---

## 📁 Phase 3: Testing Financial Records (Analyst/Admin Only)

### 1. View All Records (`GET /api/records`)
1. **Admin/Analyst:** Click "Try it out", then "Execute".
   - ✅ **Success:** Returns a list of records.
2. **Viewer:** Click "Execute".
   - ❌ **Result:** Returns `403 Forbidden` (Correct behavior! Viewers can only see dashboards).

### 2. Create a Record (`POST /api/records`)
1. **Admin Only:** Use this body:
    ```json
    {
      "amount": 2500.50,
      "type": "income",
      "category": "Salary",
      "date": "2024-04-05",
      "notes": "Monthly payroll payoff"
    }
    ```
   - ✅ **Result:** Record created.

---

## 📊 Phase 4: Testing Dashboards (All Roles)

### 1. Recent Activity (`GET /api/dashboard/recent`)
1. Click "Execute" for **any** role (Viewer, Analyst, or Admin).
   - ✅ **Result:** All three roles are allowed to see the recent activity list.

### 2. Summary & Trends
- Test `GET /api/dashboard/summary`.
- Test `GET /api/dashboard/monthly-trend`.
- Test `GET /api/dashboard/weekly-trend`.
- ✅ **Result:** All roles have full access to these insights as required.

---

## 👤 Phase 5: Testing User Management (Admin Only)

### 1. List Users (`GET /api/users`)
1. **Logged in as Admin:** Click "Execute".
   - ✅ **Result:** Returns a full list of your test users.
2. **Logged in as Analyst/Viewer:** Click "Execute".
   - ❌ **Result:** Returns `403 Forbidden`. **Users are only manageable by Admins.**

---

## 💡 Pro Tips for Testing
- **Switching Roles:** If you want to switch from Admin to Viewer:
  1. Login with `viewer@test.com`.
  2. Copy the **new** token.
  3. Click **Authorize** -> **Logout** -> Paste **New Token** -> **Authorize**.
- **Server Shutdown:** If you see `401 Unauthorized` after following these steps, check if your terminal is still running on port 8000.
