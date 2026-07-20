FlumenX Shopping Cart
_________________

Tech Stack
_________________

Frontend:
- React
- TypeScript
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Swagger UI


Setup
_________________

Backend:

bash
cd backend
npm install


Create a .env file from the .env.example template.

env
_________________

PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/shopping-cart


Run the backend.

bash
npm run dev


Frontend:

bash
cd frontend
npm install
npm run dev


Create a .env file from the .env.example template.

env
_________________

VITE_API_URL=http://localhost:5001


Seed Database
_________________

bash
npm run seed


API Documentation (Swagger)
_________________

Swagger UI interactive docs:
http://localhost:5001/api-docs


API Endpoints
_________________

GET /products
GET /products/:id
GET /cart
POST /cart
PUT /cart/:id
DELETE /cart/:id
