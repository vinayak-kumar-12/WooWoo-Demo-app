const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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
      if (parseInt(prodCheck.rows[0].count) < 30) {
        await pool.query("TRUNCATE TABLE products CASCADE;");
        await pool.query(`
          INSERT INTO products (name, price, category, rating, stock_status, description, image) VALUES
          ('Premium Artist Oil Paint Set', 89.00, 'Colours & Paints', 4.8, 'in_stock', 'Professional grade oil paints with intense pigment concentration, offering buttery consistency and excellent lightfastness.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400'),
          ('Acrylic Paint Kit - 24 Colours', 35.00, 'Colours & Paints', 4.7, 'in_stock', 'Rich, creamy acrylic paints that glide onto surfaces smoothly, drying quickly to a durable satin finish.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400'),
          ('Metallic Acrylic Paint Set', 28.00, 'Colours & Paints', 4.6, 'in_stock', 'Shimmering metallic colors including Gold, Silver, Bronze, and Copper. High coverage and brilliant sheen.', 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=400'),
          ('Professional Watercolour Pan Set', 55.00, 'Colours & Paints', 4.9, 'in_stock', 'Artist-quality watercolour half-pans in a sleek metal travel tin. Superior transparency and color strength.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&fit=crop'),
          ('Gouache Paint Set - 18 Tubes', 32.50, 'Colours & Paints', 4.5, 'in_stock', 'Opaque watercolours with a beautiful matte finish. Perfect for designers, illustrators, and fine artists.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&q=50'),
          ('Fluorescent Neon Paint Set', 22.50, 'Colours & Paints', 4.4, 'in_stock', 'Glow under UV blacklight. Highly vibrant colors that add neon punch to your canvases and crafts.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&fit=scale'),
          ('Sable Fine Detail Brush Pack', 24.50, 'Brushes & Tools', 4.9, 'in_stock', 'Handcrafted pure red sable brushes. Excellent spring, snap, and point retention for precision watercolour and miniature painting.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400'),
          ('Synthetic Acrylic Brush Set', 18.00, 'Brushes & Tools', 4.6, 'in_stock', 'Durable nylon brushes suited for acrylic and heavy-body paints. Pack includes flats, rounds, and fan brushes.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&fit=crop'),
          ('Hog Bristle Oil Paint Brushes', 29.00, 'Brushes & Tools', 4.7, 'in_stock', 'Stiff Chinese hog bristles that hold heavy oil paints with ease. Long wooden handles for perfect easel balance.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&q=70'),
          ('Palette Knives & Spatula Set', 15.00, 'Brushes & Tools', 4.8, 'in_stock', 'Stainless steel blades with flexible, comfortable wooden handles. Ideal for impasto techniques and paint mixing.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&fit=crop&q=60'),
          ('Airbrush Compression Gun Kit', 110.00, 'Brushes & Tools', 4.7, 'in_stock', 'Complete airbrush kit with mini compressor. Dual-action gravity feed spray gun for model painting, makeup, and illustration.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&a=1'),
          ('Detail Painting Micro-Brushes', 13.50, 'Brushes & Tools', 4.8, 'in_stock', 'Ultra-fine detailing brushes (sizes 000 to 0) designed specifically for paint-by-numbers, miniatures, and figurines.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&q=40'),
          ('Heavyweight Linen Canvas 16x20', 34.00, 'Canvas & Surfaces', 4.7, 'in_stock', 'Double-primed Belgian linen canvas on sturdy pine wood stretcher bars. Suitable for acrylics and heavy oils.', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400'),
          ('Stretched Cotton Canvas Multipack', 26.00, 'Canvas & Surfaces', 4.5, 'in_stock', 'Pack of 5 stretched 100% cotton canvases (8x10 to 12x16). Acid-free gesso primed, ready to paint.', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400&c=1'),
          ('Watercolor Paper Pad 300gsm', 19.50, 'Canvas & Surfaces', 4.8, 'in_stock', 'Cold-pressed, acid-free, 100% cotton watercolour paper sheets. Resists buckling and tearing under heavy wet media.', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400&q=50'),
          ('Mixed Media Art Board Set', 22.00, 'Canvas & Surfaces', 4.6, 'in_stock', 'Rigid art boards with textured surfaces. Perfect for combining charcoal, gouache, pastels, and collages.', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400&f=1'),
          ('Wooden Painting Panel (Pack of 3)', 27.50, 'Canvas & Surfaces', 4.7, 'in_stock', 'Smooth birch wood panels. Exceptional stability for detailed fine-line work, pouring paints, and encaustic medium.', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400&p=3'),
          ('Hardbound Mixed Media Sketchbook', 18.90, 'Stationery', 4.6, 'in_stock', '200gsm acid-free cream paper with hardbound linen cover, perfect for sketching, ink washes, and light watercolours.', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=400'),
          ('Professional Drawing Pencil Set', 14.00, 'Stationery', 4.8, 'in_stock', '12 high-grade graphite pencils (from 6B to 4H). Perfect for fine sketching, realistic shading, and technical drafting.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&s=1'),
          ('Dual Tip Brush Marker Pens', 39.90, 'Stationery', 4.7, 'in_stock', '36 vibrant colors with flexible nylon brush tips on one end and fine bullet tips on the other. Water-based blendable ink.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&m=1'),
          ('Premium Sketching Charcoal Kit', 12.50, 'Stationery', 4.5, 'in_stock', 'Assortment of vine and compressed charcoal sticks, blending stumps, and kneaded erasers for expressive sketching.', 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=400&c=1'),
          ('Refillable Fountain Pen Set', 34.90, 'Stationery', 4.6, 'in_stock', 'Elegant fountain pen with fine, medium iridium nibs and multi-colour ink cartridges in a handcrafted wooden gift case.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&f=1'),
          ('Watercolour Painting Starter Kit', 45.00, 'Creative Kits', 4.8, 'in_stock', 'Complete watercolour painting starter kit. Includes 12 essential half-pans, watercolor paper pad, and 3 travel brushes.', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400'),
          ('Macrame Craft Hanging Kit', 25.00, 'Creative Kits', 4.4, 'in_stock', 'Includes 100m of premium cotton cord, wooden rings, beads, and step-by-step instruction booklet for beautiful wall art.', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400&m=1'),
          ('DIY Pottery & Clay Sculpting Kit', 42.00, 'Creative Kits', 4.7, 'in_stock', 'Air-dry clay, dynamic sculpting wire loops, loop scrapers, ribs, and step-by-step instructions. Ideal for hand-building.', 'https://images.unsplash.com/photo-1565192647048-f997ed87f5e2?q=80&w=400'),
          ('Modern Calligraphy Practice Kit', 29.90, 'Creative Kits', 4.6, 'in_stock', 'Includes oblique pen holder, Nikko G metal nibs, black calligraphic ink, and trace-ruled practice booklet.', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=400'),
          ('Linocut Block Printing Starter Kit', 38.00, 'Creative Kits', 4.8, 'in_stock', 'Equipped with linoleum cutters, rollers, block printing ink, and reusable linoleum pads for printing stamps and cards.', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400&l=1'),
          ('Adjustable Wooden Studio Easel', 95.00, 'Art Supplies', 4.8, 'in_stock', 'Solid beechwood H-frame studio easel. Tilts completely flat for watercolours and stands up to 90 inches high.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&e=1'),
          ('Studio Storage Cart & Organizer', 68.00, 'Art Supplies', 4.7, 'in_stock', 'Three-tier rolling cart with steel mesh baskets. Perfect for storing paints, mediums, brushes, and sketchbooks.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&o=1'),
          ('Portable Desktop Easel Box', 45.00, 'Art Supplies', 4.6, 'in_stock', 'Compact tabletop sketchbox easel. Built-in storage drawer with divided compartments for on-the-go sketching.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&p=1'),
          ('Glass Paint Mixing Palette', 16.00, 'Art Supplies', 4.7, 'in_stock', 'Tempered glass palette with smooth, easy-to-clean surface. Fits perfectly on tabletops or inside sketching boxes.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&g=1'),
          ('Brush Washer and Cleaner Tub', 12.00, 'Art Supplies', 4.5, 'in_stock', 'Stainless steel airtight container with removable spiral holder and interior cleaning screen. Keeps solvent clean.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&w=1');
        `);
        console.log("Database seeded successfully with all 32 products");
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
