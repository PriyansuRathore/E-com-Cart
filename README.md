# VibeCart - Full-Stack E-Commerce Platform

A modern e-commerce platform featuring user authentication, product management, and a sleek dark theme UI. Built with React, Node.js, Express, and SQLite.

## 🚀 Features

- **User Authentication**: JWT-based login/register with password reset
- **Product Management**: CRUD operations with category filtering and search
- **Shopping Cart**: Add/remove items, update quantities, view totals
- **Checkout Process**: Authenticated checkout with order processing
- **User Dashboard**: Profile management and cart summary
- **Dark Theme UI**: Modern glass morphism design with neon accents
- **Database Persistence**: SQLite database for users, products, and orders
- **Responsive Design**: Mobile-first approach with smooth animations

## 🛠 Tech Stack

**Frontend:**
- React 18 with Hooks
- React Router DOM
- Context API for state management
- Modern CSS with Dark Theme
- Vite (Build tool)

**Backend:**
- Node.js & Express.js
- JWT Authentication
- bcryptjs for password hashing
- SQLite3 database
- CORS enabled
- RESTful API design

## 📁 Project Structure

```
e com cart/
├── backend/
│   ├── data/
│   │   └── products.json
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── ecom.db
│   ├── reset-db.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── CategoryShowcase.jsx
│   │   │   ├── SearchFilters.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── CheckoutModal.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
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
   Server runs on http://localhost:4000

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

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | User registration |
| POST | `/api/login` | User login |
| GET | `/api/profile` | Get user profile (protected) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Fetch all products with filters |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Add new product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

### Cart & Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart items and total |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:id` | Update cart item quantity |
| DELETE | `/api/cart/:id` | Remove item from cart |
| POST | `/api/checkout` | Process checkout (protected) |

## ✨ Key Features Implemented

### ✅ Authentication System
- [x] JWT-based user registration and login
- [x] Password hashing with bcryptjs
- [x] Protected routes and middleware
- [x] Forgot password functionality
- [x] User session management

### ✅ Product Management
- [x] Full CRUD operations for products
- [x] Category-based filtering
- [x] Search functionality with multiple filters
- [x] Price range filtering and sorting
- [x] Product stock and rating system

### ✅ Shopping Experience
- [x] Dynamic product catalog with categories
- [x] Shopping cart with quantity management
- [x] Authenticated checkout process
- [x] Order receipt generation
- [x] User dashboard with profile and cart summary

### ✅ UI/UX Features
- [x] Dark theme with glass morphism effects
- [x] Responsive mobile-first design
- [x] Smooth animations and transitions
- [x] Loading states and error handling
- [x] Professional navigation and footer
- [x] Category showcase with horizontal scrolling

## 🎨 Design Highlights

- **Dark Theme**: Modern dark aesthetic with neon accent colors
- **Glass Morphism**: Semi-transparent cards with backdrop blur effects
- **Gradient Elements**: Colorful gradients for buttons and text
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Professional Typography**: Clean fonts with proper hierarchy
- **Interactive Elements**: Glowing buttons and form validation feedback

## 🚀 Demo & Usage

The application demonstrates a complete e-commerce flow:
1. **Register/Login**: Create account or sign in to access full features
2. **Browse Products**: View categorized products with search and filters
3. **Add to Cart**: Click "Add to Cart" buttons (cart counter updates in navbar)
4. **Manage Cart**: View dedicated cart page with quantity controls
5. **Authenticated Checkout**: Login required to proceed with checkout
6. **User Dashboard**: Access profile information and cart summary
7. **Product Management**: Add, edit, or delete products via API endpoints

## 🌐 Live Demo

1. Start both servers (backend on :4000, frontend on :5173)
2. Open http://localhost:5173 in your browser
3. Register a new account or login with existing credentials
4. Test the complete shopping flow with authentication
5. Use Postman to test API endpoints for product management

## 🔄 Future Enhancements

- Real payment gateway integration (Stripe/PayPal)
- Order history and tracking system
- Product reviews and ratings
- Advanced inventory management
- Email notifications for orders
- Admin panel for user management
- Real-time chat support
- Wishlist functionality

## 👨‍💻 Developer

**Priyansu Rathore**
- Full Stack Developer
- GitHub: [@PriyansuRathore](https://github.com/PriyansuRathore)
- Skills: React, Node.js, Express, JavaScript, SQLite, REST APIs
- Focus: Modern web development with responsive UI/UX design

Built with ❤️ showcasing modern full-stack development skills.

---

*This project showcases full-stack development skills including React, Node.js, Express, SQLite, REST APIs, and modern UI/UX design principles.*