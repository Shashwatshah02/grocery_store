const Customer = require('../models/customerModel.js');
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { generateToken } = require('../middleware/jwt.js');


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
            res.status(201).json({ message: 'Customer created successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getAllCustomers: async (req, res) => {
        try {
            const customers = await Customer.getAllCustomers();
            res.status(200).json({ customers });
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
            console.log(customerEmail)
            console.log(customers)
            const customer = customers.find((customer) => customer.customerEmail === customerEmail);
            console.log(customer)
            const id = customer.customerId;
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            // const hashedPassword = await bcrypt.hash(customerPassword, saltRounds); 
            console.log(customerPassword, customer.customerPassword, customer.customerId)
            const match = await bcrypt.compare(customerPassword, customer.customerPassword);
            console.log(match)
            if (!match) {
                return res.status(401).json({ error: 'Incorrect password' });
            }

            const token = generateToken(id);
            res.status(200).json({ message: 'Login successful', token, customer });
        } catch (error) {
            res.status(500).json({ error: error.message, });
        }
    },

    getProfile: async (req, res) => {
        const customerId = req.params.id;
        try {
            const customer = await Customer.getProfile(customerId);
            if ((customer)) {
                console.log(customer);
                res.status(200).json({ customer: customer[0][0] });
            } else {
                res.status(404).json({ message: "Customer not found" });
            }
        } catch (error) {
            console.log(error);
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
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getAllCustomersAdmin: async (req, res) => {
        try {
            const customers = await Customer.getAllCustomers();
            res.render('theme/user-list', { title: 'User List', customers: customers });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    forgotPasswordAdmin: async (req, res) => {
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
    loginCustomerAdmin: async (req, res) => {
        try {
            const customers = await Customer.getAllCustomers();
            const { customerEmail, customerPassword } = req.body;
            console.log(customerEmail)
            const customer = customers.find((customer) => customer.customerEmail === customerEmail);
            const id = customer.customerId;
            console.log(id)
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            // const hashedPassword = await bcrypt.hash(customerPassword, saltRounds); 
            console.log(customerPassword, customer.customerPassword, customer.customerId)
            const match = await bcrypt.compare(customerPassword, customer.customerPassword);
            console.log(match)
            if (!match) {
                return res.status(401).json({ error: 'Incorrect password' });
            }

            const token = generateToken(id);
            res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            res.status(500).json({ error: error.message, });
        }
    },

    getProfileAdmin: async (req, res) => {
        const customerId = req.params.id;
        try {
            const customer = await Customer.getProfile(customerId);
            if ((customer)) {
                console.log(customer);
                res.render('theme/edit-user', { title: 'User Edit', customer: customer[0][0], customerId });
            } else {
                res.status(404).json({ message: "Customer not found" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    },
    updateProfileAdmin: async (req, res) => {
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
                res.redirect('/admin/customer') // Redirect to all blogs after successful update
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    },
    deleteCustomerAdmin: async (req, res) => {
        const customerId = req.params.id;
        try {
            const result = await Customer.deleteCustomer(customerId); // Assuming you have this method in your Blog model
            //   res.redirect("/api/blogs/all");
            res.redirect("/admin/customer");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createCompleteCustomerAdmin: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }

            const { customerName, customerPassword, customerEmail, customerPhone, customerAddress, customerZipCode, customerCity, customerCountry } = req.body;
            const customerProfilePicture = req.file ? req.file.path : null;

            console.log(req.body);

            try {
                // Hash the password before storing it
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(customerPassword, saltRounds);

                // Create the customer record with the hashed password
                const result = await Customer.createCompleteCustomer({
                    customerName,
                    customerPassword: hashedPassword,  // Store the hashed password
                    customerEmail,
                    customerPhone,
                    customerAddress,
                    customerZipCode,
                    customerCity,
                    customerCountry,
                    customerProfilePicture
                });

                res.redirect('/admin/customer'); // Redirect to customer page after successful creation
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }


}

module.exports = customerController;
