CREATE SCHEMA `bookkit_dev` ;
-- Inventory Item Table
CREATE TABLE `bookkit_dev`.`inventoryitem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` CHAR(255) NULL,
  `description` CHAR(255) NULL,
  `cost` DECIMAL NULL,
  `code` CHAR(255) NULL,
  `quantityInStock` INT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));

-- Order Table
CREATE TABLE `bookkit_dev`.`order` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `inventoryItemCode` CHAR(255) NULL,
  `quantityOrdered` INT NULL,
  `customerID` CHAR(255) NULL,
  `transactionID` CHAR(255) NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  `updatedAt` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));