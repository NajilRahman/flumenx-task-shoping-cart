# FlumenX Shopping Cart Module

A complete, responsive Shopping Cart module built with TypeScript, React, Express, and MongoDB. Includes product listing with search/filter/pagination, cart operations, stock quantity management, and interactive Swagger API documentation.

---

## Deliverables Checklist

- [x] **GitHub Source Code**: Monorepo structure containing `frontend` and `backend`.
- [x] **README with Setup Instructions**: Complete environment setup and commands.
- [x] **Database Seed Script**: Pre-populated database with sample products.
- [x] **API Documentation (Swagger UI)**: Interactive OpenAPI documentation at `/api-docs`.
- [x] **17 Sample Products**: Exceeds minimum 15 products requirement.

---

## Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 + Responsive Mobile Grid
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose ORM
- **API Docs**: Swagger UI (`swagger-ui-express` & `swagger-jsdoc`)

---

## Setup & Installation

### 1. Environment Configuration

Copy `.env.example` to `.env` in both `backend` and `frontend` folders:

#### Backend (`backend/.env`):
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/shopping-cart
```

#### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5001
```

---

### 2. Backend Setup

```bash
cd backend
npm install

# Seed database with 17 sample products
npm run seed

# Start development server
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start development server
npm run dev
```

---

## API Documentation (Swagger UI)

Interactive Swagger API documentation is available when the backend server is running:

- **Swagger UI URL**: [http://localhost:5001/api-docs](http://localhost:5001/api-docs)

### Core REST Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/products` | Fetch products with pagination, search, stock & price filters |
| **GET** | `/products/:id` | Get details of a single product |
| **GET** | `/cart` | Get all items in the shopping cart |
| **POST** | `/cart` | Add a product to cart (or increase quantity) |
| **PUT** | `/cart/:id` | Update quantity of a cart item |
| **DELETE** | `/cart/:id` | Remove an item from the cart |
