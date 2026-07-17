const { pool } = require("../config/db");

// 1. Get All Products
const getProducts = async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = "SELECT * FROM products";
    const params = [];

    if (category && category !== "All") {
      query += " WHERE category = $1";
      params.push(category);
    }

    const result = await pool.query(query, params);
    res.json({ success: true, products: result.rows });
  } catch (error) {
    next(error);
  }
};

// 2. Get Product by ID
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// Helper: Get or Create Cart ID for user
const getOrCreateCartId = async (userId) => {
  // Try to find
  let result = await pool.query("SELECT id FROM cart WHERE user_id = $1", [userId]);
  if (result.rows.length > 0) {
    return result.rows[0].id;
  }

  // Create
  result = await pool.query(
    "INSERT INTO cart (user_id) VALUES ($1) ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id RETURNING id",
    [userId]
  );
  return result.rows[0].id;
};

// 3. Get Cart Items
const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cartId = await getOrCreateCartId(userId);

    const result = await pool.query(
      `
      SELECT ci.id, ci.product_id, ci.quantity, 
             p.name, p.price, p.category, p.image, p.stock_status, p.description
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
      ORDER BY ci.id ASC;
      `,
      [cartId]
    );

    res.json({ success: true, cartItems: result.rows });
  } catch (error) {
    next(error);
  }
};

// 4. Add to Cart
const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const cartId = await getOrCreateCartId(userId);

    // Verify product exists
    const prodCheck = await pool.query("SELECT id FROM products WHERE id = $1", [productId]);
    if (prodCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const result = await pool.query(
      `
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (cart_id, product_id)
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
      RETURNING *;
      `,
      [cartId, productId, quantity]
    );

    res.json({ success: true, cartItem: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// 5. Update Cart Item Quantity
const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ success: false, message: "Valid quantity is required" });
    }

    const result = await pool.query(
      "UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *",
      [quantity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.json({ success: true, cartItem: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// 6. Delete Cart Item
const deleteCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM cart_items WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.json({ success: true, message: "Cart item removed" });
  } catch (error) {
    next(error);
  }
};

// 7. Get Orders
const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `
      SELECT o.*, 
             (SELECT json_agg(json_build_object('id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price, 'name', p.name, 'image', p.image)) 
              FROM order_items oi 
              JOIN products p ON oi.product_id = p.id 
              WHERE oi.order_id = o.id) as items
      FROM orders o
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC;
      `,
      [userId]
    );

    res.json({ success: true, orders: result.rows });
  } catch (error) {
    next(error);
  }
};

// 8. Create Order (Pending Payment)
const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      customerName,
      customerEmail,
      shippingAddress,
      subtotal,
      deliveryCharge = 0.00,
      discount = 0.00,
      grandTotal,
      items,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cannot place order with empty items" });
    }

    // Insert order record
    const orderResult = await pool.query(
      `
      INSERT INTO orders (user_id, status, subtotal, delivery_charge, discount, grand_total, customer_name, customer_email, shipping_address, payment_method, payment_status)
      VALUES ($1, 'pending', $2, $3, $4, $5, $6, $7, $8, 'Razorpay', 'pending')
      RETURNING *;
      `,
      [userId, subtotal, deliveryCharge, discount, grandTotal, customerName, customerEmail, shippingAddress]
    );

    const order = orderResult.rows[0];

    // Insert order items
    for (const item of items) {
      await pool.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        `,
        [order.id, item.product_id || item.id, item.quantity, item.price]
      );
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  getOrders,
  createOrder,
};
