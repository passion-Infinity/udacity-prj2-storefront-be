CREATE TABLE products (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(250) NOT NULL,
  category          VARCHAR(500) NULL,
  price DECIMAL     NOT NULL
);