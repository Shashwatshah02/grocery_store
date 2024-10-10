-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 10, 2024 at 05:37 AM
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
(1, 'Shashwat', 'shashwatshah02@gmail.com', 9820077642, '', '', 0, '', '', '1234'),
(2, 'Sns', 'sns@123.com', 3485304533, '', '', 0, '', '', '$2b$10$nJIu5jQF.WvZJqjhe/l6q.QC78uNLVWS9krcPl'),
(3, 'admin', 'admin@hexagn.com', 9820113423, '', '', 0, '', '', '$2b$10$PGqC9/4rRARtLGY6jXTkMOMGGJ7lpnxTYEfORx'),
(4, 'admin', 'admin@hexagn.com', 9820113423, '', '', 0, '', '', '$2b$10$VS8ji4P0/iJ2ocznWBKije/aj662P2TBkl/Mbz'),
(5, 'admin', 'san@hexagn.com', 9820113423, '', '', 0, '', '', '$2b$10$23nioAX1NkmR.fXfW0CM8.ZGfx4inKb/SqCOI4'),
(6, 'admin', 'san2@hexagn.com', 9820113423, '', '', 0, '', '', '$2b$10$IjpksNzerYLDuZarr6mZVOLDmYUvuDNRdfk5oVny3V.Wzh6g3NJtG');

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `categoryId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_details`
--
ALTER TABLE `customer_details`
  MODIFY `customerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
