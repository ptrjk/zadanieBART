const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./database.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
});

const sql = `
    CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL
    )
    `;

db.run(sql, (err) => {
    if (err) return console.error(err.message);
    console.log('Products table created or already exists.');

    // Delete all rows from the products table
    db.run("DELETE FROM products", (err) => {
        if (err) return console.error(err.message);
        console.log('All rows deleted from products table.');

        // Insert new rows
        db.run("INSERT INTO products (name, quantity) VALUES ('Tricko', 10)", (err) => {
            if (err) return console.error(err.message);
            console.log('Inserted Tricko with quantity 10');
        });

        db.run("INSERT INTO products (name, quantity) VALUES ('Mikina', 5)", (err) => {
            if (err) return console.error(err.message);
            console.log('Inserted Mikina with quantity 5');
        });
    });
});

db.close((err) => {
    if (err) return console.error(err.message);
    console.log('Closed the database connection.');
});