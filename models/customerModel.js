import { db } from "../db.js";

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

const customerModel = {
    createCustomer,
    getAllCustomers,
    forgotPassword,
};

export default customerModel;