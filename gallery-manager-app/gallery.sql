-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 09, 2025 at 12:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gallery`
--

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `imageId` int(25) NOT NULL,
  `imagePath` varchar(50) NOT NULL,
  `userId` int(30) NOT NULL,
  `userName` varchar(40) NOT NULL,
  `userNumber` varchar(30) NOT NULL,
  `photographerName` varchar(40) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`imageId`, `imagePath`, `userId`, `userName`, `userNumber`, `photographerName`, `description`) VALUES
(2, '*\nGPD[|\\IPTF[}PAF', 672006278, 'سید حامد مجیدی', '9328493248', '', ''),
(4, '*\nGPD[|R@_VAP|SNF', 672006277, 'محمدرضا سلیمی', '09348237', '', ''),
(5, '*\nGPD[|R@_VGXyRAF', 672006277, 'محمدرضا سلیمی', '09348237', '', ''),
(6, '*\nGPD[|R@_VGQrUAF', 672006277, 'محمدرضا سلیمی', '09348237', '', ''),
(7, '*\nGPD[|R@_VE\\TNF', 672006277, 'محمدرضا سلیمی', '09348237', '', ''),
(8, '*\nGPD[|R@_VD]{UOF', 672006277, 'محمدرضا سلیمی', '09348237', '', ''),
(9, '*\nGPD[|R@_VK^yUOF', 672006277, 'محمدرضا سلیمی', '09348237', '', ''),
(10, '*\nGPD[|R@_VJ]{QAF', 672006277, 'محمدرضا سلیمی', '09348237', '', ''),
(11, '*\nGPD[|R@_YC^|\\IF', 672006277, 'محمدرضا سلیمی', '09348237', '', ''),
(12, '*\nGPD[|R@_YAXxWKF', 672006277, 'محمدرضا سلیمی', '09348237', '', ''),
(13, '*\nGPD[|]@XQG\\zQAF', 672006292, 'فرشاد دهلوی', '09783244234', 'نصراله', 'بدون توضیح'),
(14, '*\nGPD[|]@XQDX|]JF', 672006277, 'محمدرضا سلیمی', '09348237', '', ''),
(15, '*\nGPD[|]@XQKZrQNF', 672006281, 'علی خانی', '0917263576', '', ''),
(16, '*\nGPD[rUAYQBZUNF', 672006277, 'محمدرضا سلیمی', '09348237', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(40) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `userNumber` varchar(255) NOT NULL,
  `userEmail` varchar(255) DEFAULT NULL,
  `userPassword` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `userName`, `userNumber`, `userEmail`, `userPassword`, `isAdmin`) VALUES
(3423901, 'نصراله', '09175236723', NULL, '$2a$10$9p02iiiymW/LnJ7o.9Ppiu8a1YERa7Vh6CbX/.bZJ5nEaX5MYnn92', 1),
(672006277, 'محمدرضا سلیمی', '09348237', NULL, '$2a$10$eXW/dRmvKcgMp6iE5s7X0./CCoBulWEzGNXxPl77V8ZHJuItrjSv.', 0),
(672006278, 'سید حامد مجیدی', '9328493248', NULL, '$2a$10$bQz9EldotzbUVWU5n.M1r.Kf2nwKHxBIQObU61D6.uzuFXPzaRueW', 0),
(672006279, 'آرش اکبری', '09738264873', 'arash@gmail.com', '$2a$10$39lgCVcD3h9/dMzef9VOc.Wp5lp14nim.DNBXgXDoDrA20nChN0Za', 0),
(672006280, 'محمدطاها جعفری', '09289132', NULL, '$2a$10$egq0q8Q2fa7I8cZT8tltFOnBYNU2wh3BZxr/TD7BaYPdvKdxV2iVK', 0),
(672006281, 'علی خانی', '0917263576', NULL, '$2a$10$AXD42Hv.kgm/7CIjs.rp8.nWIh9Nrz6W9IgSp4c1Las8QsmK6ej4.', 0),
(672006282, 'محمدامین خراسانی', '0982374932', NULL, '$2a$10$MmKp0Ujl.cEF8jvQfAP6XOb58sSh7BRPvlT3td671bzfNe1Fh4uim', 0),
(672006283, 'خالد صفری', '092378432', NULL, '$2a$10$F6B7SUaa8WI0qfYH3ZiMhOQZQAzXDI6OAMLsJpE2UQLo1/96dPtUi', 0),
(672006284, 'جعفر صالحی', '09782136721', NULL, '$2a$10$aUNZvxTCVVHgFGznt2T1mO6af.BQp/P4CLJRI4xZaxrFZ63/pBhOS', 0),
(672006285, 'مسلم جعفری', '0972178361', NULL, '$2a$10$8sDUOAwneE3EkWjyqkIK8.b9CtrtAhlYUQX.L42IWV5ZsIpsjfJ3C', 0),
(672006286, 'احمد مصطفوی', '09762361', NULL, '$2a$10$qcxtiBaG0VJqDIjzHoGG5uhyuIm8A39YCSdfPptHVVaJMUxG/L7g6', 0),
(672006287, 'طاهره صدیقی', '092761376', NULL, '$2a$10$/r.YmS20pGVwBRzZuQiOaO5kaq4RvI9ETHuFYfwYD9yHZ3WL2DGR2', 0),
(672006288, 'مریم خواجوی', '09655465', NULL, '$2a$10$mtIf6hP8JT2QdhQm6CZTo.w2x1JGma0R3FvIM2/bvH0BR5g28lHkW', 0),
(672006289, 'رضوان قربانی', '0917632872', NULL, '$2a$10$gW1KvzWaX9yXyse3BkV7Pu0aElBtwNh45EdoPOWmYnJ1A7WbPi8Ly', 0),
(672006290, 'اکبر یوسفی', '097832432', 'akbar@gmail.com', '$2a$10$GU3.gIr4g0z9ioXMC3qbeOpBiptMuV2XVzRsWvqv3Z4EZ6mzm8K3G', 0),
(672006291, 'ثنا جاودان', '097836423', NULL, '$2a$10$NlVEGF/irVnctVSyUzxI3Ornn8JNHud8XliBtSP2f6ciuY5cHUxyW', 0),
(672006292, 'فرشاد دهلوی', '09783244234', NULL, '$2a$10$Mu9q.078o1vWMXg1Chsx.O69z47X.pK/rioKGivG0TYfOuNKvexh.', 0),
(672006293, 'رضا تقوی', '097837243', 'Reza@gmail.com', '$2a$10$hGFKDZ6zjU2Z6oGCp8EDbORbjb5QPXVSu0nroeEUWc90Iqczep7Ai', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`imageId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `user-name` (`userName`),
  ADD UNIQUE KEY `user-number` (`userNumber`),
  ADD UNIQUE KEY `Id` (`userId`),
  ADD UNIQUE KEY `userEmail` (`userEmail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `imageId` int(25) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(40) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=672006295;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
