const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ecom.db');

console.log('=== PRODUCTS ===');
db.all("SELECT * FROM products", (err, rows) => {
  if (err) console.error(err);
  else console.table(rows);
  
  console.log('\n=== CART ===');
  db.all("SELECT * FROM cart", (err, rows) => {
    if (err) console.error(err);
    else console.table(rows);
    
    console.log('\n=== RECEIPTS ===');
    db.all("SELECT * FROM receipts", (err, rows) => {
      if (err) console.error(err);
      else console.table(rows);
      db.close();
    });
  });
});