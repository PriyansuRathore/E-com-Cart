const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'ecom.db');
const PRODUCTS_JSON = path.join(__dirname, 'data', 'products.json');

// Delete existing database
if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log('Deleted old database');
}

// Create new database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error creating database:', err);
    return;
  }
  console.log('Created new database');
});

// Initialize tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, 
    email TEXT UNIQUE, 
    password TEXT, 
    name TEXT, 
    phone TEXT, 
    address TEXT, 
    createdAt TEXT
  )`);

  // Categories table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY, 
    name TEXT, 
    description TEXT
  )`);

  // Products table with all fields
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY, 
    name TEXT, 
    price REAL, 
    description TEXT,
    category TEXT, 
    image TEXT, 
    stock INTEGER DEFAULT 100, 
    rating REAL DEFAULT 4.5
  )`);

  // Cart table
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id TEXT PRIMARY KEY, 
    userId TEXT, 
    productId TEXT, 
    qty INTEGER, 
    createdAt TEXT
  )`);

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY, 
    userId TEXT, 
    total REAL, 
    status TEXT, 
    items TEXT, 
    address TEXT, 
    createdAt TEXT
  )`);

  // Receipts table
  db.run(`CREATE TABLE IF NOT EXISTS receipts (
    id TEXT PRIMARY KEY, 
    total REAL, 
    payload TEXT, 
    timestamp TEXT
  )`);

  // Seed categories
  const categories = [
    { id: 'electronics', name: 'Electronics', description: 'Phones, Laptops, Gadgets' },
    { id: 'fashion', name: 'Fashion', description: 'Clothing, Shoes, Accessories' },
    { id: 'home', name: 'Home & Kitchen', description: 'Furniture, Appliances' },
    { id: 'books', name: 'Books', description: 'Fiction, Non-fiction, Educational' }
  ];

  const categoryStmt = db.prepare('INSERT INTO categories (id, name, description) VALUES (?,?,?)');
  categories.forEach(c => categoryStmt.run(c.id, c.name, c.description));
  categoryStmt.finalize();
  console.log('Seeded categories');

  // Seed products
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf8'));
  const productStmt = db.prepare('INSERT INTO products (id,name,price,description,category,image,stock,rating) VALUES (?,?,?,?,?,?,?,?)');
  products.forEach(p => productStmt.run(p.id, p.name, p.price, p.description, p.category, p.image, p.stock, p.rating));
  productStmt.finalize();
  console.log('Seeded products');

  console.log('Database reset complete!');
  db.close();
});