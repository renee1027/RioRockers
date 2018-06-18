-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 18, 2018 at 11:45 PM
-- Server version: 10.1.32-MariaDB
-- PHP Version: 7.2.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `truqr`
--

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `lat` float(10,6) NOT NULL,
  `lng` float(10,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `address`, `createdAt`, `updatedAt`, `lat`, `lng`) VALUES
(1, 'edeka theresie', 'Theresienhöhe 12, 80339 München', '2018-06-12 21:51:45', '2018-06-12 21:51:45', 48.133579, 11.542819),
(2, 'Pasing Arcaden', 'Pasinger Bahnhofspl. 5, 81241 München', '2018-06-18 18:48:57', '2018-06-18 18:48:57', 48.148300, 11.461665),
(3, 'Mona München', 'Pelkovenstraße 143-147, 80992 München', '2018-06-18 20:40:38', '2018-06-18 20:40:38', 48.182438, 11.530620),
(4, 'Mira', 'Schleissheimer Str. 506, 80933 München', '2018-06-18 21:46:38', '2018-06-18 21:46:38', 48.190109, 11.547252);

-- --------------------------------------------------------

--
-- Table structure for table `ramps`
--

CREATE TABLE `ramps` (
  `id` int(11) NOT NULL,
  `occupiedSince` datetime DEFAULT NULL,
  `timesBooked` int(11) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `rampNumber` int(11) NOT NULL DEFAULT '1',
  `locationId` int(11) DEFAULT NULL,
  `lat` float(10,6) NOT NULL,
  `lng` float(10,6) NOT NULL,
  `totalHoursBooked` float(10,4) DEFAULT '0.0000'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ramps`
--

INSERT INTO `ramps` (`id`, `occupiedSince`, `timesBooked`, `createdAt`, `updatedAt`, `rampNumber`, `locationId`, `lat`, `lng`, `totalHoursBooked`) VALUES
(1, NULL, 0, '2018-06-12 22:06:13', '2018-06-18 19:29:27', 1, 1, 48.133579, 11.542819, 0.0000),
(2, NULL, 0, '2018-06-18 18:42:46', '2018-06-18 18:42:46', 2, 1, 48.133579, 11.542819, 0.0000),
(3, NULL, 0, '2018-06-18 20:41:53', '2018-06-18 19:05:53', 1, 3, 48.182697, 11.531464, 0.0000),
(5, NULL, 0, '2018-06-18 21:43:45', '2018-06-18 21:43:45', 1, 2, 48.148300, 11.461665, 0.0000),
(6, NULL, 0, '2018-06-18 21:46:56', '2018-06-18 21:46:56', 1, 4, 48.190109, 11.547252, 0.0000);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ramps`
--
ALTER TABLE `ramps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Ramps_locationId_foreign_idx` (`locationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `ramps`
--
ALTER TABLE `ramps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ramps`
--
ALTER TABLE `ramps`
  ADD CONSTRAINT `Ramps_locationId_foreign_idx` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
