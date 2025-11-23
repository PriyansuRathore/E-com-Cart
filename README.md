# Vibe Commerce - Mock E-Commerce Cart

A full-stack shopping cart application built for Vibe Commerce internship screening. Features a modern React frontend with a Node.js/Express backend and SQLite database.

## 🚀 Features

- **Product Catalog**: Browse 10 mock products with images and prices
- **Shopping Cart**: Add/remove items, update quantities, view totals
- **Checkout Process**: Customer form with mock payment processing
- **Receipt Generation**: Professional receipt modal with order details
- **Responsive Design**: Modern glass morphism UI with smooth animations
- **Database Persistence**: SQLite database for cart and order storage

## 🛠 Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Modern CSS with Glass Morphism
- Vite (Build tool)

**Backend:**
- Node.js
- Express.js
- SQLite3
- CORS enabled

## 📁 Project Structure

```
e com cart/
├── backend/
│   ├── data/
│   │   └── products.json
│   ├── db/
│   │   └── init.sql
│   ├── server.js
│   ├── ecom.db
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Cart.jsx
│   │   │   ├── CheckoutModal.jsx
│   │   │   └── Products.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   └── CartPage.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   Server runs on http://localhost:3001

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:5173

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Fetch all products |
| GET | `/api/cart` | Get cart items and total |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:id` | Update cart item quantity |
| DELETE | `/api/cart/:id` | Remove item from cart |
| POST | `/api/checkout` | Process checkout and generate receipt |

## ✨ Key Features Implemented

### ✅ Backend Requirements
- [x] GET /api/products - Returns 10 mock products
- [x] POST /api/cart - Add items with productId and quantity
- [x] DELETE /api/cart/:id - Remove cart items
- [x] GET /api/cart - Retrieve cart with calculated total
- [x] POST /api/checkout - Generate mock receipt with timestamp

### ✅ Frontend Requirements
- [x] Products grid with "Add to Cart" functionality
- [x] Cart view with items, quantities, and totals
- [x] Remove and update quantity buttons
- [x] Checkout form with name and email validation
- [x] Receipt modal displaying order details
- [x] Fully responsive design

### ✅ Bonus Features
- [x] SQLite database persistence
- [x] Comprehensive error handling
- [x] Modern UI with animations and glass morphism
- [x] React Router for navigation
- [x] Professional receipt design
- [x] Loading states and user feedback

## 🎨 Design Highlights

- **Glass Morphism UI**: Semi-transparent elements with backdrop blur
- **Gradient Backgrounds**: Purple to blue gradient theme
- **Smooth Animations**: Hover effects and transitions
- **Professional Typography**: Modern font stack with gradient text
- **Responsive Layout**: Works on desktop and mobile devices
- **Interactive Elements**: Button hover effects and form validation

## 🚀 Demo & Usage

The application demonstrates a complete e-commerce flow:
1. **Browse Products**: View 10 mock products on the home page with modern card design
2. **Add to Cart**: Click "Add to Cart" buttons to add items (cart counter updates in header)
3. **View Cart**: Navigate to dedicated cart page via "View Cart" button
4. **Manage Items**: Update quantities with +/- buttons or remove items entirely
5. **Checkout**: Click "Proceed to Checkout" to open the checkout modal
6. **Complete Order**: Fill in name and email, submit to receive order confirmation
7. **Receipt**: View detailed receipt with order ID, timestamp, and itemized total

## 🌐 Live Demo

1. Start both servers (backend on :3001, frontend on :5173)
2. Open http://localhost:5173 in your browser
3. Test the complete shopping flow from product selection to checkout

## 🔄 Future Enhancements

- User authentication and profiles
- Product search and filtering
- Real payment gateway integration
- Order history and tracking
- Product reviews and ratings
- Inventory management

## 👨‍💻 Developer

**Priyansu Rathore**
- Full Stack Developer
- GitHub: [@PriyansuRathore](https://github.com/PriyansuRathore)
- Skills: React, Node.js, Express, JavaScript, SQLite, REST APIs
- Focus: Modern web development with responsive UI/UX design

Built with ❤️ for Vibe Commerce internship screening.

---

*This project showcases full-stack development skills including React, Node.js, Express, SQLite, REST APIs, and modern UI/UX design principles.*