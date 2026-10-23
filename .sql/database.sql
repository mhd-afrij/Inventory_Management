-- ============================================================
-- Inventory & Stock Management System
-- College of Royal Aesthetic of Sri Lanka
-- Complete MySQL Database File
-- ============================================================

-- Create Database
-- ============================================================
DROP DATABASE IF EXISTS inventory_db;
CREATE DATABASE inventory_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE inventory_db;

-- ============================================================
-- Table: users
-- ============================================================
CREATE TABLE users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  email_verified_at TIMESTAMP NULL DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','staff') NOT NULL DEFAULT 'staff',
  remember_token VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: password_reset_tokens
-- ============================================================
CREATE TABLE password_reset_tokens (
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: sessions
-- ============================================================
CREATE TABLE sessions (
  id VARCHAR(255) NOT NULL,
  user_id BIGINT UNSIGNED DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  payload LONGTEXT NOT NULL,
  last_activity INT NOT NULL,
  PRIMARY KEY (id),
  KEY sessions_user_id_index (user_id),
  KEY sessions_last_activity_index (last_activity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: suppliers
-- ============================================================
CREATE TABLE suppliers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(255) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  address TEXT DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: products
-- ============================================================
CREATE TABLE products (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category ENUM('Medicine','Injection','Consumable','Other') NOT NULL,
  brand VARCHAR(255) DEFAULT NULL,
  batch_number VARCHAR(255) DEFAULT NULL,
  expiry_date DATE NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  unit_type ENUM('pcs','ml','mg','bottles','boxes','strips') NOT NULL,
  purchase_price DECIMAL(8,2) NOT NULL,
  selling_price DECIMAL(8,2) NOT NULL,
  supplier_id BIGINT UNSIGNED NOT NULL,
  low_stock_threshold INT NOT NULL DEFAULT 10,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY products_batch_number_unique (batch_number),
  KEY products_supplier_id_foreign (supplier_id),
  CONSTRAINT products_supplier_id_foreign FOREIGN KEY (supplier_id) REFERENCES suppliers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: stock_movements
-- ============================================================
CREATE TABLE stock_movements (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  type ENUM('in','out') NOT NULL,
  quantity INT NOT NULL,
  reference_number VARCHAR(255) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  performed_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  KEY stock_movements_product_id_foreign (product_id),
  KEY stock_movements_performed_by_foreign (performed_by),
  CONSTRAINT stock_movements_product_id_foreign FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT stock_movements_performed_by_foreign FOREIGN KEY (performed_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: login_histories
-- ============================================================
CREATE TABLE login_histories (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  ip_address VARCHAR(255) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  login_at TIMESTAMP NOT NULL,
  logout_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  KEY login_histories_user_id_foreign (user_id),
  CONSTRAINT login_histories_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: personal_access_tokens (Laravel Sanctum)
-- ============================================================
CREATE TABLE personal_access_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  tokenable_type VARCHAR(255) NOT NULL,
  tokenable_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  token VARCHAR(64) NOT NULL,
  abilities TEXT DEFAULT NULL,
  last_used_at TIMESTAMP NULL DEFAULT NULL,
  expires_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP NULL DEFAULT NULL,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY personal_access_tokens_token_unique (token),
  KEY personal_access_tokens_tokenable_type_tokenable_id_index (tokenable_type, tokenable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- SEED DATA
-- ============================================================

-- ------------------------------------------------------------
-- Users (password for both = "password")
-- bcrypt hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- ------------------------------------------------------------
INSERT INTO users (id, name, email, email_verified_at, password, role, remember_token, created_at, updated_at) VALUES
(1, 'Admin',        'admin@clinic.com',  NOW(), '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', NULL, NOW(), NOW()),
(2, 'Staff Member', 'staff@clinic.com',  NOW(), '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff', NULL, NOW(), NOW());

-- ------------------------------------------------------------
-- Suppliers
-- ------------------------------------------------------------
INSERT INTO suppliers (id, name, contact_number, email, address, created_at, updated_at) VALUES
(1, 'Ceylon Pharma Distributors',  '+94112345678', 'info@ceylonpharma.lk',  '45 Galle Road, Colombo 03, Sri Lanka',        NOW(), NOW()),
(2, 'Lanka Medical Supplies',       '+94112987654', 'sales@lankamedical.lk', '12 Station Road, Kandy, Sri Lanka',            NOW(), NOW()),
(3, 'Royal Health Distributors',    '+94112567890', 'orders@royalhealth.lk', '78 Main Street, Galle, Sri Lanka',             NOW(), NOW()),
(4, 'Island Pharmaceutical Ltd',    '+94112345012', 'contact@islandpharma.lk','23 Temple Lane, Colombo 07, Sri Lanka',       NOW(), NOW()),
(5, 'MedSource International',      '+94112456789', 'info@medsource.lk',     '56 Lake Drive, Colombo 08, Sri Lanka',          NOW(), NOW());

-- ------------------------------------------------------------
-- Products
-- ------------------------------------------------------------
INSERT INTO products (id, name, category, brand, batch_number, expiry_date, quantity, unit_type, purchase_price, selling_price, supplier_id, low_stock_threshold, created_at, updated_at) VALUES
-- Medicine (7)
(1,  'Paracetamol 500mg',     'Medicine',   'Ceylon Pharma',   'MED-2024-001', '2026-12-31', 200, 'strips',  150.00,  250.00,  1,  20, NOW(), NOW()),
(2,  'Amoxicillin 250mg',     'Medicine',   'Lanka Pharma',    'MED-2024-002', '2026-06-30', 150, 'strips',  200.00,  350.00,  2,  15, NOW(), NOW()),
(3,  'Cetirizine 10mg',       'Medicine',   'AllergyCare',     'MED-2024-003', '2025-11-30',  80, 'strips',  120.00,  200.00,  1,  10, NOW(), NOW()),
(4,  'Omeprazole 20mg',       'Medicine',   'GastroHealth',    'MED-2024-004', '2026-09-15',   5, 'strips',  180.00,  300.00,  3,  10, NOW(), NOW()),
(5,  'Metformin 500mg',       'Medicine',   'DiabetCare',      'MED-2024-005', '2026-03-20', 120, 'strips',  100.00,  175.00,  4,  15, NOW(), NOW()),
(6,  'Ibuprofen 400mg',       'Medicine',   'PainRelief',      'MED-2024-006', '2026-08-10',  90, 'strips',  130.00,  220.00,  2,  12, NOW(), NOW()),
(7,  'Azithromycin 500mg',    'Medicine',   'AntiBio Pharma',  'MED-2024-007', '2025-12-15',  60, 'boxes',   450.00,  750.00,  1,   8, NOW(), NOW()),
-- Injection (3)
(8,  'Insulin Glargine',       'Injection',  'InsulinCare',     'INJ-2024-001', '2025-09-30',  45, 'bottles', 2500.00, 4000.00,  4,   5, NOW(), NOW()),
(9,  'Vitamin B12 Injection',  'Injection',  'VitaHealth',      'INJ-2024-002', '2026-04-20',  80, 'bottles',  350.00,  600.00,  2,  10, NOW(), NOW()),
(10, 'Dexamethasone Injection','Injection',  'SteroidCare',     'INJ-2024-003', '2026-01-25',  30, 'bottles',  200.00,  380.00,  5,   5, NOW(), NOW()),
-- Consumable (4)
(11, 'Disposable Syringes 5ml','Consumable','MedSafe',          'CON-2024-001', '2027-06-30', 500, 'pcs',      15.00,   30.00,  3,  50, NOW(), NOW()),
(12, 'Surgical Gloves (Medium)','Consumable','SafeHands',       'CON-2024-002', '2027-12-31',  30, 'boxes',   800.00, 1200.00,  5,  10, NOW(), NOW()),
(13, 'Antiseptic Solution',   'Consumable', 'CleanWound',       'CON-2024-003', '2026-11-20',  40, 'bottles',  250.00,  420.00,  1,   8, NOW(), NOW()),
(14, 'Cotton Wool Rolls',     'Consumable', 'CottonSoft',       'CON-2024-004', '2028-01-01',  60, 'pcs',      180.00,  300.00,  2,  10, NOW(), NOW()),
-- Other (3)
(15, 'Digital Thermometer',   'Other',      'TempRead',         'OTH-2024-001', '2030-12-31',  25, 'pcs',      500.00,  900.00,  3,   5, NOW(), NOW()),
(16, 'Blood Pressure Monitor','Other',      'VitaCheck',        'OTH-2024-002', '2030-12-31',  10, 'pcs',     3500.00, 5500.00,  5,   3, NOW(), NOW()),
(17, 'Hand Sanitizer 500ml',  'Other',      'GermFree',         'OTH-2024-003', '2026-07-15', 100, 'bottles',  300.00,  500.00,  4,  15, NOW(), NOW());

-- ------------------------------------------------------------
-- Stock Movements
-- ------------------------------------------------------------
INSERT INTO stock_movements (id, product_id, type, quantity, reference_number, notes, performed_by, created_at, updated_at) VALUES
-- Product 1 - Paracetamol
(1,  1,  'in',  100, 'REF-2024-001', 'Initial stock purchase',           1, NOW(), NOW()),
(2,  1,  'in',  100, 'REF-2024-002', 'Restocking from Ceylon Pharma',    1, NOW(), NOW()),
(3,  1,  'out',  25, 'REF-2024-003', 'Dispensed to patients',            2, NOW(), NOW()),
(4,  1,  'out',  20, 'REF-2024-004', 'Monthly dispensing',               2, NOW(), NOW()),
-- Product 2 - Amoxicillin
(5,  2,  'in',   80, 'REF-2024-005', 'First order from Lanka Medical',   1, NOW(), NOW()),
(6,  2,  'in',   70, 'REF-2024-006', 'Restock order',                    1, NOW(), NOW()),
(7,  2,  'out',  15, 'REF-2024-007', 'Doctor prescriptions',             2, NOW(), NOW()),
-- Product 3 - Cetirizine
(8,  3,  'in',   50, 'REF-2024-008', 'Allergy season stock',             1, NOW(), NOW()),
(9,  3,  'out',  10, 'REF-2024-009', 'Regular dispensing',               2, NOW(), NOW()),
(10, 3,  'out',   8, 'REF-2024-010', 'Patient prescriptions',            2, NOW(), NOW()),
-- Product 4 - Omeprazole
(11, 4,  'in',   10, 'REF-2024-011', 'Small batch from Royal Health',    1, NOW(), NOW()),
(12, 4,  'out',   5, 'REF-2024-012', 'Emergency dispensing',             2, NOW(), NOW()),
-- Product 5 - Metformin
(13, 5,  'in',  100, 'REF-2024-013', 'Diabetes medication stock',        1, NOW(), NOW()),
(14, 5,  'in',   20, 'REF-2024-014', 'Additional order',                 1, NOW(), NOW()),
(15, 5,  'out',  10, 'REF-2024-015', 'Monthly diabetes patients',        2, NOW(), NOW()),
-- Product 6 - Ibuprofen
(16, 6,  'in',   60, 'REF-2024-016', 'Pain relief stock',                1, NOW(), NOW()),
(17, 6,  'out',  20, 'REF-2024-017', 'Patient dispensing',               2, NOW(), NOW()),
(18, 6,  'out',  10, 'REF-2024-018', 'Regular usage',                    2, NOW(), NOW()),
-- Product 7 - Azithromycin
(19, 7,  'in',   40, 'REF-2024-019', 'Antibiotic stock',                 1, NOW(), NOW()),
(20, 7,  'out',   8, 'REF-2024-020', 'Prescription dispensing',          2, NOW(), NOW()),
-- Product 8 - Insulin
(21, 8,  'in',   30, 'REF-2024-021', 'Critical medication restock',      1, NOW(), NOW()),
(22, 8,  'in',   15, 'REF-2024-022', 'Additional insulin supply',        1, NOW(), NOW()),
-- Product 9 - Vitamin B12
(23, 9,  'in',   50, 'REF-2024-023', 'Vitamin injection stock',          1, NOW(), NOW()),
(24, 9,  'out',  10, 'REF-2024-024', 'Patient injections',               2, NOW(), NOW()),
-- Product 10 - Dexamethasone
(25, 10, 'in',   20, 'REF-2024-025', 'Steroid injection stock',          1, NOW(), NOW()),
(26, 10, 'out',   5, 'REF-2024-026', 'Emergency use',                    1, NOW(), NOW()),
-- Product 11 - Syringes
(27, 11, 'in',  300, 'REF-2024-027', 'Bulk syringe order',               1, NOW(), NOW()),
(28, 11, 'out',  50, 'REF-2024-028', 'Monthly clinic usage',             2, NOW(), NOW()),
(29, 11, 'out',  20, 'REF-2024-029', 'Injection supplies',               2, NOW(), NOW()),
-- Product 12 - Gloves
(30, 12, 'in',   20, 'REF-2024-030', 'Safety equipment order',           1, NOW(), NOW());


-- ============================================================
-- Verify
-- ============================================================
SELECT '============================================' AS '';
SELECT '  DATABASE CREATED SUCCESSFULLY!'            AS Status;
SELECT '============================================' AS '';
SELECT '  Tables created:' AS Info;
SELECT TABLE_NAME, TABLE_ROWS FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = 'inventory_db'
  ORDER BY TABLE_NAME;
SELECT '============================================' AS '';
SELECT '  Users:' AS Info;
SELECT id, name, email, role FROM users;
SELECT '============================================' AS '';
SELECT '  Suppliers:' AS Info;
SELECT id, name, contact_number FROM suppliers;
SELECT '============================================' AS '';
SELECT '  Products:' AS Info;
SELECT id, name, category, quantity, unit_type FROM products;
SELECT '============================================' AS '';
SELECT '  Stock Movements:' AS Info;
SELECT COUNT(*) AS total_movements FROM stock_movements;
SELECT '============================================' AS '';
