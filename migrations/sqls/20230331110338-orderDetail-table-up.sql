CREATE TABLE orderDetails (
  id                    SERIAL PRIMARY KEY,
  order_id              INTEGER NOT NULL REFERENCES orders (id),
  product_id            INTEGER NOT NULL REFERENCES products (id),
  quantity              INTEGER NOT NULL,
  price                 DECIMAL NOT NULL
);