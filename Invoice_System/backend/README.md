# Invoice
*A complete solution for managing customers, invoices, and sales analytics*
A full-featured backend API built with Node.js, Express.js, and MongoDB, enabling users to create, update, and manage customers and invoices with authentication, validation, logging, and analytics support.

### Core Functionality
JWT Authentication (Register/Login)
Secure customer & invoice CRUD operations
Auto-incrementing invoice numbers (starting from 1000)
PDF generation for invoices
Invoice analytics (monthly sales, top customers)
Centralized response and error handling
Request validation with Joi
Logging with Winston
Swagger-compatible API documentation

- **User Authentication**
  - JWT-based secure login/signup
  - Edit user / user details/ delete user
  - Password reset

- **Customer Management**
  - Create/edit/delete customers
  - Credit limit tracking
  - Advanced search and filtering

- **Invoice Management**
  - Generate and manage invoices
  - Auto-calculated totals
  - Line item editing
  - Discounts support

- **Dashboard & Analytics**
  - Monthly sales reports
  - Top customers analysis
  - Visual charts and graphs

- **Export Capabilities**
  - PDF invoice generation
  - Excel/CSV data export
  - Print-ready formats

### Technical Features
- RESTful API with proper status codes
- MVC architecture
- Request validation
- Comprehensive logging
- Error handling
- API documentation

# env file
NODE_ENV = localhost
PORT = 3000
DB_HOST = localhost
DB_NAME = alit_invoice
DB_PORT = 27017
JWT_SECRET = abcd123
JWT_EXPIRE = 24h
LOGIN_BEARER = a1b2c3d4e5
IMAGE_ACCESS_URL = http://localhost:3000/

# Backend dependencies
cd backend
npm install
sudo node index.js

# Swagger URL
http://localhost:3000/api-docs/#/


API Endpoints

# Auth
POST /users/userRegister
POST /users/userLogin
PATCH /users/changePassword
GET /users/getUserDetail
PUT /users/updateUserDetail
DELETE /users/updateUserDetail
POST /users/updateUserDetail
GET /users/userLogOut

# Customers
POST /customers/createCustomer
PUT /customers/updateCustomer
GET /customers/getCustomer
GET /customers/getAllCustomers
DELETE /customers/deleteCustomer

# Invoices
POST /createInvoice
PUT /updateInvoice
GET /getInvoice?invoiceId=
POST /getAllInvoices
DELETE /deleteInvoice?invoiceId=
GET /generateInvoicePDF?invoiceId=
GET /getInvoiceAnalytics