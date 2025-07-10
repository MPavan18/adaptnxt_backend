const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.isAuthenticated, cartController.addToCart);
router.post("/remove", cartController.isAuthenticated, cartController.removeFromCart);
router.get("/", cartController.isAuthenticated, cartController.getCart);

module.exports = router;