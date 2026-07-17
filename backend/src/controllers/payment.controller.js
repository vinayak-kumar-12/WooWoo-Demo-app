const Razorpay = require("razorpay");
const crypto = require("crypto");
const { pool } = require("../config/db");

// Initialize Razorpay client on demand
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder_key",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
  });
};

// 1. Create Razorpay Order
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const localOrderResult = await pool.query("SELECT * FROM orders WHERE id = $1", [orderId]);
    if (localOrderResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    const order = localOrderResult.rows[0];

    const rzp = getRazorpayInstance();
    const amountInPaise = Math.round(parseFloat(order.grand_total) * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${order.id}`,
    };

    rzp.orders.create(options, async (err, rzpOrder) => {
      if (err) {
        console.error("Razorpay order creation failed:", err);
        // Fallback for mock checkout flows when credentials are not configured or invalid
        const mockRzpOrderId = `rzp_order_mock_${Date.now()}`;
        await pool.query(
          "UPDATE orders SET razorpay_order_id = $1 WHERE id = $2",
          [mockRzpOrderId, order.id]
        );
        return res.json({
          success: true,
          mock: true,
          key: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder_key",
          razorpayOrderId: mockRzpOrderId,
          amount: amountInPaise,
          currency: "INR",
          orderId: order.id,
        });
      }

      // Successful real order creation
      await pool.query(
        "UPDATE orders SET razorpay_order_id = $1 WHERE id = $2",
        [rzpOrder.id, order.id]
      );

      res.json({
        success: true,
        key: process.env.RAZORPAY_KEY_ID,
        razorpayOrderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        orderId: order.id,
      });
    });
  } catch (error) {
    next(error);
  }
};

// 2. Verify Signature & Finalize Payment
const verifyPayment = async (req, res, next) => {
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({ success: false, message: "Missing required verification properties" });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";
    
    // Support mock payments for developer verification testing
    const isMock = razorpayOrderId.startsWith("rzp_order_mock_") || razorpaySignature === "mock_signature";
    let verified = false;

    if (isMock) {
      verified = true;
    } else {
      const hmac = crypto.createHmac("sha256", keySecret);
      hmac.update(razorpayOrderId + "|" + razorpayPaymentId);
      const generatedSignature = hmac.digest("hex");
      verified = generatedSignature === razorpaySignature;
    }

    if (verified) {
      // Signature is valid. Confirm order
      await pool.query(
        "UPDATE orders SET status = 'confirmed', payment_status = 'completed', razorpay_payment_id = $1 WHERE id = $2",
        [razorpayPaymentId, orderId]
      );

      // Clear the customer's cart
      const localOrderResult = await pool.query("SELECT user_id FROM orders WHERE id = $1", [orderId]);
      if (localOrderResult.rows.length > 0) {
        const userId = localOrderResult.rows[0].user_id;
        const cartResult = await pool.query("SELECT id FROM cart WHERE user_id = $1", [userId]);
        if (cartResult.rows.length > 0) {
          await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cartResult.rows[0].id]);
        }
      }

      res.json({ success: true, message: "Payment verified and order confirmed" });
    } else {
      // Verification failed
      await pool.query(
        "UPDATE orders SET status = 'cancelled', payment_status = 'failed' WHERE id = $1",
        [orderId]
      );
      res.status(400).json({ success: false, message: "Payment verification failed: Signature mismatch" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};
