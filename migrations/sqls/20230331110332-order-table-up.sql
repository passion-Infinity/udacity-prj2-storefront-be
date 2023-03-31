CREATE TABLE orders (
  id                SERIAL PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users (id),
  total             DECIMAL NOT NULL,
  status            VARCHAR(10) NOT NULL
);