const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth, JWT_SECRET } = require('./middleware/auth');

const DB_PATH = path.join(__dirname, 'ecom.db');
const PRODUCTS_JSON = path.join(__dirname, 'data', 'products.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// open (or create) DB
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) return console.error("DB open error:", err);
  console.log("Connected to SQLite DB");
});

// initialize tables and seed products if empty
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, email TEXT UNIQUE, password TEXT, name TEXT, 
    phone TEXT, address TEXT, createdAt TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY, name TEXT, description TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY, name TEXT, price REAL, description TEXT,
    category TEXT, image TEXT, stock INTEGER DEFAULT 100, rating REAL DEFAULT 4.5
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id TEXT PRIMARY KEY, userId TEXT, productId TEXT, qty INTEGER, createdAt TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY, userId TEXT, total REAL, status TEXT, 
    items TEXT, address TEXT, createdAt TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS receipts (
    id TEXT PRIMARY KEY, total REAL, payload TEXT, timestamp TEXT
  )`);

  // seed products if products table empty
  db.get("SELECT COUNT(*) as cnt FROM products", (err, row) => {
    if (err) return console.error(err);
    if (row.cnt === 0) {
      const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON,'utf8'));
      const stmt = db.prepare("INSERT INTO products (id,name,price,description,category,image,stock,rating) VALUES (?,?,?,?,?,?,?,?)");
      products.forEach(p => stmt.run(p.id, p.name, p.price, p.description, p.category, p.image, p.stock, p.rating));
      stmt.finalize();
      console.log("Seeded products with categories");
    }
  });
});

// ----- AUTH ROUTES -----

// POST /api/register
app.post('/api/register', async (req, res) => {
  const { email, password, name, phone } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    
    db.run('INSERT INTO users (id, email, password, name, phone, createdAt) VALUES (?,?,?,?,?,?)',
      [id, email, hashedPassword, name, phone, createdAt], function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Registration failed' });
        }
        
        const token = jwt.sign({ userId: id, email }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id, email, name, phone } });
      });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, phone: user.phone } });
  });
});

// GET /api/profile
app.get('/api/profile', auth, (req, res) => {
  db.get('SELECT id, email, name, phone, address FROM users WHERE id = ?', [req.user.userId], (err, user) => {
    if (err) return res.status(500).json({ error: 'Server error' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

// ----- CATEGORY ROUTES -----

// GET /api/categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// ----- PRODUCT ROUTES -----

// GET /api/products with search and filters
app.get('/api/products', (req, res) => {
  const { search, category, minPrice, maxPrice, sort } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  let params = [];
  
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  if (minPrice) {
    query += ' AND price >= ?';
    params.push(minPrice);
  }
  
  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(maxPrice);
  }
  
  if (sort === 'price_low') query += ' ORDER BY price ASC';
  else if (sort === 'price_high') query += ' ORDER BY price DESC';
  else if (sort === 'rating') query += ' ORDER BY rating DESC';
  else query += ' ORDER BY name ASC';
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });
});

// POST /api/products - Add new product
app.post('/api/products', (req, res) => {
  const { name, price, description, category, image, stock, rating } = req.body;
  
  // Validation
  if (!name || !price || !description) {
    return res.status(400).json({ error: 'Name, price, and description are required' });
  }
  
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }
  
  const id = uuidv4();
  const productData = {
    id,
    name,
    price,
    description,
    category: category || 'electronics',
    image: image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300',
    stock: stock || 100,
    rating: rating || 4.0
  };
  
  db.run(
    'INSERT INTO products (id, name, price, description, category, image, stock, rating) VALUES (?,?,?,?,?,?,?,?)',
    [productData.id, productData.name, productData.price, productData.description, 
     productData.category, productData.image, productData.stock, productData.rating],
    function(err) {
      if (err) {
        console.error('Error adding product:', err);
        return res.status(500).json({ error: 'Failed to add product' });
      }
      res.status(201).json({ 
        message: 'Product added successfully', 
        product: productData 
      });
    }
  );
});

// PUT /api/products/:id - Update product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, image, stock, rating } = req.body;
  
  // Check if product exists
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    // Update with provided values or keep existing ones
    const updatedProduct = {
      name: name || product.name,
      price: price || product.price,
      description: description || product.description,
      category: category || product.category,
      image: image || product.image,
      stock: stock !== undefined ? stock : product.stock,
      rating: rating || product.rating
    };
    
    db.run(
      'UPDATE products SET name=?, price=?, description=?, category=?, image=?, stock=?, rating=? WHERE id=?',
      [updatedProduct.name, updatedProduct.price, updatedProduct.description,
       updatedProduct.category, updatedProduct.image, updatedProduct.stock, 
       updatedProduct.rating, id],
      function(err) {
        if (err) return res.status(500).json({ error: 'Failed to update product' });
        res.json({ message: 'Product updated successfully', product: { id, ...updatedProduct } });
      }
    );
  });
});

// DELETE /api/products/:id - Delete product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to delete product' });
    if (this.changes === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  });
});

// GET /api/cart -> items + total
app.get('/api/cart', (req, res) => {
  const q = `SELECT c.id as id, c.productId, c.qty, p.name, p.price
             FROM cart c LEFT JOIN products p ON c.productId = p.id`;
  db.all(q, (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    const items = rows.map(r => ({
      id: r.id, productId: r.productId, qty: r.qty, 
      name: r.name, price: r.price
    }));
    const total = items.reduce((s,i)=> s + (i.price || 0) * i.qty, 0);
    res.json({ items, total });
  });
});

// POST /api/cart - add {productId, qty}
app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  // If product already in cart, increment qty
  db.get('SELECT id, qty FROM cart WHERE productId = ?', [productId], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (row) {
      const newQty = row.qty + qty;
      db.run('UPDATE cart SET qty = ? WHERE id = ?', [newQty, row.id], function(err){
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json({ id: row.id, productId, qty: newQty });
      });
    } else {
      const id = uuidv4();
      const createdAt = new Date().toISOString();
      db.run('INSERT INTO cart (id, productId, qty, createdAt) VALUES (?,?,?,?)',
        [id, productId, qty, createdAt], function(err){
          if (err) return res.status(500).json({ error: 'DB error' });
          res.status(201).json({ id, productId, qty });
        });
    }
  });
});

// PUT /api/cart/:id - update quantity
app.put('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  const { qty } = req.body;
  if (!Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }
  
  db.run('UPDATE cart SET qty = ? WHERE id = ?', [qty, id], function(err){
    if (err) return res.status(500).json({ error: 'DB error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  });
});

// DELETE /api/cart/:id - remove item
app.delete('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  
  db.run('DELETE FROM cart WHERE id = ?', [id], function(err){
    if (err) return res.status(500).json({ error: 'DB error' });
    if (this.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  });
});

// POST /api/checkout { cartItems } -> mock receipt with total + timestamp
app.post('/api/checkout', auth, (req, res) => {
  const { cartItems, name, email } = req.body;
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({error: "Empty cart"});
  }
  // compute total by fetching current prices
  const ids = cartItems.map(i => `'${i.productId}'`).join(',');
  db.all(`SELECT id, price, name FROM products WHERE id IN (${ids})`, (err, rows) => {
    if (err) return res.status(500).json({error: "DB error"});
    // map product price
    const priceMap = {};
    rows.forEach(r => priceMap[r.id] = { price: r.price, name: r.name });
    let total = 0;
    const lineItems = cartItems.map(ci => {
      const p = priceMap[ci.productId] || { price: 0, name: 'Unknown' };
      const sub = (p.price || 0) * (ci.qty || 0);
      total += sub;
      return { productId: ci.productId, name: p.name, qty: ci.qty, price: p.price, subTotal: sub };
    });
    const receipt = {
      id: uuidv4(),
      buyer: { name: name || null, email: email || null },
      total,
      items: lineItems,
      timestamp: new Date().toISOString()
    };
    db.run("INSERT INTO receipts (id,total,payload,timestamp) VALUES (?,?,?,?)",
      [receipt.id, receipt.total, JSON.stringify(receipt), receipt.timestamp], function(err){
        if (err) console.error("receipt save error", err);
        // optional: clear cart (single-user)
        db.run("DELETE FROM cart", [], function(delErr){
          if (delErr) console.error("cart clear error", delErr);
          res.json({ receipt });
        });
      });
  });
});

// simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Seed categories and enhanced products
db.get('SELECT COUNT(*) as cnt FROM categories', (err, row) => {
  if (err) return console.error(err);
  if (row.cnt === 0) {
    const categories = [
      { id: 'electronics', name: 'Electronics', description: 'Phones, Laptops, Gadgets' },
      { id: 'fashion', name: 'Fashion', description: 'Clothing, Shoes, Accessories' },
      { id: 'home', name: 'Home & Kitchen', description: 'Furniture, Appliances' },
      { id: 'books', name: 'Books', description: 'Fiction, Non-fiction, Educational' }
    ];
    const stmt = db.prepare('INSERT INTO categories (id, name, description) VALUES (?,?,?)');
    categories.forEach(c => stmt.run(c.id, c.name, c.description));
    stmt.finalize();
    console.log('Seeded categories');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
