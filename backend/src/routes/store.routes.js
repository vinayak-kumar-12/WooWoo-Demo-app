const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  getOrders,
  createOrder,
} = require("../controllers/store.controller");

const {
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/payment.controller");

const { authenticateAccessToken } = require("../middlewares/auth.middleware");

// Products - Public routes
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

// Apply authentication middleware to remaining store routes (Cart, Orders, Payments)
router.use(authenticateAccessToken);

// Cart
router.get("/cart", getCart);
router.post("/cart", addToCart);
router.patch("/cart/:id", updateCartItem);
router.delete("/cart/:id", deleteCartItem);

// Orders
router.get("/orders", getOrders);
router.post("/orders", createOrder);

// Payments (Razorpay)
router.post("/payments/create-order", createRazorpayOrder);
router.post("/payments/verify", verifyPayment);

module.exports = router;
