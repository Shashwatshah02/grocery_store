const mysql = require('mysql2/promise');


// Create a MySQL connection pool
const db = mysql.createPool({
    host: '148.72.245.164',    // Replace with your host (e.g., '127.0.0.1' or 'localhost')
    user: 'partnerinai_grocery',         // Replace with your MySQL username
    password: 'Grocery@123',     // Replace with your MySQL password
    database: 'partnerinai_grocery_store',     // Replace with your database name
    connectionLimit: 10   // Limit for concurrent connections
});

// Function to get a connection
const getConnection = async () => {
    try {
        const connection = await db.getConnection();
        console.log('Successfully connected to the database');
        return connection;
    } catch (err) {
        console.error('Error getting database connection:', err);
        throw err;
    }
};

module.exports = { db, getConnection };
