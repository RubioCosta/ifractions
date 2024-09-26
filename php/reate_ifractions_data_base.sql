/*!999999 - Create Data Base to iFractions with name 'ifractions2 */

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `db_ifractions`
-- On Linux, create iFractions data base with command:
-- $ mysql -p -u root < reate_ifractions_data_base.sql
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `db_ifractions` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `db_ifractions`;

--
-- Table structure for table `ifractions`
--

DROP TABLE IF EXISTS `ifractions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ifractions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `line_hostip` varchar(255) DEFAULT NULL,
  `line_playername` varchar(256) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `line_datetime` varchar(20) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `line_lang` varchar(6) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `line_game` varchar(10) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `line_mode` varchar(1) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `line_operator` varchar(5) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `line_level` int(5) NOT NULL,
  `line_mappos` int(5) NOT NULL,
  `line_result` varchar(6) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `line_time` varchar(20) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  `line_details` varchar(120) CHARACTER SET latin1 COLLATE latin1_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;