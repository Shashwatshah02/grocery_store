CREATE TABLE `product_details` (
  `productId` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255),
  `description` TEXT,
  `price` DECIMAL(10,2),
  `images` JSON,
  `categoryId` INT,
  `stockAtPresent` INT,
  `created_at` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `variations` (
  `variationId` INT PRIMARY KEY AUTO_INCREMENT,
  `productId` INT,
  `weightOption` VARCHAR(50),
  `price` DECIMAL(10,2)
);

CREATE TABLE `orders` (
  `orderId` INT PRIMARY KEY AUTO_INCREMENT,
  `customerId` INT,
  `orderDate` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  `orderStatus` ENUM(pending,shipped,delivered,canceled),
  `totalPrice` DECIMAL(10,2)
);

ALTER TABLE `product_details` ADD FOREIGN KEY (`categoryId`) REFERENCES `categories` (`categoryId`);

ALTER TABLE `variations` ADD FOREIGN KEY (`productId`) REFERENCES `product_details` (`productId`);

ALTER TABLE `orders` ADD FOREIGN KEY (`customerId`) REFERENCES `customer_details` (`customerId`);
