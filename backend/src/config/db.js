const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


pool.connect(async (err, client, release) => {
  if (err) {
    console.error(" Error connecting to PostgreSQL:", err.message);
  } else {
    console.log("PostgreSQL Connected Successfully");
    try {
      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS token_version INT DEFAULT 1;
        ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(255) UNIQUE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'email';

        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          token_hash VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP NOT NULL,
          revoked_at TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          category VARCHAR(100) NOT NULL,
          rating DECIMAL(3, 2) DEFAULT 5.0,
          stock_status VARCHAR(50) DEFAULT 'in_stock',
          description TEXT,
          image TEXT
        );

        CREATE TABLE IF NOT EXISTS cart (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE UNIQUE
        );

        CREATE TABLE IF NOT EXISTS cart_items (
          id SERIAL PRIMARY KEY,
          cart_id INT REFERENCES cart(id) ON DELETE CASCADE,
          product_id INT REFERENCES products(id) ON DELETE CASCADE,
          quantity INT DEFAULT 1,
          UNIQUE(cart_id, product_id)
        );

        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          status VARCHAR(50) DEFAULT 'pending',
          subtotal DECIMAL(10, 2) NOT NULL,
          delivery_charge DECIMAL(10, 2) DEFAULT 0.00,
          discount DECIMAL(10, 2) DEFAULT 0.00,
          grand_total DECIMAL(10, 2) NOT NULL,
          customer_name VARCHAR(255),
          customer_email VARCHAR(255),
          shipping_address TEXT,
          payment_method VARCHAR(50) DEFAULT 'Razorpay',
          payment_status VARCHAR(50) DEFAULT 'pending',
          razorpay_order_id VARCHAR(255),
          razorpay_payment_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INT REFERENCES orders(id) ON DELETE CASCADE,
          product_id INT REFERENCES products(id) ON DELETE CASCADE,
          quantity INT DEFAULT 1,
          price DECIMAL(10, 2) NOT NULL
        );
      `);

      const prodCheck = await pool.query("SELECT COUNT(*) FROM products");
      if (parseInt(prodCheck.rows[0].count) === 0) {
        await pool.query(`
          INSERT INTO products (name, price, category, rating, stock_status, description, image) VALUES
          ('Premium Artist Oil Paint Set', 89.00, 'Colours & Paints', 4.8, 'in_stock', 'Professional grade oil paints with intense pigment concentration, offering buttery consistency and excellent lightfastness.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400'),
          ('Sable Fine Detail Brush Pack', 24.50, 'Brushes & Tools', 4.9, 'in_stock', 'Handcrafted pure red sable brushes. Excellent spring, snap, and point retention for precision watercolour and miniature painting.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400'),
          ('Heavyweight Linen Canvas 16x20', 34.00, 'Canvas & Surfaces', 4.7, 'in_stock', 'Double-primed Belgian linen canvas on sturdy pine wood stretcher bars. Suitable for acrylics and heavy oils.', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400'),
          ('Hardbound Mixed Media Sketchbook', 18.90, 'Stationery', 4.6, 'in_stock', '200gsm acid-free cream paper with hardbound linen cover, perfect for sketching, ink washes, and light watercolours.', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=400'),
          ('Watercolour Painting Starter Kit', 45.00, 'Creative Kits', 4.8, 'in_stock', 'Complete watercolour painting starter kit. Includes 12 essential half-pans, watercolor paper pad, and 3 travel brushes.', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400'),
          ('Calligraphy & Lettering Pen Set', 29.90, 'Art Supplies', 4.7, 'in_stock', 'Archival quality brush pens with dynamic nylon tips. Ideal for modern calligraphy, hand lettering, and sketching.', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=400');
        `);
        console.log("Database seeded successfully with initial products");
      }

      console.log("Database tables initialized successfully");
    } catch (dbErr) {
      console.error("Database schema initialization failed:", dbErr.message);
    } finally {
      release();
    }
  }
});

module.exports = { pool };