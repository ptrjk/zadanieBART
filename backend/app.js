const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');

const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./database.db', sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err);
    else {
        console.log('Connected to the database.');
    }
});

app.use(bodyparser.json());
app.use(cors())

app.post('/order', async (req, res) => {
    const { products } = req.body;

    try {
        for (let i = 0; i < products.length; i++) {
            const row = await new Promise((resolve, reject) => {
                db.get("SELECT quantity FROM products WHERE name = ?", [products[i].name], (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });

            if (!row || row.quantity < products[i].quantity) {
                return res.status(400).json({
                    success: false,
                });
            }
        }
        for (let i = 0; i < products.length; i++) {
            await new Promise((resolve, reject) => {
                db.run("UPDATE products SET quantity = quantity - ? WHERE name = ?", [products[i].quantity, products[i].name], function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
        return res.status(200).json({
            success: true,
        });

    } catch (error) {
        console.error("Error processing order:", error);
        return res.status(500).json({
            error: "Server error",
        });
    }
});


// get request
app.get("/products", (req, res) => {
    sql = "SELECT * FROM products";
    try {
        db.all(sql, [], (error, rows) => {
            if (error) return res.json({
                status: 300,
                success: false,
                error: error
            });
            if (rows.length < 1)
                return res.json({
                    status: 300,
                    success: false,
                    error: "No match"
                });

            return res.json({
                status: 200,
                data: rows,
                success: true,
            });
        })
    } catch (error) {
        return res.json({
            status: 400,
            success: false,
        });
    }

})

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:5000`);
});