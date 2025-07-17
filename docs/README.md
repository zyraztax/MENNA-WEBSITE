# MENNA-WEBSITE API Documentation

---

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```
2. **Start Backend Server**
   ```bash
   nodemon src/index.js
   ```
3. **Download & Install [Postman](https://www.postman.com/downloads/)**
4. **Import** `Menna-API.postman_collection.json` from the `docs/` folder into Postman.
5. **Test API Endpoints** using the examples below.

---

## 📚 API Endpoints Overview

### Authentication

- **Register Member**: `/api/auth/register` (POST)
- **Login**: `/api/auth/login` (POST)
- **Get CSRF Token**: `/api/auth/csrf-token` (GET)
- **Get Profile**: `/api/auth/rf` (GET, protected)

### Payment (Chapa)

- **Initiate Payment**: `/api/payment/pay` (POST)
- **Verify Payment**: `/api/payment/verify?tx_ref=...` (GET)
- **Webhook**: `/api/payment/webhook` (POST)

---

## 🔐 Authentication Endpoints

### 1. Get CSRF Token

> **Request:**
>
> ```http
> GET /api/auth/csrf-token
> ```
>
> **Response:**
>
> ```json
> {
>   "csrfToken": "<token>"
> }
> ```
>
> Copy the token for use in the next requests (required for POST).
>
> ---
>
> ### 2. Register
>
> #### Member Registration
>
> **Request:**
>
> ```http
> POST /api/auth/register
> Headers:
>   X-CSRF-Token: <token from previous step>
> Body (JSON):
> {
>   "phoneNumber": "+251912345678", // Must be unique
>   "name": "Test User",
>   "occupation": "Engineer",
>   "contribution": "Monthly",
>   "address": "Addis Ababa",
>   "monthlyDonation": 10,
>   "password": "password123",
>   "role": "member"
> }
> ```
>
> **Response:**
>
> ```json
> {
>   "message": "User registered successfully",
>   "user": { ... }
> }
> ```
>
> **Note:**
>
> - The phone number must be unique for each member.
> - If you try to register with a phone number that already exists, you will get:
>   ```json
>   { "message": "Phone number already registered." }
>   ```
>
> #### Admin Registration
>
> **Important:**
>
> - Admin accounts (e.g. phone: +251945870700, password: MennaTestAdmin) are created only by backend code and cannot be registered via the API or frontend.
> - Any attempt to register an admin via the API will be blocked.
>
> ---
>
> ### 3. Login
>
> **Member Login Request:**
>
> ```http
> POST /api/auth/login
> Headers:
>   X-CSRF-Token: <token from previous step>
> Body (JSON):
> {
>   "phoneNumber": "+251912345678",
>   "password": "password123"
> }
> ```
>
> **Admin Login Request:**
>
> ```http
> POST /api/auth/login
> Headers:
>   X-CSRF-Token: <token from previous step>
> Body (JSON):
> {
>   "phoneNumber": "+251945870700",
>   "password": "MennaTestAdmin",
>   "role": "admin"
> }
> ```
>
> **Response:**
>
> ```json
> {
>   "message": "Login successful",
>   "user": { ... }
> }
> ```
>
> **Note:**
>
> - The `monthlyDonation` field is only required during registration. It is not needed for login requests.
>
> ---
>
> ### 4. Get Profile (Protected Route)
>
> **Request:**
>
> ```http
> GET /api/auth/rf
> ```
>
> **Response:**
>
> ```json
> {
>   "user": {
>     "_id": "60f7c2b8e1b2c8a1b8e1b2c8",
>     "phoneNumber": "+251912345678",
>     "name": "Test User",
>     "occupation": "Engineer",
>     "contribution": "Monthly",
>     "address": "Addis Ababa",
>     "monthlyDonation": 10,
>     "role": "member"
>   }
> }
> ```
>
> ---
>
> ## Payment Endpoints (Chapa)
>
> ### 1. Initiate Payment
>
> **Request:**
>
> ```http
> POST /api/payment/pay
> Headers:
>   X-CSRF-Token: <token from previous step>
> Body (JSON):
> {
>   "amount": 100,
>   "currency": "ETB",
>   "email": "user@example.com",
>   "first_name": "Test",
>   "last_name": "User",
>   "tx_ref": "unique_tx_ref_123",
>   "callback_url": "https://yourdomain.com/callback",
>   "return_url": "https://yourdomain.com/return",
>   "customization": {}
> }
> ```
>
> **Response:**
>
> ```json
> {
>   "status": "pending",
>   "chapa_response": { ... }
> }
> ```
>
> ### 2. Verify Payment
>
> **Request:**
>
> ```http
> GET /api/payment/verify?tx_ref=unique_tx_ref_123
> Headers:
>   X-CSRF-Token: <token from previous step>
> ```
>
> **Response:**
>
> ```json
> {
>   "status": "success",
>   "chapa_response": { ... }
> }
> ```
>
> ### 3. Webhook (Chapa)
>
> **Request:**
>
> ```http
> POST /api/payment/webhook
> Content-Type: application/json
> Body (JSON):
> {
>   "tx_ref": "unique_tx_ref_123",
>   "status": "success",
>   ...other Chapa fields...
> }
> ```
>
> **Response:**
>
> ```json
> {
>   "message": "Webhook received"
> }
> ```
>
> ---
>
> ## Tips & Notes
>
> - Always get a CSRF token before POST requests.
> - Use the token in the `X-CSRF-Token` header.
> - Use Postman's cookie jar to persist cookies between requests.
> - For payment, use unique `tx_ref` for each transaction.
>
> ---
>
> ## Project Folder Structure Preview
>
> ```
> MENNA-WEBSITE/
> ├── backend/
> │   ├── src/
> │   │   ├── controller/
> │   │   │   ├── auth.controller.js
> │   │   │   └── chapa.controller.js
> │   │   ├── middleware/
> │   │   ├── model/
>             |__ auth.model.js
> │   │   │   └── chapa.model.js
> │   │   ├── routes/
> │   │   │   ├── auth.routes.js
> │   │   │   └── chapa.routes.js
> │   │   ├── service/
> │   │   │   └── chapa.service.js
> │   │   ├── utils/
>             |___auth.utils.js
> │   │   │   └── chapa.utils.js
> │   │   ├── validators/
>             |__auth.validator.js
> │   │   │   └── chapa.validator.js
> │   │   └── index.js
> │   └── ...
> ├── docs/
> │   ├── README.md
> │   └── Menna-API.postman_collection.json
> └── ...
> ```
>
> ## What to Include in docs/
>
> - `Menna-API.postman_collection.json`: Exported Postman collection with all endpoints.
> - `README.md`: This guide and any additional API usage notes.
> - Any other documentation (e.g., environment setup, authentication guide).
>
> ## Best Practices
>
> - Update the Postman collection as your API evolves.
> - Document request/response formats, authentication, error codes, and usage examples.
> - Share this folder with your team for onboarding and collaboration.
>
> ---
>
> For Swagger/OpenAPI documentation, see the official [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express) package.
