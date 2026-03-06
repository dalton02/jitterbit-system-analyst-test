CREATE TABLE item (
    orderId SERIAL NOT NULL,
    productId SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY (orderId) REFERENCES "order"(orderId) ON DELETE CASCADE
);
