-- phpMyAdmin SQL Dump
-- version 4.0.10.7
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Jan 30, 2016 at 08:12 PM
-- Server version: 5.5.45-cll-lve
-- PHP Version: 5.4.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `theccstf_foodparent`
--

-- --------------------------------------------------------

--
-- Table structure for table `adopt`
--

CREATE TABLE IF NOT EXISTS `adopt` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tree` int(11) NOT NULL,
  `parent` int(11) NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `auth`
--

CREATE TABLE IF NOT EXISTS `auth` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `auth`
--

INSERT INTO `auth` (`id`, `name`) VALUES
(1, 'ConcreteJungle'),
(2, 'Manager'),
(3, 'Participant'),
(4, 'Guest');

-- --------------------------------------------------------

--
-- Table structure for table `donation`
--

CREATE TABLE IF NOT EXISTS `donation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `place` int(11) NOT NULL,
  `tree` varchar(128) NOT NULL,
  `quantity` float NOT NULL,
  `picture` varchar(512) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `flag`
--

CREATE TABLE IF NOT EXISTS `flag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `flag`
--

INSERT INTO `flag` (`id`, `name`) VALUES
(1, 'dead'),
(2, 'cut down'),
(3, 'verfied'),
(4, 'hidden'),
(5, 'growing');

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE IF NOT EXISTS `food` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL,
  `icon` varchar(128) NOT NULL,
  `description` varchar(512) NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`id`, `name`, `icon`, `description`, `updated`) VALUES
(1, '*Unknown', 'marker-question.png', 'Unknown', '2016-01-30 00:00:00'),
(2, 'Blackberries', 'marker-blackberry.png', 'Blackberries Desc', '2016-01-30 00:00:00'),
(3, 'Pears', 'marker-pear.png', 'Pears Desc', '2016-01-30 00:00:00'),
(4, 'Mulberries', 'marker-mulberries.png', 'Mulberries Desc', '2016-01-30 00:00:00'),
(5, 'Crabapples', 'marker-crabapples.png', 'Crabapples Desc', '2016-01-30 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `note`
--

CREATE TABLE IF NOT EXISTS `note` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL,
  `tree` int(11) NOT NULL,
  `person` int(11) NOT NULL,
  `comment` text NOT NULL,
  `picture` varchar(512) NOT NULL,
  `rate` float NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `ownership`
--

CREATE TABLE IF NOT EXISTS `ownership` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(16) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `ownership`
--

INSERT INTO `ownership` (`id`, `name`) VALUES
(1, 'public'),
(2, 'private');

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

CREATE TABLE IF NOT EXISTS `person` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `auth` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `address` varchar(128) NOT NULL,
  `contact` varchar(128) NOT NULL,
  `password` char(128) NOT NULL,
  `salt` char(128) NOT NULL,
  `neighborhood` varchar(128) NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contact` (`contact`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `person`
--

INSERT INTO `person` (`id`, `auth`, `name`, `address`, `contact`, `password`, `salt`, `neighborhood`, `updated`) VALUES
(1, 1, 'Craig Durkin', '', 'craig@concrete-jungle.org', 'f0172539810bf52afc511e783f55540d7fde67e1bd9e08cc28c12e376c93293fd06d773ecb19e67a2edb78b966bd1f5d5b6135a01b9499c6b9390efc2c444091', '7b14ee507ab0ac2bf9b03d32996e203ab11675ead01c71d7298acf7363af3875ef6eff06dfadd7edf37dbd76d1b64bc51e5b6d9322eac9f91f31fe6fcc922761', '', '2016-01-30 16:33:11'),
(2, 1, 'Katherine Kennedy', '', 'katherine@concrete-jungle.org', '5fabc20d3453f44093b6f9421659cfc06bd5203d717dd4a5f7a18c0390d22443054499941de0e609cc3128c96d4e4ef4686efbf57a598eb63ab0d2e82dfabb6e', 'c6f28afd87a24c5fbabf5f3aad1cbccdb4e3ce3679f9a0ae212d56dc29ebe9271238ad6c42ec61eecec41902f08471a2abbf39d2cc44d9e4d1f2f683cbcab2af', '', '2016-01-30 15:44:31'),
(3, 2, 'Karl Kim', 'North Avenue NW 120', 'jkim848@gatech.edu', '4d3de6a750589c8d8dab4590857ae284de3a6f0455debd8d39474d606692d5e72272df989ec0c4dee5fbe2da180a5449aa00101f8aeb27ea46c8703c4222cbdd', '6a660b55f4d1e11fbbf6818f205fe4208aac62e69ebf53a9af0dcf195921a34c3f43415c18000f4d26d837e651bbe873d9a3414a501057d6dcf36c49d7976513', 'Bobby Dodd Stadium', '2016-01-30 20:12:01');

-- --------------------------------------------------------

--
-- Table structure for table `place`
--

CREATE TABLE IF NOT EXISTS `place` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `description` varchar(128) NOT NULL,
  `address` varchar(128) NOT NULL,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tree`
--

CREATE TABLE IF NOT EXISTS `tree` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lat` float NOT NULL,
  `lng` float NOT NULL,
  `food` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `flag` varchar(128) NOT NULL,
  `owner` int(11) NOT NULL,
  `description` varchar(128) NOT NULL,
  `address` varchar(128) NOT NULL,
  `ownership` int(11) NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
