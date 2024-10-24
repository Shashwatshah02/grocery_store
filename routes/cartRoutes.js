const express = require("express");
const cartController = require("../controller/cartController.js");
const { verifyToken } = require("../middleware/jwt.js");


const router = express.Router();

router.get("/", verifyToken, cartController.getCartById);
router.post("/update/:id", verifyToken, cartController.updateCartById);
router.get("/delete/:id", verifyToken, cartController.deleteCartById);
router.post("/insert", verifyToken, cartController.createCartByProductId);


module.exports = router;