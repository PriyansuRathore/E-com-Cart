-- products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT
);

-- cart table: stores cart items (simple single-user persistence)
CREATE TABLE IF NOT EXISTS cart (
  id TEXT PRIMARY KEY,
  productId TEXT,
  qty INTEGER,
  createdAt TEXT,
  FOREIGN KEY(productId) REFERENCES products(id)
);

-- receipts table to store mock checkouts
CREATE TABLE IF NOT EXISTS receipts (
  id TEXT PRIMARY KEY,
  total REAL,
  payload TEXT,
  timestamp TEXT
);
