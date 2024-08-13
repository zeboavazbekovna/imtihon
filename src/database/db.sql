CREATE TABLE category(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  category_id INT,

  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price INT,
  rating INT NOT NULL,
  category_id INTEGER,
  count INT,
  image_url VARCHAR,

  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  image_url VARCHAR(255),

  UNIQUE(email, phone_number)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  customer_id INTEGER NOT NULL,
  order_status VARCHAR(255) NOT NULL,

  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  price INT NOT NULL,

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE payments(
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  order_id INT,
  customer_id INT,
  total_price INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
)

CREATE TABLE contract (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    customer_id INT NOT NULL,
    contract_date DATE NOT NULL,
    monthly_payment BIGINT NOT NULL,
    contract_type_id INT NOT NULL,
    contract_status VARCHAR(20) NOT NULL CHECK (contract_status IN ('paid', 'canceled', 'pending')),
    starting_payment_perc BIGINT NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (contract_type_id) REFERENCES contract_type(id) ON DELETE CASCADE
);
CREATE OR REPLACE FUNCTION percentageOfProduct(price NUMERIC, percentage NUMERIC)
RETURNS NUMERIC 
LANGUAGE plpgsql 
AS $$
BEGIN
    RETURN (price * percentage / 100);
END;
$$;

SELECT percentageOfProduct(1000, 25) AS result;

CREATE OR REPLACE FUNCTION updatePrice()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET price = price - (price * NEW.percentage / 100)
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_product_price_trigger
AFTER INSERT OR UPDATE ON contracts
FOR EACH ROW
EXECUTE FUNCTION updatePrice();

CREATE OR REPLACE VIEW overdue_payments AS
SELECT 
    c.name AS customer_name, 
    p.name AS product_name, 
    cn.id AS contract_id, 
    (cn.monthly_payment * (1 + ct.percentage / 100)) AS amount,
    (current_date - cn.contract_date - ct.duration) AS days_over
FROM contract cn
JOIN customers c ON c.id = cn.customer_id
JOIN contract_type ct ON ct.id = cn.contract_type_id
JOIN orders o ON o.id = cn.order_id
JOIN order_items oi ON oi.order_id = o.id
JOIN products p ON p.id = oi.product_id
WHERE current_date > cn.contract_date + ct.duration;


-- Categories
INSERT INTO category (name, image_url, category_id) VALUES 
('Product1', 'https://example.com/images/electronics.jpg', NULL),
('Product2', 'https://example.com/images/laptops.jpg', 1),
('Product3', 'https://example.com/images/smartphones.jpg', 1),
('Product4', 'https://example.com/images/home_appliances.jpg', NULL),
('Product5', 'https://example.com/images/kitchen.jpg', 4),
('Product6', 'https://example.com/images/fashion.jpg', NULL),
('Product7', 'https://example.com/images/mens_fashion.jpg', 6);

-- Products
INSERT INTO products (title, description, price, rating, category_id, count, image_url) VALUES
('iPhone 13', 'Latest model with 128GB storage', 799, 5, 3, 50, 'https://example.com/images/iphone13.jpg'),
('Galaxy S21', 'Flagship smartphone with 256GB storage', 699, 4, 3, 30, 'https://example.com/images/galaxys21.jpg'),
('A7 III Camera', 'Full-frame mirrorless camera', 1999, 5, 4, 15, 'https://example.com/images/sonya7.jpg'),
('XPS 13 Laptop', 'Ultrabook with Intel i7 processor', 999, 4, 1, 25, 'https://example.com/images/dellxps13.jpg'),
('Fridge', 'Double door fridge with energy-saving features', 1200, 4, 5, 10, 'https://example.com/images/whirlpool_fridge.jpg'),
('Running Shoes', 'Comfortable running shoes', 150, 5, 6, 100, 'https://example.com/images/nike_air_max.jpg'),
('Sports Shoes', 'High-performance running shoes', 180, 4, 7, 70, 'https://example.com/images/adidas_ultraboost.jpg'),
('OLED TV', '55-inch 4K Ultra HD Smart TV', 1300, 5, 1, 20, 'https://example.com/images/lgoledtv.jpg');

-- Customers
INSERT INTO customers (full_name, email, phone_number, password, image_url) VALUES
('Customer1', 'customer1@example.com', '+1234567890', 'password123', 'https://example.com/images/customer1.jpg'),
('Customer2', 'customer2@example.com', '+0987654321', 'password123', 'https://example.com/images/customer2.jpg'),
('Customer3', 'customer3@example.com', '+1122334455', 'password123', 'https://example.com/images/customer3.jpg'),
('Customer4', 'customer4@example.com', '+2233445566', 'password123', 'https://example.com/images/customer4.jpg'),
('Customer5', 'customer5@example.com', '+3344556677', 'password123', 'https://example.com/images/customer5.jpg');



INSERT INTO orders (created_at, customer_id, order_status) VALUES
('2024-08-13 09:15:23', 1, 'Pending'),
('2024-08-12 14:22:47', 2, 'Shipped'),
('2024-08-11 08:03:15', 3, 'Delivered'),
('2024-08-10 17:34:20', 4, 'Pending'),
('2024-08-09 13:21:08', 5, 'Cancelled');



INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 799),
(1, 2, 1, 699),
(2, 3, 1, 1999),
(3, 4, 1, 999),
(4, 5, 1, 1200);


INSERT INTO payments (created_at, order_id, customer_id, total_price) VALUES
('2024-08-13 10:15:00', 1, 1, 799),
('2024-08-12 15:20:00', 2, 2, 699),
('2024-08-11 09:10:00', 3, 3, 1999),
('2024-08-10 18:30:00', 4, 4, 999),
('2024-08-09 14:45:00', 5, 5, 1200);

