# Alumni Analytics Dashboard System

This project includes a backend API built using **Node.js, Express, and PostgreSQL**, and a frontend dashboard built using **React, Vite, and Chart.js**.

The backend provides authentication, alumni data, analytics endpoints, API key permissions, and API usage tracking.

The frontend consumes the backend API and displays alumni insights using charts, filters, and export features.

---

## Project Structure

```text
serverside_cw1/
├── cwk1/              # Backend API
│   ├── schema.sql
│   ├── sample_data.sql
│   ├── .env.example
│   └── package.json
│
└── cwk2/
    └── frontend/      # React dashboard client
        ├── .env.example
        └── package.json
```

---

## Full Setup Instructions

This project has two parts:

- `cwk1` = Backend API
- `cwk2/frontend` = Frontend dashboard

---

# Backend Setup

## Step 1: Open the backend folder

```bash
cd cwk1
```

## Step 2: Install backend dependencies

```bash
npm install
```

## Step 3: Create the database in pgAdmin

Recommended GUI: **pgAdmin**

1. Open **pgAdmin**
2. Right-click **Databases**
3. Click **Create → Database**
4. Name the database:

```text
serverside_cw1
```

5. Click **Save**

---

## Step 4: Run the database schema in pgAdmin

1. In pgAdmin, open the database:

```text
serverside_cw1
```

2. Right-click the database and choose **Query Tool**
3. Open the file:

```text
cwk1/schema.sql
```

4. Copy all SQL code from `schema.sql`
5. Paste it into the pgAdmin Query Tool
6. Click the **Run / Execute** button

This creates all required tables, indexes, relationships, and seeded API keys.

The schema also creates these API keys:

```text
dashboard_key_123
mobile_ar_key_123
```

---

## Step 5: Optional — add sample dashboard data

To populate the dashboard with sample alumni data, run:

```text
cwk1/sample_data.sql
```

Using pgAdmin:

1. Open the `serverside_cw1` database
2. Open **Query Tool**
3. Open `cwk1/sample_data.sql`
4. Copy all SQL code
5. Paste it into Query Tool
6. Click **Run / Execute**

This adds sample alumni profiles, programmes, graduation years, industries, employers, certifications, bids, and API usage logs.

**Important note:** sample users are for analytics data only. For login testing, register a user through the frontend.

---

## Step 6: Create backend `.env`

In the `cwk1` folder, copy:

```text
.env.example
```

Rename the copy to:

```text
.env
```

Then fill in the values:

```env
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=serverside_cw1
DB_USER=postgres
DB_PASS=your_postgres_password_here
JWT_SECRET=your_jwt_secret_here
```

---

## Step 7: Start the backend server

```bash
npm run dev
```

Expected output:

```text
DB connected
Server running on port 5001
```

Backend URL:

```text
http://localhost:5001
```

Swagger API documentation:

```text
http://localhost:5001/api-docs
```

---

# Frontend Setup

Open a second terminal window.

## Step 1: Open the frontend folder

From the project root:

```bash
cd cwk2/frontend
```

## Step 2: Install frontend dependencies

```bash
npm install
```

## Step 3: Create frontend `.env`

In the `cwk2/frontend` folder, copy:

```text
.env.example
```

Rename the copy to:

```text
.env
```

Then add:

```env
VITE_API_BASE=http://localhost:5001
VITE_API_KEY=dashboard_key_123
```

The key `dashboard_key_123` is created automatically when `schema.sql` is run.

---

## Step 4: Start the frontend

```bash
npm run dev
```

Expected output will show a local Vite URL, usually:

```text
http://localhost:5173
```

Open this URL in the browser.

---

# How to Test After Setup

## 1. Register a user

Open:

```text
http://localhost:5173
```

Click **Register** and create a user using a university email, for example:

```text
testuser@eastminster.ac.uk
```

Use a strong password, for example:

```text
Password123
```

---

## 2. Verify email

After registration, the system displays a verification token.

Copy the token, go to the **Verify Email** page, paste the token, and verify the account.

---

## 3. Login

Return to the Login page and log in with:

```text
testuser@eastminster.ac.uk
Password123
```

After login, the dashboard should open.

---

## 4. View dashboard pages

The dashboard includes:

```text
Overview
By Programme
By Graduation Year
By Industry
API Usage
```

---

## 5. Test export features

The dashboard supports:

```text
CSV export
PDF export
Per-chart PNG download
Saved filter presets
```

---

## 6. Test API documentation

Open:

```text
http://localhost:5001/api-docs
```

---

# API Key Information

The system uses scoped API keys for different clients.

## Analytics Dashboard API key

```text
dashboard_key_123
```

Permissions:

```text
read:alumni
read:analytics
```

## Mobile AR App API key

```text
mobile_ar_key_123
```

Permission:

```text
read:alumni_of_day
```

This means the analytics dashboard can access analytics endpoints, while the mobile AR app key can only access the alumni-of-day endpoint.

---

# API Key Testing

## Dashboard key should work on analytics endpoints

Request:

```text
GET http://localhost:5001/api/analytics/programme
```

Header:

```text
x-api-key: dashboard_key_123
```

Expected result:

```text
200 OK
```

---

## Mobile AR key should fail on analytics endpoints

Request:

```text
GET http://localhost:5001/api/analytics/programme
```

Header:

```text
x-api-key: mobile_ar_key_123
```

Expected result:

```text
403 Permission denied
```

---

## Mobile AR key should work on alumni-of-day endpoint

Request:

```text
GET http://localhost:5001/api/analytics/alumni-of-day
```

Header:

```text
x-api-key: mobile_ar_key_123
```

Expected result:

```text
200 OK
```

---

# Main Features

## Backend Features

- University-domain email registration
- Email verification
- Secure login using JWT
- Logout with token revocation
- Password reset functionality
- Password hashing using bcrypt
- Protected backend routes
- Alumni profile management
- Degree, certification, and employment records
- Blind bidding system
- Analytics API endpoints
- API key scoping and permissions
- API usage logging
- Swagger API documentation

## Frontend Features

- Login page
- Register page
- Verify email page
- Request password reset page
- Reset password page
- Protected dashboard routes
- Multi-page dashboard navigation
- Interactive Chart.js visualisations
- Programme, graduation year, and industry filters
- CSV export
- PDF export
- Per-chart PNG download
- Saved filter presets
- Logout

---

# Important Notes

- PostgreSQL must be running before starting the backend.
- The backend must be running before using the frontend.