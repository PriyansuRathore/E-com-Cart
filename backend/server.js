const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY, name TEXT, price REAL, description TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id TEXT PRIMARY KEY, productId TEXT, qty INTEGER, createdAt TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS receipts (
    id TEXT PRIMARY KEY, total REAL, payload TEXT, timestamp TEXT
  )`);

  // seed products if products table empty
  db.get("SELECT COUNT(*) as cnt FROM products", (err, row) => {
    if (err) return console.error(err);
    if (row.cnt === 0) {
      const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON,'utf8'));
      const stmt = db.prepare("INSERT INTO products (id,name,price,description) VALUES (?,?,?,?)");
      products.forEach(p => stmt.run(p.id, p.name, p.price, p.description));
      stmt.finalize();
      console.log("Seeded products");
    }
  });
});

// ----- ROUTES -----

// GET /api/products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", (err, rows) => {
    if (err) return res.status(500).json({error: "DB error"});
    res.json(rows);
  });
});

// GET /api/cart -> items + total
app.get('/api/cart', (req, res) => {
  const q = `SELECT c.id as id, c.productId, c.qty, p.name, p.price
             FROM cart c LEFT JOIN products p ON c.productId = p.id`;
  db.all(q, (err, rows) => {
    if (err) return res.status(500).json({error: "DB error"});
    const items = rows.map(r => ({
      id: r.id, productId: r.productId, qty: r.qty, name: r.name, price: r.price
    }));
    const total = items.reduce((s,i)=> s + (i.price || 0) * i.qty, 0);
    res.json({ items, total });
  });
});

// POST /api/cart - add {productId, qty}
app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({error: "Invalid payload"});
  }

  // If product already in cart, increment qty
  db.get("SELECT id, qty FROM cart WHERE productId = ?", [productId], (err, row) => {
    if (err) return res.status(500).json({error: "DB error"});
    if (row) {
      const newQty = row.qty + qty;
      db.run("UPDATE cart SET qty = ? WHERE id = ?", [newQty, row.id], function(err){
        if (err) return res.status(500).json({error: "DB error"});
        res.json({id: row.id, productId, qty: newQty});
      });
    } else {
      const id = uuidv4();
      const createdAt = new Date().toISOString();
      db.run("INSERT INTO cart (id, productId, qty, createdAt) VALUES (?,?,?,?)",
        [id, productId, qty, createdAt], function(err){
          if (err) return res.status(500).json({error: "DB error"});
          res.status(201).json({id, productId, qty});
        });
    }
  });
});

// PUT /api/cart/:id - update quantity
app.put('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  const { qty } = req.body;
  if (!Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({error: "Invalid quantity"});
  }
  db.run("UPDATE cart SET qty = ? WHERE id = ?", [qty, id], function(err){
    if (err) return res.status(500).json({error: "DB error"});
    if (this.changes === 0) return res.status(404).json({error: "Not found"});
    res.json({success: true});
  });
});

// DELETE /api/cart/:id - remove item
app.delete('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM cart WHERE id = ?", [id], function(err){
    if (err) return res.status(500).json({error: "DB error"});
    if (this.changes === 0) return res.status(404).json({error: "Not found"});
    res.json({success: true});
  });
});

// POST /api/checkout { cartItems } -> mock receipt with total + timestamp
app.post('/api/checkout', (req, res) => {
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
