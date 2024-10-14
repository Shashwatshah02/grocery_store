-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 14, 2024 at 10:19 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `grocery`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `categoryId` int(11) NOT NULL,
  `categoryName` varchar(55) DEFAULT NULL,
  `categoryImage` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`categoryId`, `categoryName`, `categoryImage`) VALUES
(2, 'Frutits', 'uploads\\category\\categoryImage-1728643065639.png'),
(3, 'Frutits', 'uploads\\category\\categoryImage-1728643139169.png'),
(4, 'Vegetables', 'uploads\\category\\categoryImage-1728796482566.jpg'),
(5, 'Essentials', 'uploads\\category\\categoryImage-1728796518846.jpg'),
(6, 'Oil', 'uploads\\category\\categoryImage-1728796538922.jpg'),
(7, 'Featured Products', './uploads/category/feature.png');

-- --------------------------------------------------------

--
-- Table structure for table `customer_details`
--

CREATE TABLE `customer_details` (
  `customerId` int(11) NOT NULL,
  `customerName` varchar(45) DEFAULT NULL,
  `customerEmail` varchar(45) DEFAULT NULL,
  `customerPhone` bigint(20) DEFAULT NULL,
  `customerProfilePicture` varchar(255) NOT NULL,
  `customerAddress` varchar(255) NOT NULL,
  `customerZipCode` int(11) NOT NULL,
  `customerCity` varchar(45) NOT NULL,
  `customerCountry` varchar(45) NOT NULL,
  `customerPassword` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_details`
--

INSERT INTO `customer_details` (`customerId`, `customerName`, `customerEmail`, `customerPhone`, `customerProfilePicture`, `customerAddress`, `customerZipCode`, `customerCity`, `customerCountry`, `customerPassword`) VALUES
(1, 'SHashwt', 'sns@1243.com', 9280423840, 'uploads\\customerProfilePicture-1728638245934.png', 'erjlkeefklwafm', 400004, 'Mumbai', 'India', '1234'),
(4, 'admin', 'admin@hexagn.com', 9820113423, '', '', 0, '', '', '$2b$10$VS8ji4P0/iJ2ocznWBKije/aj662P2TBkl/Mbz'),
(5, 'admin', 'san@hexagn.com', 9820113423, '', '', 0, '', '', '$2b$10$23nioAX1NkmR.fXfW0CM8.ZGfx4inKb/SqCOI4'),
(6, 'admin', 'san2@hexagn.com', 9820113423, '', '', 0, '', '', '$2b$10$IjpksNzerYLDuZarr6mZVOLDmYUvuDNRdfk5oVny3V.Wzh6g3NJtG'),
(7, 'Sns', 'sns@123.com', 3485304533, '', '', 0, '', '', '$2b$10$pldQkTU.VyvaXclG4fyyYe1R8fiibqvYRI24G96in/BtZKj95hnC.'),
(8, 'Vinayak', 'sans@gmail.com', 32472846124, '', '', 0, '', '', '$2b$10$arYpe74x97Pyg0Vnh3heVOQMzzecXvSth.U.Ll45X3rJ83O9PsToG');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `customerId` int(11) DEFAULT NULL,
  `productId` int(11) DEFAULT NULL,
  `orderDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `orderStatus` varchar(45) DEFAULT NULL,
  `totalPrice` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`orderId`, `customerId`, `productId`, `orderDate`, `orderStatus`, `totalPrice`) VALUES
(1, 4, 2, '2024-10-13 09:45:45', 'pending', 2000.00);

-- --------------------------------------------------------

--
-- Table structure for table `product_details`
--

CREATE TABLE `product_details` (
  `productId` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `categoryId` int(11) DEFAULT NULL,
  `stockAtPresent` int(11) DEFAULT NULL,
  `unit` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_details`
--

INSERT INTO `product_details` (`productId`, `title`, `description`, `images`, `categoryId`, `stockAtPresent`, `unit`, `created_at`) VALUES
(1, 'apple', 'jkfamsd;lcvmasl;dfmvcad;fklnvl', '[\"uploads\\\\products\\\\images-1728800917554.png\"]', 2, 50, 'kg', '2024-10-13 04:51:28'),
(2, 'Lady Finger', 'fvsdfvdsfv', '[\"dummy1.jpg\"]', 4, 20, 'kg', '2024-10-13 05:19:11'),
(4, 'dumm', 'erfgserfgser', '[\"uploads\\\\products\\\\images-1728799915956.png\"]', 3, 50, 'kg', '2024-10-13 06:11:56'),
(5, 'dum1', 'dum111', '[\"./uploads/products/1.jpg\"]', 7, 100, 'kg', '2024-10-14 07:04:59'),
(6, 'dum2', 'dum2222', '[\"./uploads/products/2.jpg\"]', 7, 300, 'ltr', '2024-10-14 07:04:59'),
(7, 'dum3', 'dum333', '[\"./uploads/products/3.jpg\"]', 7, 10, 'kg', '2024-10-14 07:05:46'),
(8, 'dum4', 'dum4444', '[\"./uploads/products/4.jpg\"]', 7, 100, 'kg', '2024-10-14 07:05:46'),
(9, 'dum5', 'dum5555', '[\"./uploads/products/5.jpg\"]', 7, 50, 'kg', '2024-10-14 07:06:13');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'admin', 'admin@gmail.com', '1234'),
(2, 'Emay', 'emay@gmail.com', '123');

-- --------------------------------------------------------

--
-- Table structure for table `variations`
--

CREATE TABLE `variations` (
  `variationId` int(11) NOT NULL,
  `productId` int(11) DEFAULT NULL,
  `weightOption` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `variations`
--

INSERT INTO `variations` (`variationId`, `productId`, `weightOption`, `price`) VALUES
(1, 1, '1', 200.00),
(2, 2, '1', 45.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`categoryId`);

--
-- Indexes for table `customer_details`
--
ALTER TABLE `customer_details`
  ADD PRIMARY KEY (`customerId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `productId` (`productId`),
  ADD KEY `orders_ibfk_1` (`customerId`);

--
-- Indexes for table `product_details`
--
ALTER TABLE `product_details`
  ADD PRIMARY KEY (`productId`),
  ADD KEY `fk2` (`categoryId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `variations`
--
ALTER TABLE `variations`
  ADD PRIMARY KEY (`variationId`),
  ADD KEY `productId` (`productId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `categoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `customer_details`
--
ALTER TABLE `customer_details`
  MODIFY `customerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product_details`
--
ALTER TABLE `product_details`
  MODIFY `productId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `variations`
--
ALTER TABLE `variations`
  MODIFY `variationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `customer_details` (`customerId`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `product_details` (`productId`);

--
-- Constraints for table `product_details`
--
ALTER TABLE `product_details`
  ADD CONSTRAINT `fk2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`categoryId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `variations`
--
ALTER TABLE `variations`
  ADD CONSTRAINT `variations_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `product_details` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
