import Customer from '../models/customerModel.js';
import bcrypt from "bcrypt"
import multer from "multer";
import path from 'path';
import jwt from 'jsonwebtoken';
const saltRounds = 10;

const storage = multer.diskStorage({
    destination: "./uploads/profile/",
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Accepted file types
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb("Error: Images Only!");
        }
    },
}).single("customerProfilePicture");

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
            console.log(customerPassword, customer.customerPassword)
            const match = await bcrypt.compare(customerPassword, customer.customerPassword);
            console.log(match)
            if (!match) {
                return res.status(401).json({ error: 'Incorrect password' });
            }
            const JWT_SECRET = 'your_jwt_secret';
            const token = jwt.sign({ customerEmail }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful' , token });
        } catch (error) {
            res.status(500).json({ error: error.message , });
        }   
    },

    getProfile: async (req, res) => {
        const customerId = req.params.id;
        try {
            const customer = await Customer.getProfile(customerId);
            if ((customer)) {
                res.status(200).json(customer);
            } else {
                res.status(404).json({ message: "Customer not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateProfile: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            const customerId = req.params.id;
            console.log(req.file);
            const { customerName, customerEmail, customerPhone, customerAddress, customerZipCode, customerCity, customerCountry } = req.body;
            const customerProfilePicture = req.file ? req.file.path : null;
            console.log(customerProfilePicture);
            try {
                const result = await Customer.updateProfile(customerId, { customerName, customerEmail, customerPhone, customerAddress, customerZipCode, customerCity, customerCountry, customerProfilePicture });
                res.status(200).json(result) // Redirect to all blogs after successful update
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    },
    deleteCustomer: async (req, res) => {
        const customerId = req.params.id;
        try {
            const result = await Customer.deleteCustomer(customerId); // Assuming you have this method in your Blog model
            //   res.redirect("/api/blogs/all");
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

export default customerController;
