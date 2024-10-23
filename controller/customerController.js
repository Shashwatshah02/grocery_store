const Customer = require('../models/customerModel.js');
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const logger = require('../logger.js');
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
            const customers = await Customer.getCustomerByEmail(customerEmail);
            if (customers.length > 0) {
                return res.status(400).json({ error: 'Customer already exists' });
            }
            const hashedPassword = await bcrypt.hash(customerPassword, saltRounds);
            const customer = await Customer.createCustomer(customerName, customerEmail, customerPhone, hashedPassword);
            console.log(customer);
            res.status(201).json({ message: 'Customer created successfully' });
            console.log("create customer")
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },

    getAllCustomers: async (req, res) => {
        try {
            const customers = await Customer.getAllCustomers();
            res.status(200).json({ customers });
            console.log("get all customers")
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { customerEmail, customerPassword } = req.body;
            if (!customerEmail || !customerPassword) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            // console.log(customerEmail)
            const customer = await Customer.getCustomerByEmail(customerEmail);
            // const customer = customers.find((customer) => customer.customerEmail === customerEmail);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }

            const hashedPassword = await bcrypt.hash(customerPassword, saltRounds);
            await Customer.forgotPassword(customerEmail, hashedPassword);
            res.status(200).json({ message: 'Password updated successfully' });
            console.log("forgot password")
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },
    loginCustomer: async (req, res) => {
        try {
            const { customerEmail, customerPassword } = req.body;
            if (!customerEmail || !customerPassword) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            console.log(customerEmail)
            const customer = await Customer.getCustomerByEmail(customerEmail);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            console.log(customer)
            const id = customer[0].customerId;
            // console.log(id)
            // const hashedPassword = await bcrypt.hash(customerPassword, saltRounds); 
            console.log(customerPassword, customer[0].customerPassword, customer[0].customerId)
            const match = await bcrypt.compare(customerPassword, customer[0].customerPassword);
            console.log(match)
            if (!match) {
                return res.status(401).json({ error: 'Incorrect password' });
            }

            const token = generateToken(id);
            res.status(200).json({ message: 'Login successful', token, customer: customer[0] });
            console.log("login customer")
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message, });
        }
    },

    getProfile: async (req, res) => {
        const customerId = req.params.id;
        if (!customerId) {
            res.status(404).json({ error: "No customer Id found" })
        }

        try {
            const customer = await Customer.getProfile(customerId);
            if ((customer)) {
                console.log(customer);
                res.status(200).json({ customer: customer[0][0] });
            } else {
                res.status(404).json({ message: "Customer not found" });
            }
            console.log("get profile")
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
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
            if (!customerId) {
                res.status(404).json({ error: "No customer Id found" })
            }
            console.log(req.file);
            const { customerName, customerEmail, customerPhone, customerAddress, customerZipCode, customerCity, customerCountry } = req.body;
            if (!customerName || !customerEmail || !customerPhone || !customerAddress || !customerZipCode || !customerCity || !customerCountry) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const customerProfilePicture = req.file ? req.file.path : null;
            console.log(customerProfilePicture);
            try {
                const result = await Customer.updateProfile(customerId, { customerName, customerEmail, customerPhone, customerAddress, customerZipCode, customerCity, customerCountry, customerProfilePicture });
                res.status(200).json(result) // Redirect to all blogs after successful update
            } catch (error) {
                logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
                res.status(500).json({ error: error.message });
            }
        });
        // console.log("update profile")
    },
    deleteCustomer: async (req, res) => {
        const customerId = req.params.id;
        if (!customerId) {
            res.status(404).json({ error: "No customer Id found" })
        }
        try {
            const result = await Customer.deleteCustomer(customerId); // Assuming you have this method in your Blog model
            //   res.redirect("/api/blogs/all");
            res.status(200).json(result);
            console.log("delete customer")
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },
    getAllCustomersAdmin: async (req, res) => {
        try {
            const customers = await Customer.getAllCustomers();
            res.render('theme/user-list', { title: 'User List', customers: customers });
            console.log("get all customers admin")
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },

    getProfileAdmin: async (req, res) => {
        const customerId = req.params.id;
        if (!customerId) {
            res.status(404).json({ error: "No customer Id found" })
        }
        try {
            const customer = await Customer.getProfile(customerId);
            if ((customer)) {
                console.log(customer);
                res.render('theme/edit-user', { title: 'User Edit', customer: customer[0][0], customerId });
            } else {
                res.status(404).json({ message: "Customer not found" });
            }
            console.log("get profile admin")
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
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
            if (!customerId) {
                res.status(404).json({ error: "No customer Id found" })
            }
            console.log(req.file);
            const { customerName, customerEmail, customerPhone, customerAddress, customerZipCode, customerCity, customerCountry } = req.body;
            if (!customerName || !customerEmail || !customerPhone || !customerAddress || !customerZipCode || !customerCity || !customerCountry) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            const customerProfilePicture = req.file ? req.file.path : null;
            console.log(customerProfilePicture);
            try {
                await Customer.updateProfile(customerId, { customerName, customerEmail, customerPhone, customerAddress, customerZipCode, customerCity, customerCountry, customerProfilePicture });
                res.redirect('/admin/customer') // Redirect to all blogs after successful update
            } catch (error) {
                logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
                res.status(500).json({ error: error.message });
            }
        });
        // console.log("update profile admin")
    },
    deleteCustomerAdmin: async (req, res) => {
        const customerId = req.params.id;
        if (!customerId) {
            res.status(404).json({ error: "No customer Id found" })
        }
        try {
            const result = await Customer.deleteCustomer(customerId); // Assuming you have this method in your Blog model
            //   res.redirect("/api/blogs/all");
            res.redirect("/admin/customer");
            console.log("delete customer admin")
        } catch (error) {
            logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
            res.status(500).json({ error: error.message });
        }
    },

    createCompleteCustomerAdmin: async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err });
            }

            const { customerName, customerPassword, customerEmail, customerPhone, customerAddress, customerZipCode, customerCity, customerCountry } = req.body;
            if (!customerName || !customerPassword || !customerEmail || !customerPhone || !customerAddress || !customerZipCode || !customerCity || !customerCountry) {
                return res.status(400).json({ error: 'All fields are required' });
            }
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
                logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
                res.status(500).json({ error: error.message });
            }
            console.log("create complete customer admin")
        });
    }


}

module.exports = customerController;
