# Weekly Report Generator — Setup Guide

Full-stack app for teams to submit weekly work reports and managers to review/approve them.

**Stack:** .NET 10 Web API · React 18 + Vite + TypeScript · PostgreSQL

---

## 1. Install Dependencies

**Backend**
```bash
cd backend
dotnet restore
```

**Frontend**
```bash
cd frontend
npm install
```

---

## 2. Run the Database

1. Install [PostgreSQL](https://www.postgresql.org/download/) and make sure it's running locally.
2. Create a database (or let EF Core create it automatically on first run).
3. Set your connection string in `backend/WeeklyReportGenerator.API/appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Host=localhost;Port=5432;Database=SisencoDigital;Username=postgres;Password=YOUR_PASSWORD"
   }
   ```
4. Apply migrations:
   ```bash
   cd backend/WeeklyReportGenerator.API
   dotnet ef database update --project ../WeeklyReportGenerator.Infrastructure --startup-project .
   ```
   *(If `dotnet ef` isn't found: `dotnet tool install --global dotnet-ef`)*

---

## 3. Run the Backend

```bash
cd backend/WeeklyReportGenerator.API
dotnet run
```

- API: `https://localhost:7094/api`
- Swagger UI: `https://localhost:7094/swagger`

*(Migrations also auto-apply on startup, so step 2.4 is a safety net, not strictly required.)*

---

## 4. Run the Frontend

1. Set the API URL in `frontend/.env`:
   ```
   VITE_API_BASE_URL=https://localhost:7094/api
   ```
2. Start the dev server:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open `http://localhost:5173`

---

## First-Time Use

A default **Manager** account is auto-seeded the first time the backend runs (since only Managers can create new users):

```
Email:    admin@weeklyreport.com
Password: Admin@12345
```

Log in with this account, then use **Team Members → New User** to create everyone else.
Team Members register themselves at `/register` if self-signup is enabled; otherwise the Manager creates their accounts too.