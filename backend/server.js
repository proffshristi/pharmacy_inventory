const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();
const portNo = 1301;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Azure SQL connection config
const config = {
    user: "ShristiMishra",
    password: "NewPassword123!",
    server: "pharmacydatabase.database.windows.net",
    database: "MyDatabase",
    port: 1433,
    connectionTimeout: 60000,  
    requestTimeout: 60000,    
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// Connect to database
let pool;
async function connectDB() {
    try {
        pool = await sql.connect(config);
        console.log("Database connected successfully");
    } catch (err) {
        console.log("Error connecting to database:", err.message);
    }
}

// Wait for DB to connect FIRST, then start server
connectDB().then(() => {
    app.listen(portNo, () => {
        console.log("Server running on port", portNo);
    });
});
// GET all medicines
app.get("/data", async (req, res) => {
    try {
        const result = await pool.request()
            .query("SELECT * FROM medicineData");
        console.log("Successful get operation");
        res.status(200).json(result.recordset);
    } catch (err) {
        console.log("Error getting data:", err.message);
        res.status(500).json({ err: err.message });
    }
});

// POST add medicine
app.post("/data", async (req, res) => {
    const { medName, category, price, expDate, stock } = req.body;
    const newDate = expDate.slice(0, 10);
    try {
        const result = await pool.request()
            .input("medName", sql.VarChar, medName)
            .input("category", sql.VarChar, category)
            .input("price", sql.Decimal, price)
            .input("expDate", sql.Date, newDate)
            .input("stock", sql.Int, stock)
            .query("INSERT INTO medicineData (medName, category, price, expDate, stock) VALUES (@medName, @category, @price, @expDate, @stock)");
        console.log("Successful add operation");
        res.status(200).json(result);
    } catch (err) {
        console.log("Error adding data:", err.message);
        res.status(500).json({ err: err.message });
    }
});

// DELETE medicine
app.delete("/data/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM medicineData WHERE id = @id");
        console.log("Successful delete operation");
        res.status(200).json(result);
    } catch (err) {
        console.log("Error deleting data:", err.message);
        res.status(500).json({ err: err.message });
    }
});

// PUT update medicine
app.put("/data/:id", async (req, res) => {
    const { id } = req.params;
    const { medName, category, price, expDate, stock } = req.body;
    const newDate = expDate.slice(0, 10);
    try {
        const result = await pool.request()
            .input("medName", sql.VarChar, medName)
            .input("category", sql.VarChar, category)
            .input("price", sql.Decimal, price)
            .input("expDate", sql.Date, newDate)
            .input("stock", sql.Int, stock)
            .input("id", sql.Int, id)
            .query("UPDATE medicineData SET medName=@medName, category=@category, price=@price, expDate=@expDate, stock=@stock WHERE id=@id");
        console.log("Successful update operation");
        res.status(200).json(result);
    } catch (err) {
        console.log("Error updating data:", err.message);
        res.status(500).json({ err: err.message });
    }
});


