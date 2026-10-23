# Inventory & Stock Management System

A full-stack inventory application for the College of Royal Aesthetic of Sri Lanka. It helps staff manage products, suppliers, stock movements, expiry dates, and operational reports from a single dashboard.

## Features

- Role-based admin and staff authentication with Laravel Sanctum
- Product and supplier management
- Stock-in and stock-out tracking with movement history
- Low-stock and expired-product alerts
- Dashboard metrics and category distribution
- Stock, expiry, usage, and daily movement reports
- Admin-only login audit history and user registration

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Axios, Recharts
- **Backend:** Laravel 10, PHP 8.1+, Laravel Sanctum
- **Database:** MySQL 8+

## Quick Start

### 1. Configure the API

```bash
cd backend
composer install
copy .env.example .env
```

Set the `DB_*` values in `backend/.env`, then create the database and run:

```bash
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

The API starts at `http://localhost:8000`.

### 2. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the address shown by Vite (normally `http://localhost:5173`). The frontend expects the API at `http://localhost:8000/api`.

## Development Accounts

After seeding the database, use either of these local development accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@clinic.com` | `password` |
| Staff | `staff@clinic.com` | `password` |

Change or remove these accounts before deploying anywhere shared or public.

## Project Structure

```text
backend/       Laravel API, migrations, seeders, and tests
frontend/      React/Vite user interface
Document/      Project documentation and test report
.md/           Detailed installation guide
.sql/          Database export
```

## Documentation

For the detailed setup guide and API endpoint reference, see [.md/INSTALLATION.md](.md/INSTALLATION.md).

## Contributing

Create work from `develop` using `feature/<name>` or `fix/<name>`, then open a pull request back to `develop`. Keep commits focused and use Conventional Commit prefixes where practical. `main` is reserved for reviewed, stable releases; CI must pass before merging.
