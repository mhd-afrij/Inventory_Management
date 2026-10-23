# Inventory & Stock Management System
## College of Royal Aesthetic of Sri Lanka

---

## Installation Guide

### Prerequisites

- **PHP 8.1+** with extensions: cURL, MBString, OpenSSL, PDO, Tokenizer, XML
- **Composer** (latest version)
- **Node.js 18+** and npm
- **MySQL 8.0+**
- **XAMPP/WAMP/Laragon** (for local development)

---

## Backend Setup (Laravel)

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Install PHP dependencies
```bash
composer install
```

### 3. Environment setup
```bash
copy .env.example .env
```

Edit `.env` file with your MySQL credentials:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventory_db
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Generate application key
```bash
php artisan key:generate
```

### 5. Create MySQL database
Open MySQL and create the database:
```sql
CREATE DATABASE inventory_db;
```

### 6. Run migrations
```bash
php artisan migrate
```

### 7. Seed the database with sample data
```bash
php artisan db:seed
```

### 8. Start the Laravel server
```bash
php artisan serve
```

Backend will run at: `http://localhost:8000`

---

## Frontend Setup (React + Tailwind CSS)

### 1. Navigate to frontend folder
```bash
cd frontend
```

### 2. Install Node dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@clinic.com | password |
| **Staff** | staff@clinic.com | password |

---

## Project Structure

```
Intern-Task/
├── backend/                    # Laravel API Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/    # API Controllers
│   │   │   └── Middleware/     # AdminMiddleware
│   │   ├── Models/             # Eloquent Models
│   │   └── Providers/
│   ├── config/                 # Laravel configs
│   ├── database/
│   │   ├── migrations/         # Database migrations
│   │   └── seeders/            # Sample data seeders
│   ├── routes/
│   │   └── api.php             # API routes
│   └── .env
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/         # Layout, ProtectedRoute
│   │   ├── config/             # Axios configuration
│   │   ├── context/            # AuthContext
│   │   ├── pages/              # All page components
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── tailwind.config.js
│   └── package.json
│
└── INSTALLATION.md             # This file
```

---

## Database Schema

### Tables

1. **users** - Admin and staff accounts
2. **suppliers** - Supplier information
3. **products** - Product inventory
4. **stock_movements** - Stock in/out history
5. **login_histories** - User login audit trail
6. **personal_access_tokens** - Sanctum API tokens

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | User login |
| POST | `/api/logout` | User logout |
| GET | `/api/me` | Get current user |
| POST | `/api/register` | Register new user (admin only) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (paginated) |
| POST | `/api/products` | Create product |
| GET | `/api/products/{id}` | Get single product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |
| GET | `/api/products-low-stock` | Low stock products |
| GET | `/api/products-expired` | Expired products |

### Stock Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stock-movements` | List stock movements |
| POST | `/api/stock-in` | Record stock in |
| POST | `/api/stock-out` | Record stock out |
| GET | `/api/stock-summary` | Movement summary |

### Suppliers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/suppliers` | List suppliers |
| POST | `/api/suppliers` | Create supplier |
| GET | `/api/suppliers/{id}` | Get supplier |
| PUT | `/api/suppliers/{id}` | Update supplier |
| DELETE | `/api/suppliers/{id}` | Delete supplier |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/stock` | Stock report |
| GET | `/api/reports/expiry?days=30` | Expiry report |
| GET | `/api/reports/usage?date_from=&date_to=` | Usage report |
| GET | `/api/reports/daily-movement?date_from=&date_to=` | Daily movement report |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Dashboard statistics |

### Login History (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/login-history` | Login audit trail |

---

## Features

### Authentication Module
- Admin and Staff login
- Secure token-based authentication (Laravel Sanctum)
- Role-based access control
- Login history tracking

### Dashboard
- Total products count
- Total stock value
- Low stock alerts
- Expired products count
- Total suppliers
- Stock in/out today
- Category distribution chart
- Recent stock activities

### Product Management
- Full CRUD operations
- Search by name, brand, batch number
- Filter by category
- Fields: Name, Category, Brand, Batch Number, Expiry Date, Quantity, Unit Type, Purchase Price, Selling Price, Supplier, Low Stock Threshold
- Categories: Medicine, Injection, Consumable, Other
- Unit Types: pcs, ml, mg, bottles, boxes, strips

### Stock Management
- Stock In (receive products)
- Stock Out (dispense products)
- Automatic quantity updates
- Reference number generation
- Insufficient stock validation
- Movement history with filters

### Supplier Management
- Full CRUD operations
- Fields: Name, Contact Number, Email, Address
- Card grid layout

### Reports
- Stock Report with chart visualization
- Expiry Report (expired, expiring soon, safe)
- Usage Report (stock in/out per product)
- Configurable date ranges

### Login History
- Admin-only access
- Track IP address, browser, login/logout times
- Active session indicator

---

## Sample Data

The seeders create:
- 2 users (admin + staff)
- 5 Sri Lankan suppliers
- 18 products across all categories
- 30 stock movements

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js 18, Vite 5 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Icons | React Icons (Heroicons v2) |
| HTTP Client | Axios |
| Backend | Laravel 10 |
| Authentication | Laravel Sanctum |
| Database | MySQL 8 |
| API Style | RESTful JSON API |

---

## Troubleshooting

### CORS Issues
Ensure `config/cors.php` has `localhost:5173` in allowed origins.

### Database Connection
Verify MySQL is running and credentials in `.env` are correct.

### Migration Errors
Run `php artisan migrate:fresh --seed` to reset and reseed.

### Port Conflicts
- Backend: Change port with `php artisan serve --port=8001`
- Frontend: Change port in `vite.config.js` server.port

---

## License

This project is developed for College of Royal Aesthetic of Sri Lanka.
