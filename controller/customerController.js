import Customer from '../models/customerModel.js';
import bcrypt from "bcrypt"
const saltRounds = 10;

const customerController = {
    createCustomer: async (req, res) => {
        try {
            const { customerName, customerEmail, customerPhone, customerPassword } = req.body;
            console.log(customerName, customerEmail, customerPhone, customerPassword)
            if (customerName === undefined || customerEmail === undefined || customerPhone === undefined || customerPassword === undefined) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const hashedPassword = await bcrypt.hash(customerPassword, saltRounds);
            const customer = await Customer.createCustomer(customerName, customerEmail, customerPhone, hashedPassword);
            console.log(customer);
            res.status(200).json(customer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllCustomers: async (req, res) => {
        try {
            const customers = await Customer.getAllCustomers();
            res.status(200).json(customers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const customers = await Customer.getAllCustomers();
            const { customerEmail, customerPassword } = req.body;
            console.log(customerEmail)
            const customer = customers.find((customer) => customer.customerEmail === customerEmail);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            
            const hashedPassword = await bcrypt.hash(customerPassword, saltRounds);
            await Customer.forgotPassword(customerEmail, hashedPassword);
            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    loginCustomer: async (req, res) => {    
        try {
            const customers = await Customer.getAllCustomers();
            const { customerEmail, customerPassword } = req.body;
            // console.log(customerEmail)
            const customer = customers.find((customer) => customer.customerEmail === customerEmail);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            // const hashedPassword = await bcrypt.hash(customerPassword, saltRounds); 
            console.log(hashedPassword, customer.customerPassword)   
            const match = await bcrypt.compare(hashedPassword, customer.customerPassword);
            console.log(match)
            if (!match) {
                return res.status(401).json({ error: 'Incorrect password' });
            }
            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default customerController;
