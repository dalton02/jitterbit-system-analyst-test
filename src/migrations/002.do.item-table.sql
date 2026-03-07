CREATE TABLE item (
    orderId VARCHAR(50) NOT NULL,
    productId VARCHAR(50) PRIMARY KEY,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY (orderId) REFERENCES "order"(orderId) ON DELETE CASCADE
);
