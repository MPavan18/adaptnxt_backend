const User = require("../models/User");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET || "your_jwt_secret_key";

module.exports = {
  // Middleware to authenticate user
  isAuthenticated: (req, res, next) => {
    const token = req.headers.token
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Auth error:", error);
      res.status(401).json({ message: "Invalid token" });
    }
  },

  // Add Product to Cart
  addToCart: async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    console.log("Attempting to add product to cart:", { productId, userId: req.user.userId });

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart.includes(productId)) {
      user.cart.push(productId);
      await user.save();
    }

    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    console.error("Add to cart error:", {
      message: error.message,
      stack: error.stack,
      productId,
      userId: req.user?.userId,
    });
    res.status(500).json({ message: "Server error", error: error.message });
  }
},
  

  // Remove Product from Cart
  removeFromCart: async (req, res) => {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.cart = user.cart.filter((id) => id.toString() !== productId);
      await user.save();

      res.status(200).json({ message: "Product removed from cart", cart: user.cart });
    } catch (error) {
      console.error("Remove from cart error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Get User's Cart
  getCart: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).populate("cart");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ cart: user.cart });
    } catch (error) {
      console.error("Get cart error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};