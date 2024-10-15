const { db } = require("../db.js");


const createCustomer = async (customerName, customerEmail, customerPhone, hashedPassword) => {
    // console.log(customerName, customerEmail, customerPhone, hashedPassword)
    if (!customerName || !customerEmail || !customerPhone || !hashedPassword) {
        throw new Error("All fields are required");
    }
    const [result] = await db.execute('INSERT INTO customer_details (customerName, customerEmail, customerPhone, customerPassword) VALUES (?, ?, ?, ?)', [customerName, customerEmail, customerPhone, hashedPassword]);
    return result;
};
const getAllCustomers = async () => {
    const [customers] = await db.execute('SELECT * FROM customer_details');
    return customers;
}
const forgotPassword = async (customerEmail, hashedPassword) => {
    if (!customerEmail || !hashedPassword) {
        throw new Error("All fields are required");
    }
    const [result] = await db.execute('UPDATE customer_details SET customerPassword = ? WHERE customerEmail = ?', [hashedPassword, customerEmail]);
    return result;
};
const getProfile = async (customerId) => {
    const query = `SELECT customer_details.customerName, customer_details.customerEmail, customer_details.customerPhone, customer_details.customerAddress, customer_details.customerZipCode, customer_details.customerCity, customer_details.customerCountry, customer_details.customerProfilePicture FROM customer_details WHERE customerId = ?`;

    return db.query(query, [customerId]);
};

const createCompleteCustomer = async (customer) => {
    const { customerName, customerPassword, customerEmail, customerPhone, customerAddress, customerZipCode, customerCity, customerCountry, customerProfilePicture } = customer;
    const [result] = await db.execute(
        "INSERT INTO customer_details (customerName, customerPassword, customerEmail, customerPhone, customerAddress, customerZipCode, customerCity, customerCountry, customerProfilePicture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [customerName, customerPassword, customerEmail, customerPhone, customerAddress, customerZipCode, customerCity, customerCountry, customerProfilePicture]
    );
    return result;
}

const updateProfile = async (customerId, updatedProfile) => {
    const { customerName, customerEmail, customerPhone, customerAddress, customerZipCode, customerCity, customerCountry, customerProfilePicture } = updatedProfile;
    const [result] = await db.execute(
        "UPDATE customer_details SET customerName = ?, customerEmail = ?, customerPhone=?, customerAddress=?, customerZipCode=?, customerCity=?, customerCountry=?, customerProfilePicture=?  WHERE customerId = ?",
        [customerName, customerEmail, customerPhone, customerAddress, customerZipCode, customerCity, customerCountry, customerProfilePicture, customerId]
    );
    return result;
};
const deleteCustomer = async (customerId) => {
    try {
      // Execute the DELETE query
      const [result] = await db.query("DELETE FROM customer_details WHERE customerId = ?", [
        customerId,
      ]);
  
      // Check if any rows were affected
      if (result.affectedRows === 0) {
        throw new Error("Customer not found."); // If no rows were affected, the blog ID does not exist
      }
  
      return result; // Return the result for any additional handling if needed
    } catch (error) {
      // Handle any errors
      throw new Error("Error deleting the customer: " + error.message);
    }
  };
const customerModel = {
    createCustomer,
    getAllCustomers,
    forgotPassword,
    getProfile,
    updateProfile,
    deleteCustomer,
    createCompleteCustomer
};

module.exports = customerModel;