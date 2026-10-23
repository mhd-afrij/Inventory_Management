# Testing and Test Case Report

## Project
Inventory & Stock Management System

## Tech Stack Under Test
- Frontend: React 18, Vite, Tailwind CSS
- Backend: Laravel 10, PHP 8.1
- Authentication: Laravel Sanctum
- Database: MySQL 8
- API Communication: Axios

## 1. Testing Objective
The objective of this testing report is to verify that the inventory and stock management system works correctly across authentication, product management, stock movement, supplier management, reporting, and access control features.

## 2. Testing Scope
### In Scope
- User login and logout
- Role-based access control
- Dashboard data loading
- Product CRUD operations
- Low stock and expired product views
- Stock in and stock out workflow
- Supplier CRUD operations
- Reports generation
- Login history access for admin users
- API response and route protection
- Frontend route protection and page rendering

### Out of Scope
- Performance/load testing
- Security penetration testing
- Third-party service integration testing
- Production deployment verification

## 3. Testing Approach
### Manual Testing
Manual testing is used to validate user flows in the browser and verify API behaviors through the UI.

### Functional Testing
Each feature is checked against the expected business rules, such as stock reduction on stock-out and admin-only visibility for login history.

### API Testing
Backend endpoints are verified for correct status codes, validation behavior, and authentication requirements.

### UI Testing
Frontend pages are checked for navigation, protected routes, and data presentation.

## 4. Test Environment
- Operating System: Windows
- Backend Runtime: PHP 8.1+
- Frontend Runtime: Node.js 18+
- Database: MySQL 8.0+
- Browser: Chrome/Edge

## 5. Test Case Summary

| TC ID | Module | Test Case | Expected Result | Status |
|------|--------|-----------|-----------------|--------|
| TC-01 | Authentication | Login with valid admin credentials | User is authenticated and redirected to dashboard | Pending |
| TC-02 | Authentication | Login with valid staff credentials | User is authenticated and redirected to dashboard | Pending |
| TC-03 | Authentication | Login with invalid credentials | Error message is shown and access is denied | Pending |
| TC-04 | Authentication | Logout from application | Session/token is cleared and user is redirected to login page | Pending |
| TC-05 | Authorization | Open protected route without login | User is redirected to login page | Pending |
| TC-06 | Authorization | Access admin-only login history as staff | Access is denied | Pending |
| TC-07 | Dashboard | Load dashboard after login | Dashboard cards and charts render correctly | Pending |
| TC-08 | Products | Add a new product | Product is saved and listed in products page | Pending |
| TC-09 | Products | Update existing product | Product details are updated successfully | Pending |
| TC-10 | Products | Delete a product | Product is removed from the list | Pending |
| TC-11 | Products | Search/filter products | Matching products are displayed correctly | Pending |
| TC-12 | Stock Management | Perform stock in | Quantity increases and movement is recorded | Pending |
| TC-13 | Stock Management | Perform stock out with sufficient quantity | Quantity decreases and movement is recorded | Pending |
| TC-14 | Stock Management | Perform stock out with insufficient quantity | Validation error is displayed | Pending |
| TC-15 | Low Stock | View low stock products | Products below threshold are shown | Pending |
| TC-16 | Expired Products | View expired products | Expired products are shown correctly | Pending |
| TC-17 | Suppliers | Add a supplier | Supplier is saved and listed | Pending |
| TC-18 | Suppliers | Update supplier information | Supplier details are updated | Pending |
| TC-19 | Suppliers | Delete supplier | Supplier is removed from the list | Pending |
| TC-20 | Reports | Open stock report | Stock report loads with correct data | Pending |
| TC-21 | Reports | Open expiry report | Expiry report loads correctly | Pending |
| TC-22 | Reports | Open usage report with date range | Report filters data by selected dates | Pending |
| TC-23 | Login History | View login history as admin | Login history records are visible | Pending |
| TC-24 | API | Call protected endpoint without token | 401 Unauthorized response is returned | Pending |
| TC-25 | API | Call protected endpoint with valid token | Successful response is returned | Pending |

## 6. Detailed Test Cases

### Authentication Test Cases

| TC ID | Test Scenario | Precondition | Test Steps | Expected Result |
|------|---------------|--------------|------------|-----------------|
| AT-01 | Valid login | User account exists | Enter valid email and password, then submit | Login succeeds and user reaches dashboard |
| AT-02 | Invalid login | None | Enter wrong password and submit | Error message appears and login fails |
| AT-03 | Logout | User is logged in | Click logout | Token/session is cleared and login page opens |

### Authorization Test Cases

| TC ID | Test Scenario | Precondition | Test Steps | Expected Result |
|------|---------------|--------------|------------|-----------------|
| AU-01 | Protected route access | User is not logged in | Open dashboard route directly | Redirected to login page |
| AU-02 | Admin-only route | Staff user is logged in | Open login history page | Access is blocked |

### Product Management Test Cases

| TC ID | Test Scenario | Precondition | Test Steps | Expected Result |
|------|---------------|--------------|------------|-----------------|
| PR-01 | Create product | Logged-in user | Fill product form and save | Product is created successfully |
| PR-02 | Update product | Existing product available | Edit product details and save | Changes are stored correctly |
| PR-03 | Delete product | Existing product available | Delete product and confirm | Product is removed from inventory |
| PR-04 | Search product | Multiple products exist | Search by name or batch number | Matching products are displayed |

### Stock Management Test Cases

| TC ID | Test Scenario | Precondition | Test Steps | Expected Result |
|------|---------------|--------------|------------|-----------------|
| ST-01 | Stock in | Product exists | Enter stock-in quantity and submit | Quantity increases and movement is logged |
| ST-02 | Stock out | Product quantity is sufficient | Enter stock-out quantity and submit | Quantity decreases and movement is logged |
| ST-03 | Stock out validation | Product quantity is insufficient | Try to stock out more than available | Validation error is shown |

### Supplier Management Test Cases

| TC ID | Test Scenario | Precondition | Test Steps | Expected Result |
|------|---------------|--------------|------------|-----------------|
| SU-01 | Add supplier | Logged-in user | Fill supplier form and save | Supplier is added successfully |
| SU-02 | Edit supplier | Supplier exists | Update supplier details | Supplier data is updated |
| SU-03 | Delete supplier | Supplier exists | Delete supplier | Supplier is removed |

### Reports Test Cases

| TC ID | Test Scenario | Precondition | Test Steps | Expected Result |
|------|---------------|--------------|------------|-----------------|
| RP-01 | Stock report | Data exists | Open stock report page | Report renders with correct values |
| RP-02 | Expiry report | Data exists | Open expiry report page | Expired and expiring items are displayed |
| RP-03 | Usage report | Data exists | Select date range and load report | Results match selected range |

## 7. Backend Test Coverage Recommendation
The repository currently includes PHPUnit configuration, but no dedicated feature or unit tests were present in the test folder. Recommended automated tests include:
- Authentication API tests
- Product CRUD feature tests
- Stock in/out validation tests
- Supplier CRUD tests
- Admin middleware access tests
- Dashboard and report endpoint tests

## 8. Frontend Test Coverage Recommendation
Recommended frontend tests include:
- Login form validation
- Protected route redirection
- Sidebar navigation rendering
- Page loading states
- API error handling
- Data table rendering for products, suppliers, and reports

## 9. Observations
- The backend is organized as a REST API with token-based authentication.
- The frontend uses route protection and an Axios interceptor for unauthorized responses.
- The application is suitable for both manual functional testing and future automated test expansion.

## 10. Conclusion
The system covers the main inventory workflows required for a stock management platform. The above test cases provide a practical baseline for validating functionality, access control, and data integrity across the application.
