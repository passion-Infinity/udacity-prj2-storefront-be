CREATE TABLE users (
  id                SERIAL PRIMARY KEY,
  username          VARCHAR(250) NOT NULL,
  firstname         VARCHAR(250) NOT NULL,
  lastname          VARCHAR(250) NOT NULL,
  password_hash     VARCHAR(250) NOT NULL
);
DROP TABLE users;



CREATE TABLE products (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(250) NOT NULL,
  category       VARCHAR(500) NULL,
  price DECIMAL     NOT NULL
);
DROP TABLE products;



CREATE TABLE orders (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users (id),
  total             DECIMAL NOT NULL,
  status            BOOLEAN NOT NULL
);
DROP TABLE orders;



CREATE TABLE orderDetails (
  id                    SERIAL PRIMARY KEY,
  order_id              INTEGER NOT NULL REFERENCES orders (id),
  product_id            INTEGER NOT NULL REFERENCES products (id),
  quantity              INTEGER NOT NULL,
  price                 DECIMAL NOT NULL
);
DROP TABLE orderDetails;