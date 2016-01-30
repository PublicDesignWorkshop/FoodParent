-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jan 30, 2016 at 02:19 AM
-- Server version: 10.1.9-MariaDB
-- PHP Version: 5.5.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `foodparent`
--

-- --------------------------------------------------------

--
-- Table structure for table `adopt`
--

CREATE TABLE `adopt` (
  `id` int(11) NOT NULL,
  `tree` int(11) NOT NULL,
  `parent` int(11) NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `adopt`
--

INSERT INTO `adopt` (`id`, `tree`, `parent`, `updated`) VALUES
(2, 6, 2, '2015-11-10 00:00:00'),
(3, 6, 1, '2015-11-09 00:00:00'),
(12, 25, 7, '2016-01-06 00:14:20'),
(13, 33, 3, '2016-01-06 00:14:24'),
(14, 23, 12, '2016-01-06 00:14:29'),
(15, 23, 1, '2016-01-06 00:14:32'),
(16, 18, 3, '2016-01-06 00:14:40'),
(18, 31, 7, '2016-01-06 00:14:48'),
(19, 27, 12, '2016-01-06 00:14:52'),
(20, 34, 2, '2016-01-06 00:14:59'),
(21, 25, 2, '2016-01-06 00:15:05'),
(23, 21, 2, '2016-01-06 00:15:15'),
(24, 24, 2, '2016-01-06 00:16:24'),
(25, 1, 3, '2016-01-06 00:40:25'),
(26, 23, 2, '2016-01-06 00:41:01'),
(27, 16, 7, '2016-01-06 00:42:19'),
(29, 17, 12, '2016-01-26 21:27:25'),
(32, 1, 1, '2016-01-29 18:22:19'),
(33, 1, 7, '2016-01-29 19:04:21');

-- --------------------------------------------------------

--
-- Table structure for table `attempt`
--

CREATE TABLE `attempt` (
  `id` int(11) NOT NULL,
  `time` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `auth`
--

CREATE TABLE `auth` (
  `id` int(11) NOT NULL,
  `name` varchar(150) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `auth`
--

INSERT INTO `auth` (`id`, `name`) VALUES
(0, 'Unkown'),
(1, 'ConcreteJungle'),
(2, 'Manager'),
(3, 'Participant'),
(4, 'Guest');

-- --------------------------------------------------------

--
-- Table structure for table `donation`
--

CREATE TABLE `donation` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `place` int(11) NOT NULL,
  `tree` varchar(150) NOT NULL,
  `quantity` float NOT NULL,
  `picture` varchar(500) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `donation`
--

INSERT INTO `donation` (`id`, `type`, `place`, `tree`, `quantity`, `picture`, `date`) VALUES
(22, 1, 1, '1,23,29', 35, 'FoodBank1_17.png,FoodBank1_18.png', '2015-09-15 00:00:00'),
(23, 3, 1, '18,20,27', 55, 'FoodBank1_19.png', '2015-11-10 00:00:00'),
(24, 4, 1, '24,33,34', 160, 'FoodBank1_20.png', '2016-01-19 00:00:00'),
(25, 1, 5, '23', 5, 'FoodBank2_0.png', '2015-11-16 00:00:00'),
(26, 4, 6, '16', 5, '', '2016-01-28 00:46:07'),
(27, 2, 7, '6', 6, 'FoodBank2_1.png', '2015-10-12 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `flag`
--

CREATE TABLE `flag` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `flag`
--

INSERT INTO `flag` (`id`, `name`) VALUES
(0, 'unknown'),
(1, 'dead'),
(2, 'cut down'),
(3, 'verfied'),
(4, 'hidden');

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE `food` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `icon` varchar(150) NOT NULL,
  `description` varchar(500) NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`id`, `name`, `icon`, `description`, `updated`) VALUES
(0, 'Unknown', 'marker-question.png', 'Unknown', '2016-01-03 00:00:00'),
(1, 'Blackberries', 'marker-blackberry.png', 'Blackberries Desc', '2015-10-10 15:25:26'),
(2, 'Pears', 'marker-pear.png', 'Pears Desc', '2015-10-10 15:25:26'),
(3, 'Mulberries', 'marker-mulberries.png', 'Mulberries Desc', '2015-10-10 15:25:54'),
(4, 'Crabapples', 'marker-crabapples.png', 'Crabapples Desc', '2015-10-10 15:25:54');

-- --------------------------------------------------------

--
-- Table structure for table `note`
--

CREATE TABLE `note` (
  `id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `tree` int(11) NOT NULL,
  `person` int(11) NOT NULL,
  `comment` text NOT NULL,
  `picture` varchar(500) NOT NULL,
  `rate` float NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `note`
--

INSERT INTO `note` (`id`, `type`, `tree`, `person`, `comment`, `picture`, `rate`, `date`) VALUES
(1, 1, 1, 0, 'It just starts growing. Still looks green.', 'blackberry1.jpg', 2, '2015-12-16 02:00:00'),
(2, 1, 1, 0, 'Still looks green.', 'blackberry2.jpg', 3, '2015-12-21 02:00:00'),
(3, 1, 1, 0, 'Still looks green.', 'blackberry3.jpg', 4, '2015-12-28 02:00:00'),
(4, 1, 1, 0, '123\nStill looks green.\n\naaa', 'blackberry4.jpg,Blackberries_1_2.jpg', 6, '2015-12-31 13:47:35'),
(5, 1, 1, 0, 'Size is growing.', 'blackberry5.jpg', 7, '2016-01-04 13:47:35'),
(6, 1, 1, 0, 'Color is changing.', 'blackberry6.jpg', 10, '2016-01-06 11:48:02'),
(8, 1, 1, 0, 'Fully grown.', 'blackberry7.jpg', 9, '2016-01-07 11:48:02'),
(141, 2, 1, 0, 'Flag is changed to ''verfied''', '', 0, '2015-10-27 03:19:07'),
(142, 2, 1, 0, 'Flag is changed to ''dead''', '', 0, '2015-10-27 03:19:11'),
(143, 2, 1, 0, 'Ownership is changed to ''private''', '', 0, '2015-10-27 03:24:42'),
(144, 2, 1, 0, 'Flag is changed to ''verfied''', '', 0, '2015-10-27 03:24:44'),
(145, 2, 1, 0, 'Ownership is changed to ''public''', '', 0, '2015-10-27 03:24:46'),
(146, 2, 1, 0, 'Ownership is changed to ''private''', '', 0, '2015-10-27 03:39:24'),
(147, 2, 1, 0, 'Ownership is changed to ''public''', '', 0, '2015-10-27 03:39:29'),
(148, 2, 1, 0, 'Flag is changed to ''cut down''', '', 0, '2015-11-16 07:29:28'),
(149, 2, 1, 0, 'Flag is changed to ''verfied''', '', 0, '2015-11-16 07:29:28'),
(150, 2, 1, 0, 'Flag is changed to ''cut down''', '', 0, '2015-11-16 07:29:31'),
(151, 2, 1, 0, 'Flag is changed to ''verfied''', '', 0, '2015-11-16 07:29:33'),
(152, 2, 1, 0, 'Flag is changed to ''cut down''', '', 0, '2015-11-16 07:29:35'),
(153, 2, 1, 0, 'Flag is changed to ''verfied''', '', 0, '2015-11-16 07:29:36'),
(154, 2, 1, 0, 'Ownership is changed to ''private''', '', 0, '2015-11-17 00:39:51'),
(155, 2, 1, 0, 'Ownership is changed to ''public''', '', 0, '2015-11-17 00:39:52'),
(156, 2, 6, 0, 'Flag is changed to ''cut down''', '', 0, '2015-11-17 01:44:59'),
(157, 2, 6, 0, 'Flag is changed to ''dead''', '', 0, '2015-11-17 01:44:59'),
(158, 2, 1, 0, 'Flag is changed to ''dead''', '', 0, '2015-11-17 01:50:11'),
(159, 2, 1, 0, 'Flag is changed to ''verfied''', '', 0, '2015-11-17 01:50:14'),
(160, 2, 7, 0, 'Ownership is changed to ''private''', '', 0, '2015-11-17 07:15:14'),
(161, 2, 7, 0, 'Flag is changed to ''verfied''', '', 0, '2015-11-17 12:21:32'),
(162, 2, 6, 0, 'Status has changed to ''dead''', '', -1, '2016-01-02 13:06:56'),
(163, 2, 6, 0, 'Status has changed to ''verfied''', '', -1, '2016-01-02 13:19:01'),
(170, 2, 6, 0, 'Status has changed to ''dead''', '', -1, '2016-01-02 13:32:48'),
(173, 2, 6, 0, 'Location has changed to ''@ 33.7900, -84.3721''', '', -1, '2016-01-02 13:37:22'),
(174, 2, 6, 0, 'Location has changed from ''@ 33.7900, -84.3721'' to ''@ 33.7913, -84.3714''', '', -1, '2016-01-02 13:39:31'),
(175, 2, 6, 0, 'Status has changed from ''dead''to ''cut down''', '', -1, '2016-01-02 13:46:33'),
(176, 2, 6, 0, 'Status has changed from ''cut down''to ''verfied''', '', -1, '2016-01-02 13:46:35'),
(180, 2, 1, 0, 'Ownership has changed from ''dead''to ''cut down''', '', -1, '2016-01-02 13:54:33'),
(181, 2, 6, 0, 'Ownership has changed from ''private''to ''public''', '', -1, '2016-01-02 13:55:03'),
(183, 2, 1, 0, 'Ownership has changed from ''private''to ''public''', '', -1, '2016-01-02 13:55:22'),
(184, 2, 1, 0, 'Status has changed from ''verfied''to ''cut down''', '', -1, '2016-01-02 13:55:24'),
(185, 2, 1, 0, 'Status has changed from ''cut down''to ''verfied''', '', -1, '2016-01-02 13:55:26'),
(186, 2, 1, 0, 'Ownership has changed from ''public''to ''private''', '', -1, '2016-01-02 13:55:28'),
(187, 2, 1, 0, 'Ownership has changed from ''private''to ''public''', '', -1, '2016-01-02 13:55:35'),
(188, 2, 6, 0, 'Location has changed from ''@ 33.7913, -84.3714'' to ''@ 33.7897, -84.3711''', '', -1, '2016-01-02 13:57:03'),
(189, 2, 6, 0, 'Status has changed from ''verfied''to ''cut down''', '', -1, '2016-01-02 13:57:07'),
(190, 2, 6, 0, 'Ownership has changed from ''public''to ''private''', '', -1, '2016-01-02 13:57:08'),
(192, 2, 6, 0, 'Status has changed from ''verfied''to ''cut down''', '', -1, '2016-01-02 13:58:33'),
(193, 2, 6, 0, 'Status has changed from ''cut down''to ''verfied''', '', -1, '2016-01-02 13:58:36'),
(195, 2, 6, 0, 'Status has changed from ''verfied''to ''cut down''', '', -1, '2016-01-02 13:58:42'),
(196, 2, 6, 0, 'Status has changed from ''cut down''to ''verfied''', '', -1, '2016-01-02 13:58:43'),
(197, 2, 1, 0, 'Ownership has changed from ''public''to ''private''', '', -1, '2016-01-02 19:06:11'),
(198, 2, 1, 0, 'Ownership has changed from ''private''to ''public''', '', -1, '2016-01-02 19:07:57'),
(199, 2, 1, 0, 'Ownership has changed from ''public''to ''private''', '', -1, '2016-01-02 19:10:47'),
(202, 2, 7, 0, 'Ownership has changed from ''private''to ''public''', '', -1, '2016-01-02 19:11:06'),
(203, 2, 7, 0, 'Status has changed from ''verfied''to ''cut down''', '', -1, '2016-01-02 19:11:07'),
(206, 2, 6, 0, 'Location has changed from ''@ 33.7897, -84.3710'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 19:15:08'),
(207, 2, 1, 0, 'Ownership has changed from ''private''to ''public''', '', -1, '2016-01-02 19:20:25'),
(208, 2, 1, 0, 'Ownership has changed from ''public''to ''private''', '', -1, '2016-01-02 19:20:27'),
(212, 2, 1, 0, 'Status has changed from ''verfied''to ''dead''', '', -1, '2016-01-02 19:21:01'),
(214, 2, 7, 0, 'Location has changed from ''@ 33.7555, -84.4286'' to ''@ 33.7576, -84.4253''', '', -1, '2016-01-02 19:30:42'),
(217, 2, 7, 0, 'Ownership has changed from ''public''to ''private''', '', -1, '2016-01-02 19:31:08'),
(218, 2, 7, 0, 'Ownership has changed from ''private''to ''public''', '', -1, '2016-01-02 19:31:09'),
(219, 2, 7, 0, 'Status has changed from ''cut down''to ''hidden''', '', -1, '2016-01-02 19:31:10'),
(220, 2, 7, 0, 'Status has changed from ''hidden''to ''verfied''', '', -1, '2016-01-02 19:31:11'),
(221, 2, 7, 0, 'Location has changed from ''@ 33.7576, -84.4253'' to ''@ 33.7586, -84.4251''', '', -1, '2016-01-02 19:31:46'),
(222, 2, 7, 0, 'Location has changed from ''@ 33.7586, -84.4251'' to ''@ 33.7724, -84.3946''', '', -1, '2016-01-02 19:31:52'),
(223, 2, 7, 0, 'Location has changed from ''@ 33.7724, -84.3946'' to ''@ 33.7738, -84.3928''', '', -1, '2016-01-02 19:31:57'),
(224, 2, 7, 0, 'Location has changed from ''@ 33.7738, -84.3928'' to ''@ 33.7781, -84.4009''', '', -1, '2016-01-02 19:32:01'),
(225, 2, 7, 0, 'Ownership has changed from ''public''to ''private''', '', -1, '2016-01-02 19:37:36'),
(226, 2, 7, 0, 'Ownership has changed from ''private''to ''public''', '', -1, '2016-01-02 19:43:56'),
(227, 2, 7, 0, 'Ownership has changed from ''public''to ''private''', '', -1, '2016-01-02 19:43:58'),
(228, 2, 7, 0, 'Ownership has changed from ''public''to ''private''', '', -1, '2016-01-02 19:44:01'),
(229, 2, 7, 0, 'Ownership has changed from ''private''to ''public''', '', -1, '2016-01-02 19:44:02'),
(230, 2, 7, 0, 'Ownership has changed from ''public''to ''private''', '', -1, '2016-01-02 19:44:03'),
(231, 2, 7, 0, 'Ownership has changed from ''private''to ''public''', '', -1, '2016-01-02 19:44:04'),
(232, 2, 7, 0, 'Ownership has changed from ''public''to ''private''', '', -1, '2016-01-02 19:44:06'),
(233, 2, 7, 0, 'Ownership has changed from ''private''to ''public''', '', -1, '2016-01-02 19:44:06'),
(234, 2, 7, 0, 'Ownership has changed from ''public''to ''private''', '', -1, '2016-01-02 19:44:08'),
(235, 2, 7, 0, 'Ownership has changed from ''private''to ''public''', '', -1, '2016-01-02 19:44:08'),
(236, 2, 1, 0, 'Status has changed from ''dead''to ''cut down''', '', -1, '2016-01-02 19:44:31'),
(237, 2, 1, 0, 'Status has changed from ''cut down''to ''hidden''', '', -1, '2016-01-02 19:44:40'),
(238, 2, 6, 0, 'Ownership has changed from ''private''to ''public''', '', -1, '2016-01-02 19:48:11'),
(239, 2, 6, 0, 'Status has changed from ''verfied''to ''cut down''', '', -1, '2016-01-02 20:31:53'),
(240, 2, 6, 0, 'Status has changed from ''cut down''to ''verfied''', '', -1, '2016-01-02 20:31:54'),
(241, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7897, -84.3724''', '', -1, '2016-01-02 20:44:07'),
(242, 2, 6, 0, 'Location has changed from ''@ 33.7897, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:44:11'),
(244, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.8887, -84.3724''', '', -1, '2016-01-02 20:44:21'),
(245, 2, 6, 0, 'Location has changed from ''@ 33.8887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:44:57'),
(249, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:46:16'),
(250, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:46:17'),
(251, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:46:32'),
(252, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:46:35'),
(253, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:46:39'),
(254, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:46:47'),
(255, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:47:03'),
(256, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:47:10'),
(257, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:47:17'),
(258, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:47:21'),
(259, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:47:53'),
(260, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:47:55'),
(261, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:48:14'),
(263, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:49:54'),
(264, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:50:01'),
(265, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.5887, -84.3724''', '', -1, '2016-01-02 20:51:08'),
(266, 2, 6, 0, 'Location has changed from ''@ 33.5887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:51:20'),
(267, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.5887, -84.3724''', '', -1, '2016-01-02 20:52:59'),
(270, 2, 6, 0, 'Location has changed from ''@ 33.5887, -84.3724'' to ''@ 33.7887, -84.3724''', '', -1, '2016-01-02 20:55:44'),
(272, 2, 6, 0, 'Location has changed from ''@ 33.7887, -84.3724'' to ''@ 33.7863, -84.3754''', '', -1, '2016-01-02 20:55:56'),
(273, 2, 6, 0, 'Status has changed from ''verfied''to ''cut down''', '', -1, '2016-01-02 20:56:05'),
(274, 2, 7, 0, 'Location has changed from ''@ 33.7781, -84.4009'' to ''@ 33.7781, -84.4009''', '', -1, '2016-01-02 21:27:49'),
(275, 2, 7, 0, 'Location has changed from ''@ 33.7781, -84.4009'' to ''@ 33.7781, -84.4009''', '', -1, '2016-01-02 21:27:52'),
(276, 2, 6, 0, 'Location has changed from ''@ 33.7863, -84.3754'' to ''@ 33.7863, -84.3754''', '', -1, '2016-01-02 21:29:23'),
(277, 2, 6, 0, 'Location has changed from ''@ 33.7863, -84.3754'' to ''@ 33.7863, -84.3754''', '', -1, '2016-01-02 21:29:31'),
(278, 2, 6, 0, 'Location has changed from ''@ 33.7863, -84.3754'' to ''@ 33.7863, -84.3754''', '', -1, '2016-01-02 21:29:50'),
(279, 2, 6, 0, 'Location has changed from ''@ 33.7863, -84.3754'' to ''@ 33.7863, -84.3754''', '', -1, '2016-01-02 21:29:52'),
(280, 2, 6, 0, 'Status has changed from ''cut down''to ''dead''', '', -1, '2016-01-02 21:31:45'),
(281, 2, 6, 0, 'Location has changed from ''@ 33.7863, -84.3754'' to ''@ 33.7863, -84.3754''', '', -1, '2016-01-02 21:31:47'),
(282, 2, 6, 0, 'Location has changed from ''@ 33.7863, -84.3754'' to ''@ 33.7863, -84.3754''', '', -1, '2016-01-02 21:31:49'),
(283, 2, 6, 0, 'Location has changed from ''@ 33.7863, -84.3754'' to ''@ 33.7863, -84.3754''', '', -1, '2016-01-02 21:31:51'),
(284, 2, 6, 0, 'Ownership has changed from ''public''to ''private''', '', -1, '2016-01-02 21:32:23'),
(285, 2, 6, 0, 'Location has changed from ''@ 33.7863, -84.3754'' to ''@ 33.7875, -84.3756''', '', -1, '2016-01-02 21:32:42'),
(286, 2, 6, 0, 'Location has changed from ''@ 33.7875, -84.3756'' to ''@ 33.7877, -84.3757''', '', -1, '2016-01-02 21:32:45'),
(287, 2, 6, 0, 'Location has changed from ''@ 33.7877, -84.3757'' to ''@ 33.7877, -84.3755''', '', -1, '2016-01-02 21:32:47'),
(288, 2, 6, 0, 'Location has changed from ''@ 33.7877, -84.3755'' to ''@ 33.7877, -84.3755''', '', -1, '2016-01-02 21:32:48'),
(289, 2, 6, 0, 'Location has changed from ''@ 33.7877, -84.3755'' to ''@ 33.7870, -84.3773''', '', -1, '2016-01-02 21:32:50'),
(290, 2, 6, 0, 'Location has changed from ''@ 33.7870, -84.3773'' to ''@ 33.7876, -84.3782''', '', -1, '2016-01-02 21:32:52'),
(291, 2, 6, 0, 'Location has changed from ''@ 33.7876, -84.3782'' to ''@ 33.7878, -84.3777''', '', -1, '2016-01-02 21:32:53'),
(293, 2, 7, 0, 'Location has changed from ''@ 33.7781, -84.4009'' to ''@ 33.7819, -84.3983''', '', -1, '2016-01-02 21:33:22'),
(294, 2, 6, 0, 'Location has changed from ''@ 33.7878, -84.3777'' to ''@ 33.7848, -84.3773''', '', -1, '2016-01-02 21:33:24'),
(295, 2, 6, 0, 'Location has changed from ''@ 33.7848, -84.3773'' to ''@ 33.7903, -84.3941''', '', -1, '2016-01-02 21:33:42'),
(296, 2, 6, 0, 'Location has changed from ''@ 33.7903, -84.3941'' to ''@ 33.7828, -84.3756''', '', -1, '2016-01-02 21:33:44'),
(297, 2, 6, 0, 'Status has changed from ''dead''to ''cut down''', '', -1, '2016-01-02 21:33:55'),
(299, 2, 6, 0, 'Food type has changed from ''Pears''to ''Blackberries''', '', -1, '2016-01-03 03:39:10'),
(300, 2, 6, 0, 'Food type has changed from ''Blackberries''to ''Blackberries''', '', -1, '2016-01-03 03:39:18'),
(301, 2, 6, 0, 'Food type has changed from ''Blackberries''to ''Pears''', '', -1, '2016-01-03 03:39:54'),
(302, 2, 6, 0, 'Food type has changed from ''Pears''to ''Blackberries''', '', -1, '2016-01-03 03:47:20'),
(303, 2, 6, 0, 'Food type has changed from ''Blackberries''to ''Blackberries''', '', -1, '2016-01-03 03:47:31'),
(304, 2, 6, 0, 'Food type has changed from ''Blackberries''to ''Pears''', '', -1, '2016-01-03 03:47:34'),
(305, 2, 6, 0, 'Food type has changed from ''Pears''to ''Blackberries''', '', -1, '2016-01-03 03:53:43'),
(306, 2, 6, 0, 'Food type has changed from ''Blackberries''to ''Pears''', '', -1, '2016-01-03 03:54:35'),
(307, 2, 6, 0, 'Food type has changed from ''Pears''to ''Blackberries''', '', -1, '2016-01-03 03:54:50'),
(308, 2, 6, 0, 'Food type has changed from ''Blackberries''to ''Pears''', '', -1, '2016-01-03 03:55:49'),
(309, 2, 6, 0, 'Food type has changed from ''Pears''to ''Blackberries''', '', -1, '2016-01-03 03:56:16'),
(310, 2, 6, 0, 'Food type has changed from ''Blackberries''to ''Crabapples''', '', -1, '2016-01-03 03:56:23'),
(311, 2, 6, 0, 'Food type has changed from ''Crabapples''to ''Pears''', '', -1, '2016-01-03 03:56:43'),
(312, 2, 6, 0, 'Food type has changed from ''Pears''to ''Blackberries''', '', -1, '2016-01-03 03:56:47'),
(313, 2, 6, 0, 'Food type has changed from ''Blackberries''to ''Pears''', '', -1, '2016-01-03 03:56:49'),
(314, 2, 6, 0, 'Food type has changed from ''Pears''to ''Blackberries''', '', -1, '2016-01-03 03:58:02'),
(315, 2, 6, 0, 'Food type has changed from ''Blackberries''to ''Pears''', '', -1, '2016-01-03 04:00:48'),
(316, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:03:35'),
(317, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:03:51'),
(318, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:04:00'),
(319, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:04:04'),
(320, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:04:06'),
(321, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:04:29'),
(322, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:04:34'),
(323, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:04:36'),
(324, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:05:27'),
(325, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:05:39'),
(326, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:05:43'),
(327, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:07:14'),
(328, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:07:21'),
(329, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-03 13:08:19'),
(330, 2, 7, 0, 'Description has changed.', '', -1, '2016-01-03 13:08:36'),
(331, 2, 7, 0, 'Description has changed.', '', -1, '2016-01-03 13:08:40'),
(332, 2, 7, 0, 'Description has changed.', '', -1, '2016-01-03 13:14:29'),
(333, 2, 7, 0, 'Food type has changed from ''Mulberries'' to ''Mulberries''', '', -1, '2016-01-03 13:15:11'),
(334, 2, 7, 0, 'Description has changed.', '', -1, '2016-01-03 13:15:43'),
(335, 2, 7, 0, 'Description has changed.', '', -1, '2016-01-03 13:15:46'),
(336, 2, 1, 0, 'Description has changed.', '', -1, '2016-01-03 13:16:09'),
(337, 2, 1, 0, 'Description has changed.', '', -1, '2016-01-03 13:51:51'),
(338, 2, 8, 0, 'Tree has been added.', '', -1, '2016-01-03 23:57:36'),
(340, 2, 7, 0, 'Food type has changed from ''Mulberries'' to ''Mulberries''', '', -1, '2016-01-04 00:01:05'),
(341, 2, 10, 0, 'Tree has been added.', '', -1, '2016-01-04 00:01:58'),
(342, 2, 10, 0, 'Status has changed from ''dead'' to ''unknown''', '', -1, '2016-01-04 00:05:37'),
(343, 2, 10, 0, 'Food type has changed from ''Unknown'' to ''Blackberries''', '', -1, '2016-01-04 00:05:44'),
(344, 2, 10, 0, 'Status has changed from ''unknown'' to ''dead''', '', -1, '2016-01-04 00:05:59'),
(345, 2, 10, 0, 'Ownership has changed from ''unknown'' to ''private''', '', -1, '2016-01-04 00:06:00'),
(346, 2, 10, 0, 'Description has changed.', '', -1, '2016-01-04 00:07:49'),
(347, 2, 10, 0, 'Description has changed.', '', -1, '2016-01-04 00:07:57'),
(348, 2, 10, 0, 'Description has changed.', '', -1, '2016-01-04 00:08:02'),
(349, 2, 10, 0, 'Location has changed from ''@ 33.7704, -84.3916'' to ''@ 33.7904, -84.3916''', '', -1, '2016-01-04 00:08:08'),
(350, 2, 11, 0, 'Tree has been added.', '', -1, '2016-01-04 00:08:30'),
(351, 2, 11, 0, 'Location has changed from ''@ 33.7857, -84.3812'' to ''@ 33.7904, -84.3777''', '', -1, '2016-01-04 00:08:35'),
(352, 2, 11, 0, 'Description has changed.', '', -1, '2016-01-04 00:12:12'),
(353, 2, 11, 0, 'Status has changed from ''unknown'' to ''dead''', '', -1, '2016-01-04 00:12:50'),
(354, 2, 11, 0, 'Ownership has changed from ''unknown'' to ''private''', '', -1, '2016-01-04 00:12:50'),
(355, 2, 11, 0, 'Food type has changed from ''Unknown'' to ''Pears''', '', -1, '2016-01-04 00:13:00'),
(356, 2, 11, 0, 'Food type has changed from ''Pears'' to ''Crabapples''', '', -1, '2016-01-04 00:13:08'),
(357, 2, 11, 0, 'Food type has changed from ''Crabapples'' to ''Pears''', '', -1, '2016-01-04 00:14:21'),
(358, 2, 11, 0, 'Food type has changed from ''Pears'' to ''Crabapples''', '', -1, '2016-01-04 00:14:24'),
(360, 2, 11, 0, 'Status has changed from ''dead'' to ''dead''', '', -1, '2016-01-04 00:15:34'),
(361, 2, 11, 0, 'Status has changed from ''dead'' to ''dead''', '', -1, '2016-01-04 00:15:35'),
(362, 2, 11, 0, 'Status has changed from ''dead'' to ''unknown''', '', -1, '2016-01-04 00:17:31'),
(365, 2, 12, 0, 'Tree has been added.', '', -1, '2016-01-04 01:11:45'),
(366, 2, 13, 0, 'Tree has been added.', '', -1, '2016-01-04 01:12:02'),
(367, 2, 13, 0, 'Description has changed.', '', -1, '2016-01-04 01:12:05'),
(368, 2, 13, 0, 'Status has changed from ''unknown'' to ''dead''', '', -1, '2016-01-04 01:12:06'),
(370, 2, 13, 0, 'Ownership has changed from ''unknown'' to ''public''', '', -1, '2016-01-04 01:12:41'),
(371, 2, 13, 0, 'Ownership has changed from ''public'' to ''private''', '', -1, '2016-01-04 01:12:42'),
(372, 2, 13, 0, 'Ownership has changed from ''private'' to ''private''', '', -1, '2016-01-04 01:12:43'),
(373, 2, 13, 0, 'Ownership has changed from ''private'' to ''private''', '', -1, '2016-01-04 01:12:45'),
(374, 2, 13, 0, 'Ownership has changed from ''private'' to ''unknown''', '', -1, '2016-01-04 01:12:48'),
(376, 2, 14, 0, 'Tree has been added.', '', -1, '2016-01-04 01:13:02'),
(377, 2, 14, 0, 'Location has changed from ''@ 33.7704, -84.3916'' to ''@ 33.7978, -84.3871''', '', -1, '2016-01-04 01:13:08'),
(378, 2, 14, 0, 'Ownership has changed from ''unknown'' to ''public''', '', -1, '2016-01-04 01:13:10'),
(379, 2, 14, 0, 'Ownership has changed from ''public'' to ''private''', '', -1, '2016-01-04 01:13:10'),
(380, 2, 14, 0, 'Status has changed from ''unknown'' to ''cut down''', '', -1, '2016-01-04 01:13:11'),
(381, 2, 14, 0, 'Status has changed from ''cut down'' to ''dead''', '', -1, '2016-01-04 01:13:11'),
(383, 2, 14, 0, 'Status has changed from ''dead'' to ''cut down''', '', -1, '2016-01-04 01:13:14'),
(384, 2, 14, 0, 'Status has changed from ''cut down'' to ''cut down''', '', -1, '2016-01-04 01:13:16'),
(385, 2, 14, 0, 'Status has changed from ''cut down'' to ''cut down''', '', -1, '2016-01-04 01:13:18'),
(386, 2, 15, 0, 'Tree has been added.', '', -1, '2016-01-04 01:13:25'),
(387, 2, 15, 0, 'Location has changed from ''@ 33.7822, -84.3924'' to ''@ 33.7936, -84.3873''', '', -1, '2016-01-04 01:13:28'),
(388, 2, 15, 0, 'Description has changed.', '', -1, '2016-01-04 01:13:38'),
(389, 2, 15, 0, 'Status has changed from ''unknown'' to ''cut down''', '', -1, '2016-01-04 01:13:39'),
(390, 2, 15, 0, 'Ownership has changed from ''unknown'' to ''private''', '', -1, '2016-01-04 01:13:40'),
(391, 2, 15, 0, 'Ownership has changed from ''private'' to ''private''', '', -1, '2016-01-04 01:13:41'),
(392, 2, 15, 0, 'Ownership has changed from ''private'' to ''private''', '', -1, '2016-01-04 01:13:57'),
(393, 2, 15, 0, 'Ownership has changed from ''private'' to ''private''', '', -1, '2016-01-04 01:13:59'),
(394, 2, 6, 0, 'Status has changed from ''cut down'' to ''dead''', '', -1, '2016-01-04 01:14:15'),
(395, 2, 6, 0, 'Status has changed from ''dead'' to ''verfied''', '', -1, '2016-01-04 01:14:17'),
(396, 2, 6, 0, 'Ownership has changed from ''unknown'' to ''public''', '', -1, '2016-01-04 01:14:46'),
(397, 2, 6, 0, 'Ownership has changed from ''public'' to ''private''', '', -1, '2016-01-04 01:14:48'),
(398, 2, 6, 0, 'Ownership has changed from ''private'' to ''public''', '', -1, '2016-01-04 01:14:49'),
(399, 2, 6, 0, 'Ownership has changed from ''public'' to ''private''', '', -1, '2016-01-04 01:16:23'),
(400, 2, 6, 0, 'Status has changed from ''verfied'' to ''cut down''', '', -1, '2016-01-04 01:16:24'),
(401, 2, 6, 0, 'Status has changed from ''cut down'' to ''hidden''', '', -1, '2016-01-04 01:16:27'),
(402, 2, 6, 0, 'Status has changed from ''hidden'' to ''dead''', '', -1, '2016-01-04 01:16:28'),
(403, 2, 6, 0, 'Ownership has changed from ''private'' to ''public''', '', -1, '2016-01-04 01:16:28'),
(404, 2, 6, 0, 'Ownership has changed from ''public'' to ''private''', '', -1, '2016-01-04 01:16:31'),
(405, 2, 6, 0, 'Status has changed from ''dead'' to ''cut down''', '', -1, '2016-01-04 01:16:32'),
(406, 2, 6, 0, 'Status has changed from ''cut down'' to ''dead''', '', -1, '2016-01-04 01:16:32'),
(407, 2, 6, 0, 'Status has changed from ''dead'' to ''hidden''', '', -1, '2016-01-04 01:16:32'),
(408, 2, 6, 0, 'Ownership has changed from ''private'' to ''public''', '', -1, '2016-01-04 01:16:33'),
(409, 2, 6, 0, 'Status has changed from ''hidden'' to ''unknown''', '', -1, '2016-01-04 01:16:33'),
(410, 2, 6, 0, 'Status has changed from ''unknown'' to ''cut down''', '', -1, '2016-01-04 01:16:34'),
(412, 2, 6, 0, 'Ownership has changed from ''public'' to ''private''', '', -1, '2016-01-04 01:16:38'),
(413, 2, 6, 0, 'Ownership has changed from ''unknown'' to ''private''', '', -1, '2016-01-04 01:17:30'),
(414, 2, 6, 0, 'Ownership has changed from ''unknown'' to ''private''', '', -1, '2016-01-04 01:18:56'),
(416, 2, 6, 0, 'Ownership has changed from ''private'' to ''public''', '', -1, '2016-01-04 01:19:06'),
(417, 2, 16, 0, 'Tree has been added.', '', -1, '2016-01-04 01:19:24'),
(418, 2, 16, 0, 'Location has changed from ''@ 33.7839, -84.3899'' to ''@ 33.7960, -84.3862''', '', -1, '2016-01-04 01:19:27'),
(419, 2, 16, 0, 'Description has changed.', '', -1, '2016-01-04 01:19:33'),
(420, 2, 16, 0, 'Status has changed from ''unknown'' to ''dead''', '', -1, '2016-01-04 01:19:33'),
(421, 2, 16, 0, 'Status has changed from ''dead'' to ''hidden''', '', -1, '2016-01-04 01:19:34'),
(422, 2, 16, 0, 'Status has changed from ''hidden'' to ''dead''', '', -1, '2016-01-04 01:19:35'),
(423, 2, 16, 0, 'Ownership has changed from ''unknown'' to ''public''', '', -1, '2016-01-04 01:19:35'),
(424, 2, 16, 0, 'Ownership has changed from ''public'' to ''private''', '', -1, '2016-01-04 01:19:36'),
(425, 2, 16, 0, 'Food type has changed from ''Unknown'' to ''Crabapples''', '', -1, '2016-01-04 01:19:57'),
(426, 2, 16, 0, 'Location has changed from ''@ 33.7960, -84.3862'' to ''@ 33.7990, -84.3866''', '', -1, '2016-01-04 01:20:06'),
(427, 2, 16, 0, 'Description has changed.', '', -1, '2016-01-04 01:20:18'),
(428, 2, 16, 0, 'Status has changed from ''dead'' to ''verfied''', '', -1, '2016-01-04 01:20:22'),
(429, 2, 17, 0, 'Tree has been added.', '', -1, '2016-01-04 01:39:33'),
(430, 2, 17, 0, 'Tree has been added.', '', -1, '2016-01-04 01:39:37'),
(431, 2, 17, 0, 'Ownership has changed from ''unknown'' to ''public''', '', -1, '2016-01-04 01:39:40'),
(432, 2, 17, 0, 'Ownership has changed from ''public'' to ''public''', '', -1, '2016-01-04 01:39:43'),
(434, 2, 19, 0, 'Tree has been added.', '', -1, '2016-01-04 01:51:36'),
(435, 2, 19, 0, 'Tree has been added.', '', -1, '2016-01-04 01:51:39'),
(436, 2, 19, 0, 'Tree has been added.', '', -1, '2016-01-04 01:51:42'),
(437, 2, 19, 0, 'Tree has been added.', '', -1, '2016-01-04 01:51:45'),
(438, 2, 19, 0, 'Tree has been added.', '', -1, '2016-01-04 01:51:51'),
(441, 2, 21, 0, 'Tree has been added.', '', -1, '2016-01-04 01:53:58'),
(442, 2, 21, 0, 'Tree has been added.', '', -1, '2016-01-04 01:54:00'),
(443, 2, 21, 0, 'Tree has been added.', '', -1, '2016-01-04 01:54:09'),
(445, 2, 23, 0, 'Tree has been added.', '', -1, '2016-01-04 01:55:54'),
(448, 2, 25, 0, 'Tree has been added.', '', -1, '2016-01-04 01:56:47'),
(450, 2, 16, 0, 'Status has changed from ''verfied'' to ''cut down''', '', -1, '2016-01-04 01:57:03'),
(452, 2, 16, 0, 'Status has changed from ''cut down'' to ''verfied''', '', -1, '2016-01-04 01:57:06'),
(454, 2, 28, 0, 'Tree has been added.', '', -1, '2016-01-04 01:57:11'),
(455, 2, 29, 0, 'Tree has been added.', '', -1, '2016-01-04 02:02:52'),
(456, 2, 30, 0, 'Tree has been added.', '', -1, '2016-01-04 02:04:01'),
(457, 2, 31, 0, 'Tree has been added.', '', -1, '2016-01-04 02:04:35'),
(458, 2, 32, 0, 'Tree has been added.', '', -1, '2016-01-04 02:04:56'),
(459, 2, 33, 0, 'Tree has been added.', '', -1, '2016-01-04 02:05:47'),
(460, 2, 33, 0, 'Ownership has changed from ''unknown'' to ''public''', '', -1, '2016-01-04 02:06:34'),
(461, 2, 34, 0, 'Tree has been added.', '', -1, '2016-01-04 02:06:46'),
(462, 2, 35, 0, 'Tree has been added.', '', -1, '2016-01-04 02:07:39'),
(466, 2, 39, 0, 'Tree has been added.', '', -1, '2016-01-04 02:08:24'),
(467, 2, 40, 0, 'Tree has been added.', '', -1, '2016-01-04 02:08:31'),
(468, 2, 40, 0, 'Food type has changed from ''Unknown'' to ''Mulberries''', '', -1, '2016-01-04 02:08:50'),
(469, 2, 40, 0, 'Food type has changed from ''Mulberries'' to ''Pears''', '', -1, '2016-01-04 02:08:53'),
(470, 2, 16, 0, 'Status has changed from ''verfied'' to ''hidden''', '', -1, '2016-01-04 03:26:51'),
(472, 2, 16, 0, 'Status has changed from ''hidden'' to ''verfied''', '', -1, '2016-01-04 03:26:55'),
(474, 2, 1, 0, 'Food type has changed from ''Blackberries'' to ''Mulberries''', '', -1, '2016-01-04 06:51:51'),
(475, 2, 1, 0, 'Food type has changed from ''Mulberries'' to ''Pears''', '', -1, '2016-01-04 06:52:01'),
(477, 2, 1, 0, 'Food type has changed from ''Pears'' to ''Blackberries''', '', -1, '2016-01-04 06:52:07'),
(479, 2, 16, 0, 'Status has changed from ''verfied'' to ''hidden''', '', -1, '2016-01-04 07:06:49'),
(480, 2, 16, 0, 'Status has changed from ''hidden'' to ''verfied''', '', -1, '2016-01-04 07:06:49'),
(482, 2, 1, 0, 'Location has changed from ''@ 33.7828, -84.3756'' to ''@ 33.7812, -84.3756''', '', -1, '2016-01-04 07:48:29'),
(484, 2, 1, 0, 'Location has changed from ''@ 33.7812, -84.3700'' to ''@ 33.7812, -84.3700''', '', -1, '2016-01-04 07:53:13'),
(485, 2, 1, 0, 'Location has changed from ''@ 33.7812, -84.3700'' to ''@ 33.7812, -84.3700''', '', -1, '2016-01-04 07:53:16'),
(486, 2, 1, 0, 'Location has changed from ''@ 33.7812, -84.3700'' to ''@ 33.7813, -84.3700''', '', -1, '2016-01-04 07:53:26'),
(487, 2, 1, 0, 'Location has changed from ''@ 33.7813, -84.3700'' to ''@ 33.7813, -84.3700''', '', -1, '2016-01-04 07:54:10'),
(488, 2, 1, 0, 'Location has changed from ''@ 33.7813, -84.3700'' to ''@ 33.7813, -84.3700''', '', -1, '2016-01-04 07:54:32'),
(489, 2, 1, 0, 'Location has changed from ''@ 33.7813, -84.3700'' to ''@ 33.7813, -84.3700''', '', -1, '2016-01-04 07:54:36'),
(490, 2, 1, 0, 'Location has changed from ''@ 33.7813, -84.3700'' to ''@ 33.7698, -84.3795''', '', -1, '2016-01-04 07:55:24'),
(491, 2, 1, 0, 'Location has changed from ''@ 33.7698, -84.3795'' to ''@ 33.7700, -84.3919''', '', -1, '2016-01-04 07:55:29'),
(493, 2, 1, 0, 'Location has changed from ''@ 33.7700, -84.3919'' to ''@ 33.7701, -84.3919''', '', -1, '2016-01-04 07:55:46'),
(496, 2, 1, 0, 'Location has changed from ''@ 33.7701, -84.3919'' to ''@ 33.7702, -84.3919''', '', -1, '2016-01-04 07:58:19'),
(504, 2, 1, 0, 'Location has changed from ''@ 33.7702, -84.3919'' to ''@ 33.7702, -84.3912''', '', -1, '2016-01-04 08:07:57'),
(506, 2, 1, 0, 'Location has changed from ''@ 33.7702, -84.3912'' to ''@ 33.7703, -84.3912''', '', -1, '2016-01-04 08:08:47'),
(507, 2, 1, 0, 'Location has changed from ''@ 33.7703, -84.3912'' to ''@ 33.7702, -84.3912''', '', -1, '2016-01-04 08:08:56'),
(508, 2, 1, 0, 'Location has changed from ''@ 33.7702, -84.3912'' to ''@ 33.7702, -84.3913''', '', -1, '2016-01-04 08:09:04'),
(509, 2, 1, 0, 'Location has changed from ''@ 33.7702, -84.3913'' to ''@ 33.7703, -84.3913''', '', -1, '2016-01-04 08:26:32'),
(510, 2, 1, 0, 'Location has changed from ''@ 33.7703, -84.3913'' to ''@ 33.7704, -84.3913''', '', -1, '2016-01-04 08:27:20'),
(511, 2, 1, 0, 'Location has changed from ''@ 33.7704, -84.3913'' to ''@ 33.7730, -84.3913''', '', -1, '2016-01-04 08:27:26'),
(512, 2, 1, 0, 'Location has changed from ''@ 33.7730, -84.3913'' to ''@ 33.7731, -84.3913''', '', -1, '2016-01-04 08:29:09'),
(513, 2, 1, 0, 'Location has changed from ''@ 33.7731, -84.3913'' to ''@ 33.7732, -84.3913''', '', -1, '2016-01-04 08:30:16'),
(514, 2, 1, 0, 'Location has changed from ''@ 33.7732, -84.3913'' to ''@ 43.7732, -84.3913''', '', -1, '2016-01-04 08:30:43'),
(515, 2, 1, 0, 'Location has changed from ''@ 43.7732, -84.3913'' to ''@ 33.7732, -84.3913''', '', -1, '2016-01-04 08:30:51'),
(516, 2, 1, 0, 'Location has changed from ''@ 33.7732, -84.3913'' to ''@ 33.7731, -84.3913''', '', -1, '2016-01-04 08:32:36'),
(517, 2, 1, 0, 'Location has changed from ''@ 33.7731, -84.3913'' to ''@ 33.7732, -84.3913''', '', -1, '2016-01-04 08:32:39'),
(518, 2, 1, 0, 'Location has changed from ''@ 33.7732, -84.3913'' to ''@ 33.7733, -84.3913''', '', -1, '2016-01-04 08:33:43'),
(519, 2, 1, 0, 'Location has changed from ''@ 33.7733, -84.3913'' to ''@ 33.7732, -84.3913''', '', -1, '2016-01-04 08:34:29'),
(520, 2, 1, 0, 'Location has changed from ''@ 33.7732, -84.3913'' to ''@ 33.7731, -84.3913''', '', -1, '2016-01-04 08:36:28'),
(521, 2, 1, 0, 'Location has changed from ''@ 33.7731, -84.3913'' to ''@ 43.7731, -84.3913''', '', -1, '2016-01-04 08:36:30'),
(522, 2, 1, 0, 'Location has changed from ''@ 43.7731, -84.3913'' to ''@ 33.7731, -84.3913''', '', -1, '2016-01-04 08:36:32'),
(524, 2, 1, 0, 'Location has changed from ''@ 33.7731, -84.3913'' to ''@ 43.7731, -84.3913''', '', -1, '2016-01-04 08:50:06'),
(526, 2, 1, 0, 'Location has changed from ''@ 43.7731, -84.3913'' to ''@ 33.7731, -84.3913''', '', -1, '2016-01-04 08:50:18'),
(527, 2, 1, 0, 'Location has changed from ''@ 33.7731, -84.3913'' to ''@ 33.7700, -84.3918''', '', -1, '2016-01-04 08:50:30'),
(529, 2, 42, 0, 'Tree has been added.', '', -1, '2016-01-04 09:00:46'),
(531, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-04 14:31:15'),
(532, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-04 14:53:00'),
(533, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-04 14:53:05'),
(534, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-04 14:57:36'),
(535, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-04 14:57:42'),
(537, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-04 14:58:24'),
(539, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-04 15:41:03'),
(542, 2, 17, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:31'),
(543, 2, 18, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:33'),
(544, 2, 19, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:34'),
(545, 2, 20, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:35'),
(546, 2, 21, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:36'),
(547, 2, 22, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:38'),
(548, 2, 23, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:39'),
(549, 2, 24, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:40'),
(550, 2, 25, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:42'),
(551, 2, 26, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:43'),
(552, 2, 27, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:45'),
(553, 2, 28, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:48'),
(554, 2, 29, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:50'),
(555, 2, 30, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:51'),
(556, 2, 31, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:53'),
(557, 2, 32, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:54'),
(558, 2, 33, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:56'),
(559, 2, 34, 0, 'Tree has been added.', '', -1, '2016-01-04 18:49:58'),
(560, 2, 17, 0, 'Food type has changed from ''Unknown'' to ''Pears''', '', -1, '2016-01-04 18:58:28'),
(561, 2, 18, 0, 'Food type has changed from ''Unknown'' to ''Mulberries''', '', -1, '2016-01-04 18:58:29'),
(562, 2, 19, 0, 'Food type has changed from ''Unknown'' to ''Crabapples''', '', -1, '2016-01-04 18:58:30'),
(563, 2, 20, 0, 'Food type has changed from ''Unknown'' to ''Mulberries''', '', -1, '2016-01-04 18:58:31'),
(564, 2, 21, 0, 'Food type has changed from ''Unknown'' to ''Pears''', '', -1, '2016-01-04 18:58:33'),
(565, 2, 22, 0, 'Food type has changed from ''Unknown'' to ''Crabapples''', '', -1, '2016-01-04 18:58:35'),
(566, 2, 23, 0, 'Food type has changed from ''Unknown'' to ''Blackberries''', '', -1, '2016-01-04 18:58:36'),
(567, 2, 24, 0, 'Food type has changed from ''Unknown'' to ''Crabapples''', '', -1, '2016-01-04 18:58:39'),
(568, 2, 25, 0, 'Food type has changed from ''Unknown'' to ''Pears''', '', -1, '2016-01-04 18:58:41'),
(569, 2, 26, 0, 'Food type has changed from ''Unknown'' to ''Pears''', '', -1, '2016-01-04 18:58:42'),
(570, 2, 27, 0, 'Food type has changed from ''Unknown'' to ''Mulberries''', '', -1, '2016-01-04 18:58:43'),
(571, 2, 28, 0, 'Food type has changed from ''Unknown'' to ''Mulberries''', '', -1, '2016-01-04 18:58:45'),
(572, 2, 29, 0, 'Food type has changed from ''Unknown'' to ''Blackberries''', '', -1, '2016-01-04 18:58:46'),
(573, 2, 30, 0, 'Food type has changed from ''Unknown'' to ''Mulberries''', '', -1, '2016-01-04 18:58:48'),
(574, 2, 31, 0, 'Food type has changed from ''Unknown'' to ''Pears''', '', -1, '2016-01-04 18:58:50'),
(575, 2, 32, 0, 'Food type has changed from ''Unknown'' to ''Mulberries''', '', -1, '2016-01-04 18:58:52'),
(576, 2, 33, 0, 'Food type has changed from ''Unknown'' to ''Crabapples''', '', -1, '2016-01-04 18:58:53'),
(577, 2, 34, 0, 'Food type has changed from ''Unknown'' to ''Crabapples''', '', -1, '2016-01-04 18:58:55'),
(578, 2, 17, 0, 'Description has changed.', '', -1, '2016-01-04 18:59:02'),
(579, 2, 35, 0, 'Description has changed.', '', -1, '2016-01-04 19:27:31'),
(584, 2, 40, 0, 'Tree has been added.', '', -1, '2016-01-04 20:01:08'),
(585, 2, 41, 0, 'Tree has been added.', '', -1, '2016-01-04 20:01:44'),
(586, 2, 42, 0, 'Tree has been added.', '', -1, '2016-01-04 20:02:27'),
(588, 2, 42, 0, 'Description has changed.', '', -1, '2016-01-04 20:04:10'),
(589, 2, 44, 0, 'Description has changed.', '', -1, '2016-01-04 20:04:20'),
(590, 2, 45, 0, 'Tree has been added.', '', -1, '2016-01-04 20:05:14'),
(591, 2, 45, 0, 'Description has changed.', '', -1, '2016-01-04 20:05:20'),
(593, 2, 17, 0, 'Description has changed.', '', -1, '2016-01-04 20:15:17'),
(596, 2, 49, 0, 'Tree has been added.', '', -1, '2016-01-04 22:44:12'),
(598, 2, 51, 0, 'Tree has been added.', '', -1, '2016-01-05 12:49:43'),
(599, 2, 52, 0, 'Tree has been added.', '', -1, '2016-01-05 12:49:45'),
(600, 2, 53, 0, 'Tree has been added.', '', -1, '2016-01-05 12:49:46'),
(601, 2, 53, 0, 'Location has changed from ''@ 33.7704, -84.3916'' to ''@ 33.7522, -84.3547''', '', -1, '2016-01-05 12:59:48'),
(602, 2, 51, 0, 'Location has changed from ''@ 33.7705, -84.3916'' to ''@ 33.7483, -84.3976''', '', -1, '2016-01-05 12:59:51'),
(603, 2, 52, 0, 'Location has changed from ''@ 33.7704, -84.3916'' to ''@ 33.7706, -84.3701''', '', -1, '2016-01-05 12:59:54'),
(604, 2, 52, 0, 'Food type has changed from ''Unknown'' to ''Mulberries''', '', -1, '2016-01-05 12:59:58'),
(605, 2, 53, 0, 'Food type has changed from ''Unknown'' to ''Crabapples''', '', -1, '2016-01-05 13:00:01'),
(606, 2, 53, 0, 'Status has changed from ''unknown'' to ''hidden''', '', -1, '2016-01-05 13:00:03'),
(607, 2, 53, 0, 'Ownership has changed from ''unknown'' to ''private''', '', -1, '2016-01-05 13:00:03'),
(608, 2, 52, 0, 'Status has changed from ''unknown'' to ''hidden''', '', -1, '2016-01-05 13:00:04'),
(609, 2, 52, 0, 'Ownership has changed from ''unknown'' to ''private''', '', -1, '2016-01-05 13:00:05'),
(610, 2, 54, 0, 'Tree has been added.', '', -1, '2016-01-05 14:29:48'),
(612, 2, 56, 0, 'Tree has been added.', '', -1, '2016-01-05 14:33:34'),
(613, 2, 57, 0, 'Tree has been added.', '', -1, '2016-01-05 14:33:42'),
(614, 2, 58, 0, 'Tree has been added.', '', -1, '2016-01-05 14:35:33'),
(615, 2, 59, 0, 'Tree has been added.', '', -1, '2016-01-05 14:37:49'),
(616, 2, 60, 0, 'Tree has been added.', '', -1, '2016-01-05 14:38:12'),
(617, 2, 61, 0, 'Tree has been added.', '', -1, '2016-01-05 14:38:37'),
(618, 2, 62, 0, 'Tree has been added.', '', -1, '2016-01-05 14:38:44'),
(619, 2, 63, 0, 'Tree has been added.', '', -1, '2016-01-05 14:39:37'),
(620, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-05 16:11:09'),
(621, 2, 7, 0, 'Description has changed.', '', -1, '2016-01-05 16:11:14'),
(622, 2, 6, 0, 'Description has changed.', '', -1, '2016-01-05 16:11:14'),
(623, 2, 19, 0, 'Description has changed.', '', -1, '2016-01-05 16:11:16'),
(624, 2, 64, 0, 'Tree has been added.', '', -1, '2016-01-05 19:28:37'),
(626, 2, 7, 3, 'Karl Kim has adopted this tree.', '', -1, '2016-01-05 23:58:59'),
(631, 2, 7, 3, 'Karl Kim has unadopted this tree.', '', -1, '2016-01-06 00:10:40'),
(632, 2, 53, 3, 'Karl Kim has adopted this tree.', '', -1, '2016-01-06 00:11:08'),
(633, 2, 53, 3, 'Karl Kim has unadopted this tree.', '', -1, '2016-01-06 00:13:38'),
(635, 2, 17, 1, 'Carl Disalvo has adopted this tree.', '', -1, '2016-01-06 00:14:15'),
(636, 2, 25, 7, 'Craig Durkin has adopted this tree.', '', -1, '2016-01-06 00:14:20'),
(637, 2, 33, 3, 'Karl Kim has adopted this tree.', '', -1, '2016-01-06 00:14:24'),
(638, 2, 23, 12, 'Tre''Saun has adopted this tree.', '', -1, '2016-01-06 00:14:29'),
(639, 2, 23, 1, 'Carl Disalvo has adopted this tree.', '', -1, '2016-01-06 00:14:32'),
(640, 2, 18, 3, 'Karl Kim has adopted this tree.', '', -1, '2016-01-06 00:14:40'),
(641, 2, 31, 3, 'Karl Kim has adopted this tree.', '', -1, '2016-01-06 00:14:45'),
(642, 2, 31, 3, 'Karl Kim has unadopted this tree.', '', -1, '2016-01-06 00:14:47'),
(643, 2, 31, 7, 'Craig Durkin has adopted this tree.', '', -1, '2016-01-06 00:14:48'),
(644, 2, 27, 12, 'Tre''Saun has adopted this tree.', '', -1, '2016-01-06 00:14:53'),
(645, 2, 34, 2, 'Tom Jenkins has adopted this tree.', '', -1, '2016-01-06 00:15:00'),
(646, 2, 25, 2, 'Tom Jenkins has adopted this tree.', '', -1, '2016-01-06 00:15:05'),
(647, 2, 23, 2, 'Tom Jenkins has adopted this tree.', '', -1, '2016-01-06 00:15:11'),
(648, 2, 21, 2, 'Tom Jenkins has adopted this tree.', '', -1, '2016-01-06 00:15:15'),
(649, 2, 24, 2, 'Tom Jenkins has adopted this tree.', '', -1, '2016-01-06 00:16:24'),
(651, 2, 1, 3, 'Karl Kim has adopted this tree.', '', -1, '2016-01-06 00:40:25'),
(653, 2, 16, 7, 'Craig Durkin has adopted this tree.', '', -1, '2016-01-06 00:42:19'),
(655, 2, 1, 0, 'Description has changed.', '', -1, '2016-01-07 00:11:35'),
(656, 2, 1, 0, 'Description has changed.', '', -1, '2016-01-07 00:11:39'),
(658, 2, 1, 0, 'Food type has changed from ''Blackberries'' to ''Pears''', '', -1, '2016-01-07 00:24:57'),
(659, 2, 1, 0, 'Food type has changed from ''Pears'' to ''Blackberries''', '', -1, '2016-01-07 00:24:59'),
(660, 2, 1, 0, 'Location has changed from ''@ 33.7700, -84.3918'' to ''@ 33.7701, -84.3918''', '', -1, '2016-01-07 00:59:20'),
(661, 2, 1, 0, 'Location has changed from ''@ 33.7701, -84.3918'' to ''@ 33.7702, -84.3918''', '', -1, '2016-01-07 00:59:30'),
(665, 2, 1, 0, 'Ownership has changed from ''private'' to ''public''', '', -1, '2016-01-07 01:11:48'),
(666, 1, 1, 0, 'Start over.', '', 0, '2016-01-08 08:00:00'),
(669, 2, 1, 0, 'Status has changed from ''hidden'' to ''dead''', '', -1, '2016-01-09 14:46:18'),
(671, 2, 7, 1, 'Carl Disalvo has adopted this tree.', '', -1, '2016-01-09 14:47:30'),
(672, 2, 7, 1, 'Carl Disalvo has unadopted this tree.', '', -1, '2016-01-09 14:47:34'),
(681, 1, 24, 0, '123Â ', 'reversegeocoding_0.jpg', 1, '2015-09-07 00:00:00'),
(686, 1, 23, 0, '', 'pic5_0.jpg,pic2_0.jpg,pic1_4.jpg,pic3_1.jpg,pic4_0.jpg', 3, '2015-10-22 21:00:00'),
(687, 1, 23, 0, 'CommentÂ ', 'undo1_0.jpg', 1, '2015-04-07 01:00:00'),
(688, 1, 1, 0, '', 'pic228_2.jpg', 1, '2014-09-10 01:00:00'),
(689, 1, 1, 0, '', 'pic7_0.jpg', 0, '2015-01-06 01:00:00'),
(690, 1, 1, 0, '', 'pic228_3.jpg', 0, '2015-01-23 02:00:00'),
(691, 1, 7, 0, 'It starts growing - KarlÂ ', 'pic2_1.jpg', 1, '2016-01-10 01:22:20'),
(692, 1, 7, 0, 'line 1', 'SpookyMan_0.jpg', 3, '2015-12-23 10:00:00'),
(694, 2, 17, 0, 'Status has changed from as ''hidden''', '', -1, '2016-01-10 11:00:30'),
(695, 2, 17, 0, 'Status has changed as ''unknown''', '', -1, '2016-01-10 11:02:50'),
(696, 2, 17, 0, 'Status has changed as ''dead''', '', -1, '2016-01-10 11:03:53'),
(697, 1, 23, 0, 'Comment ~~~\nComment 2~~~Â ', 'Blackberries_23_0.jpg', 4, '2016-01-10 20:00:53'),
(698, 1, 23, 0, '', 'Blackberries_23_8.png,Blackberries_23_1.png,Blackberries_23_0.png,Blackberries_23_9.png,Blackberries_23_11.png', 2, '2016-01-04 21:00:00'),
(699, 2, 16, 0, 'Description has changed as ''Craig''s Crabapples 2''', '', -1, '2016-01-25 17:50:59'),
(700, 2, 16, 0, 'Status has changed as ''hidden''', '', -1, '2016-01-25 17:51:04'),
(702, 2, 16, 1, 'Carl Disalvo has adopted this tree.', '', -1, '2016-01-25 17:52:10'),
(703, 2, 16, 1, 'Carl Disalvo has unadopted this tree.', '', -1, '2016-01-25 17:52:27'),
(704, 2, 16, 0, 'Description has changed as ''Craig''s Crabapples''', '', -1, '2016-01-26 09:12:23'),
(705, 2, 17, 1, 'Carl Disalvo has unadopted this tree.', '', -1, '2016-01-26 21:27:20'),
(706, 2, 17, 12, 'Tre''Saun has adopted this tree.', '', -1, '2016-01-26 21:27:22'),
(707, 2, 17, 12, 'Tre''Saun has unadopted this tree.', '', -1, '2016-01-26 21:27:24'),
(708, 2, 17, 12, 'Tre''Saun has adopted this tree.', '', -1, '2016-01-26 21:27:25'),
(709, 2, 23, 0, 'Description has changed as ''''', '', -1, '2016-01-27 08:05:16'),
(710, 2, 25, 0, 'Description has changed as ''''', '', -1, '2016-01-27 18:17:05'),
(711, 1, 26, 0, '', '', 0, '2016-01-27 18:53:32'),
(712, 2, 17, 0, 'Description has changed as ''''', '', -1, '2016-01-27 20:33:16'),
(713, 2, 17, 0, 'Description has changed as ''''', '', -1, '2016-01-27 20:33:23'),
(714, 2, 17, 0, 'Description has changed as ''''', '', -1, '2016-01-27 20:52:31'),
(717, 2, 1, 0, 'Address has changed as ''North Ave Turn Around, Fulton County, Georgia, 30313''', '', -1, '2016-01-28 01:29:21'),
(719, 2, 6, 0, 'Address has changed as ''10th Street Northeast, Fulton County, Georgia, 30309''', '', -1, '2016-01-28 01:29:29'),
(720, 2, 7, 0, 'Address has changed as ''10th Street Northwest, Fulton County, Georgia, 30318''', '', -1, '2016-01-28 01:29:29'),
(722, 2, 7, 0, 'Description has changed as ''10th Street Northwest, Fulton County, Georgia, 30318''', '', -1, '2016-01-28 01:43:54'),
(723, 2, 7, 0, 'Address has changed as ''10th Street Northwest, Fulton County, Georgia, 30318''', '', -1, '2016-01-28 01:47:13'),
(724, 2, 16, 0, 'Address has changed as ''West Peachtree Street Northeast, Fulton County, Georgia, 30309''', '', -1, '2016-01-28 01:47:44'),
(726, 2, 17, 0, 'Address has changed as ''Tech Square''', '', -1, '2016-01-28 01:48:01'),
(727, 2, 17, 0, 'Address has changed as ''Milton Candler Lane, DeKalb County, Georgia, 30030''', '', -1, '2016-01-28 01:48:06'),
(728, 2, 18, 0, 'Address has changed as ''Kelly Lake Road, DeKalb County, Georgia, 30032''', '', -1, '2016-01-28 01:48:08'),
(729, 2, 19, 0, 'Address has changed as ''Hillcrest Drive Southeast, DeKalb County, Georgia, 30316''', '', -1, '2016-01-28 01:48:09'),
(730, 2, 20, 0, 'Address has changed as ''Langston Avenue Southwest, Fulton County, Georgia, 30310''', '', -1, '2016-01-28 01:48:10'),
(731, 2, 21, 0, 'Address has changed as ''Cativo Drive Southwest, Fulton County, Georgia, 30311''', '', -1, '2016-01-28 01:48:11'),
(732, 2, 22, 0, 'Address has changed as ''2nd Street Northwest, Fulton County, Georgia, 30318''', '', -1, '2016-01-28 01:48:11'),
(733, 2, 23, 0, 'Address has changed as ''Olympic Industrial Drive, Cobb County, Georgia, 30080''', '', -1, '2016-01-28 01:48:13'),
(734, 2, 24, 0, 'Address has changed as ''Tuxedo Terrace Northwest, Fulton County, Georgia, 30342''', '', -1, '2016-01-28 01:48:13'),
(735, 2, 25, 0, 'Address has changed as ''Mount Brian Road Northeast, DeKalb County, Georgia, 30329''', '', -1, '2016-01-28 01:48:16'),
(736, 2, 26, 0, 'Address has changed as ''North Clarendon Avenue, DeKalb County, Georgia, 30079''', '', -1, '2016-01-28 01:48:16'),
(737, 2, 27, 0, 'Address has changed as ''Glenhaven Drive, DeKalb County, Georgia, 30035''', '', -1, '2016-01-28 01:48:16'),
(738, 2, 28, 0, 'Address has changed as ''Old Grant Road, Clayton County, Georgia, 30294''', '', -1, '2016-01-28 01:48:18'),
(739, 2, 29, 0, 'Address has changed as ''Claire Drive Southwest, Fulton County, Georgia, 30315''', '', -1, '2016-01-28 01:48:18'),
(740, 2, 30, 0, 'Address has changed as ''Forest Parkway, Clayton County, Georgia, 30260''', '', -1, '2016-01-28 01:48:19'),
(741, 2, 31, 0, 'Address has changed as ''Lumpkin Street, Fulton County, Georgia, 30344''', '', -1, '2016-01-28 01:48:20'),
(742, 2, 32, 0, 'Address has changed as ''Perimeter, Fulton County, Georgia, 30336''', '', -1, '2016-01-28 01:48:20'),
(743, 2, 33, 0, 'Address has changed as ''Surrey Lane, DeKalb County, Georgia, 30341''', '', -1, '2016-01-28 01:48:21'),
(744, 2, 34, 0, 'Address has changed as ''Orchords Walk, DeKalb County, Georgia, 30087''', '', -1, '2016-01-28 01:48:22'),
(746, 2, 55, 0, '''Pears  #55'' has been added.', '', -1, '2016-01-28 01:50:11'),
(747, 2, 55, 0, 'Address has changed as ''North Avenue Northwest, Fulton County, Georgia, 30313''', '', -1, '2016-01-28 01:50:17'),
(748, 2, 56, 0, '''Unknown  #56'' has been added.', '', -1, '2016-01-28 01:50:36'),
(749, 2, 57, 0, '''Unknown  #57'' has been added.', '', -1, '2016-01-28 01:51:45'),
(750, 2, 58, 0, '''Unknown  #58'' has been added.', '', -1, '2016-01-28 01:52:09'),
(751, 2, 59, 0, '''Unknown  #59'' has been added.', '', -1, '2016-01-28 01:55:25'),
(752, 2, 59, 0, 'Address has changed as ''Oakdale Road Northeast, DeKalb County, Georgia, United States of America, 30307''', '', -1, '2016-01-28 02:00:58'),
(753, 2, 59, 0, 'Description has changed as ''Â ''', '', -1, '2016-01-28 02:01:01'),
(754, 2, 59, 0, 'Description has changed as ''descÂ ''', '', -1, '2016-01-28 02:05:17'),
(755, 2, 59, 0, 'Address has changed as ''Oakdale Road Northeast, DeKalb County, Georgia, 30307''', '', -1, '2016-01-28 02:06:46'),
(756, 2, 59, 0, 'Address has changed as ''Tech Square''', '', -1, '2016-01-28 02:06:55'),
(757, 2, 59, 0, 'Address has changed as ''Oakdale Road Northeast, DeKalb County, Georgia, 30307''', '', -1, '2016-01-28 02:07:04'),
(759, 2, 59, 0, 'Address has changed as ''Oakdale Road Northeast''', '', -1, '2016-01-28 02:08:41'),
(760, 2, 1, 0, 'Address has changed as ''North Avenue''', '', -1, '2016-01-28 02:13:58'),
(763, 2, 1, 0, 'Address has changed as ''North Avenue''', '', -1, '2016-01-28 02:14:22'),
(765, 2, 1, 0, 'Address has changed as ''North Ave Turn Around, Fulton County, Georgia, 30313''', '', -1, '2016-01-28 02:15:15'),
(767, 2, 59, 0, 'Address has changed as ''Oakdale Road Northeast, DeKalb County, Georgia, 30307''', '', -1, '2016-01-28 02:15:49'),
(768, 2, 60, 0, '''Unknown  #60'' has been added.', '', -1, '2016-01-28 02:16:05'),
(769, 2, 60, 0, 'Description has changed as ''Â ''', '', -1, '2016-01-28 02:22:16'),
(770, 2, 60, 0, 'Address has changed as ''Ridgedale Road Northeast, DeKalb County, Georgia, United States of America, 30317''', '', -1, '2016-01-28 02:22:18'),
(771, 2, 60, 0, 'Address has changed as ''Ridgedale Road Northeast''', '', -1, '2016-01-28 02:25:46'),
(772, 2, 60, 0, 'Address has changed as ''Ridgedale Road Northeast, DeKalb County, Georgia, 30317''', '', -1, '2016-01-28 02:26:01'),
(773, 2, 60, 0, 'Description has changed as ''Â 123''', '', -1, '2016-01-28 02:28:09'),
(774, 2, 1, 0, 'Address has changed as ''North Ave Turn Around, Fulton County, Georgia, 30313''', '', -1, '2016-01-28 02:31:09'),
(775, 2, 1, 0, 'Address has changed as ''North Ave Turn Around, Fulton County, Georgia''', '', -1, '2016-01-28 02:32:59'),
(776, 2, 1, 0, 'Address has changed as ''North Ave Turn Around, Fulton County, Georgia, 30313''', '', -1, '2016-01-28 02:33:02');
INSERT INTO `note` (`id`, `type`, `tree`, `person`, `comment`, `picture`, `rate`, `date`) VALUES
(781, 2, 1, 0, 'Status has changed as ''verfied''', '', -1, '2016-01-29 16:44:34'),
(782, 1, 1, 3, 'It starts re-growing... I hope it will ripe soon.', 'Blackberries_1_0.jpg', 8, '2016-01-29 16:50:35'),
(783, 1, 1, 0, 'Temp CommentÂ  Temp Comment\nTemp Comment\nTemp Comment', '', 3, '2016-01-19 17:00:00'),
(785, 2, 1, 0, 'Status has changed as ''cut down''', '', -1, '2016-01-29 17:48:23'),
(787, 2, 1, 0, 'Status has changed as ''verfied''', '', -1, '2016-01-29 17:55:45'),
(793, 2, 1, 0, 'Status has changed as ''cut down''', '', -1, '2016-01-29 19:03:53'),
(794, 2, 1, 7, 'Craig Durkin has adopted this tree.', '', -1, '2016-01-29 19:04:21');

-- --------------------------------------------------------

--
-- Table structure for table `ownership`
--

CREATE TABLE `ownership` (
  `id` int(11) NOT NULL,
  `name` varchar(150) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ownership`
--

INSERT INTO `ownership` (`id`, `name`) VALUES
(0, 'unknown'),
(1, 'public'),
(2, 'private');

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

CREATE TABLE `person` (
  `id` int(11) NOT NULL,
  `auth` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `address` varchar(150) NOT NULL,
  `contact` varchar(150) NOT NULL,
  `password` char(128) NOT NULL,
  `salt` char(128) NOT NULL,
  `neighborhood` varchar(150) NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`id`, `auth`, `name`, `address`, `contact`, `password`, `salt`, `neighborhood`, `updated`) VALUES
(1, 3, 'Carl Disalvo', '', 'carl.disalvo@lmc.gatech.edu', '', '', '', '2016-01-05 11:40:15'),
(2, 3, 'Tom Jenkins', '350 Candler St NE 30307', 'tjenks@gmail.com', '', '', 'Candler Park', '2015-11-17 12:16:00'),
(3, 3, 'Karl Kim', '120 NorthAvenue NW', 'jkim848@gatech.edu', 'ad2cfe6db75d058e223c41ace6b9f408ad850087369a7c04a4f3773a1c84492ce3ef95d1f10a1dce3705bd10bb8d0514c07b26f72ed434ca1f467baa4228a484', '57238d5c5426282d46c313bc2fba7eb908eba2959a8bca9aecab90c6815864337d683f9d409150dc932b3f48f523b3a1848e565c5999ff0f1af090ee7cc64ba7', 'Bobby Dodd Stadium', '2016-01-05 12:06:35'),
(7, 1, 'Craig Durkin', '', '', '', '', '', '2016-01-05 14:17:39'),
(12, 3, 'Tre''Saun', 'Thomas', 'tthomas45@gatech.edu', '', '', 'Bobby Dodd Stadium', '2016-01-05 23:11:00');

-- --------------------------------------------------------

--
-- Table structure for table `place`
--

CREATE TABLE `place` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` varchar(150) NOT NULL,
  `address` varchar(150) NOT NULL,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `place`
--

INSERT INTO `place` (`id`, `name`, `description`, `address`, `lat`, `lng`, `updated`) VALUES
(1, 'FoodBank #1', 'Near Atlantic Station', 'North Ave Turn Around, Fulton County, Georgia, 30313', 33.7702, -84.3918, '2016-01-28 14:37:02'),
(7, 'FoodBank #2', 'Near GeorgiaTech', 'North Avenue Northwest, Fulton County, Georgia, 30313', 33.7705, -84.3916, '2016-01-28 14:37:01');

-- --------------------------------------------------------

--
-- Table structure for table `tree`
--

CREATE TABLE `tree` (
  `id` int(11) NOT NULL,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  `food` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `flag` int(11) NOT NULL,
  `owner` int(11) NOT NULL,
  `description` varchar(150) NOT NULL,
  `address` varchar(150) NOT NULL,
  `ownership` int(11) NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tree`
--

INSERT INTO `tree` (`id`, `lat`, `lng`, `food`, `type`, `flag`, `owner`, `description`, `address`, `ownership`, `updated`) VALUES
(1, 33.7702, -84.3918, 1, 1, 2, 0, 'In North Avenue Apt', 'North Ave Turn Around, Fulton County, Georgia, 30313', 1, '2016-01-29 19:03:52'),
(6, 33.7828, -84.3756, 2, 1, 2, 0, 'Carl''s Mulberries', '10th Street Northeast, Fulton County, Georgia, 30309', 1, '2016-01-28 01:29:29'),
(7, 33.7819, -84.3983, 3, 1, 3, 0, '10th Street Northwest, Fulton County, Georgia, 30318', '10th Street Northwest, Fulton County, Georgia, 30318', 1, '2016-01-28 01:47:13'),
(16, 33.799, -84.3866, 4, 0, 4, 0, 'Craig''s Crabapples', 'West Peachtree Street Northeast, Fulton County, Georgia, 30309', 2, '2016-01-28 01:47:44'),
(17, 33.7679, -84.2947, 2, 0, 1, 0, '', 'Milton Candler Lane, DeKalb County, Georgia, 30030', 0, '2016-01-28 01:48:06'),
(18, 33.7173, -84.2784, 3, 0, 0, 0, '', 'Kelly Lake Road, DeKalb County, Georgia, 30032', 0, '2016-01-28 01:48:08'),
(19, 33.7018, -84.3412, 4, 0, 0, 0, '', 'Hillcrest Drive Southeast, DeKalb County, Georgia, 30316', 0, '2016-01-28 01:48:09'),
(20, 33.7089, -84.4227, 3, 0, 0, 0, '', 'Langston Avenue Southwest, Fulton County, Georgia, 30310', 0, '2016-01-28 01:48:10'),
(21, 33.7403, -84.4706, 2, 0, 0, 0, '', 'Cativo Drive Southwest, Fulton County, Georgia, 30311', 0, '2016-01-28 01:48:11'),
(22, 33.7874, -84.4682, 4, 0, 0, 0, '', '2nd Street Northwest, Fulton County, Georgia, 30318', 0, '2016-01-28 01:48:11'),
(23, 33.8311, -84.4711, 1, 0, 0, 0, '', 'Olympic Industrial Drive, Cobb County, Georgia, 30080', 0, '2016-01-28 01:48:13'),
(24, 33.8606, -84.3918, 4, 0, 0, 0, '', 'Tuxedo Terrace Northwest, Fulton County, Georgia, 30342', 0, '2016-01-28 01:48:13'),
(25, 33.8312, -84.3144, 2, 0, 0, 0, '', 'Mount Brian Road Northeast, DeKalb County, Georgia, 30329', 0, '2016-01-28 01:48:15'),
(26, 33.7864, -84.2641, 2, 0, 0, 0, '', 'North Clarendon Avenue, DeKalb County, Georgia, 30079', 0, '2016-01-28 01:48:16'),
(27, 33.7429, -84.2143, 3, 0, 0, 0, '', 'Glenhaven Drive, DeKalb County, Georgia, 30035', 0, '2016-01-28 01:48:16'),
(28, 33.6158, -84.3008, 3, 0, 0, 0, '', 'Old Grant Road, Clayton County, Georgia, 30294', 0, '2016-01-28 01:48:18'),
(29, 33.7072, -84.3901, 1, 0, 0, 0, '', 'Claire Drive Southwest, Fulton County, Georgia, 30315', 0, '2016-01-28 01:48:18'),
(30, 33.6112, -84.3372, 3, 0, 0, 0, '', 'Forest Parkway, Clayton County, Georgia, 30260', 0, '2016-01-28 01:48:19'),
(31, 33.6866, -84.4498, 2, 0, 0, 0, '', 'Lumpkin Street, Fulton County, Georgia, 30344', 0, '2016-01-28 01:48:20'),
(32, 33.7615, -84.4945, 3, 0, 0, 0, '', 'Perimeter, Fulton County, Georgia, 30336', 0, '2016-01-28 01:48:20'),
(33, 33.8744, -84.318, 4, 0, 0, 0, '', 'Surrey Lane, DeKalb County, Georgia, 30341', 0, '2016-01-28 01:48:21'),
(34, 33.7894, -84.1134, 4, 0, 0, 0, '', 'Orchords Walk, DeKalb County, Georgia, 30087', 0, '2016-01-28 01:48:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adopt`
--
ALTER TABLE `adopt`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `auth`
--
ALTER TABLE `auth`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `donation`
--
ALTER TABLE `donation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `flag`
--
ALTER TABLE `flag`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `food`
--
ALTER TABLE `food`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `note`
--
ALTER TABLE `note`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ownership`
--
ALTER TABLE `ownership`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contact` (`contact`);

--
-- Indexes for table `place`
--
ALTER TABLE `place`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tree`
--
ALTER TABLE `tree`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adopt`
--
ALTER TABLE `adopt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
--
-- AUTO_INCREMENT for table `auth`
--
ALTER TABLE `auth`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `donation`
--
ALTER TABLE `donation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT for table `flag`
--
ALTER TABLE `flag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `food`
--
ALTER TABLE `food`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `note`
--
ALTER TABLE `note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=795;
--
-- AUTO_INCREMENT for table `ownership`
--
ALTER TABLE `ownership`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `person`
--
ALTER TABLE `person`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `place`
--
ALTER TABLE `place`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `tree`
--
ALTER TABLE `tree`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
