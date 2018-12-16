CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45)  NOT NULL,
  department_name VARCHAR (45) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT(11) NULL,
  PRIMARY KEY (item_id)
);

SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iphone","electronics", 1500.50, 500);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Samsung Galaxy","phones", 900.50, 400), ("macbook", "computers", 2000.99, 200), ("dell", "computers", 700, 350), ("surface", "tablets", 300.99, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("ipad", "tablets", 300, 1000), ("lightning cable", "accessories", 7.99, 1000),  ("micro-usb cable", "accessories", 5, 1000), ("tv", "entertainment", 400, 300);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("speakers", "entertainment", 100.99, 300);

UPDATE products
SET product_name="samsung galaxy"
WHERE item_id=2;
