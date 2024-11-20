-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: junction.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cbt_categories`
--

DROP TABLE IF EXISTS `cbt_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cbt_categories` (
  `category_id` binary(12) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cbt_categories`
--

LOCK TABLES `cbt_categories` WRITE;
/*!40000 ALTER TABLE `cbt_categories` DISABLE KEYS */;
INSERT INTO `cbt_categories` VALUES (_binary 'gPC%>\÷xû|ë','Limpieza','La categor√≠a de limpieza en Chibat√° incluye actividades como la recolecci√≥n de residuos y el mantenimiento de espacios naturales, tales como parques, humedales y playas.',1),(_binary 'gPW%>\÷xû|ó','Reforestacion','Actividades de plantaci√≥n de √°rboles en √°reas deforestadas para restaurar ecosistemas y mejorar la calidad del aire y del suelo.',1),(_binary 'géHà∞\√4àç\Ì','Educaci√≥n Ambiental','Talleres y charlas sobre sostenibilidad, reciclaje y la importancia de cuidar el medio ambiente, dirigidos a diferentes grupos de la comunidad.',1),(_binary 'gé^à∞\√4àç\Û','Eco-turismo','Rutas guiadas por zonas naturales, promoviendo el turismo responsable y la preservaci√≥n de la biodiversidad local.',1),(_binary 'génà∞\√4àç˘','Conservaci√≥n de Fauna','Proyectos de protecci√≥n de especies en peligro, creaci√≥n de h√°bitats seguros y promoci√≥n del respeto por la vida silvestre.',1),(_binary 'gé|à∞\√4àçˇ','Huertos Comunitarios','Creaci√≥n y mantenimiento de huertos urbanos que fomentan la agricultura sostenible y el autoconsumo, promoviendo h√°bitos saludables y ecol√≥gicos.',1),(_binary 'géìà∞\√4àé','Restauraci√≥n de Ecosistemas','Actividades para reparar da√±os ambientales en √°reas degradadas, mejorando la biodiversidad y la salud de los ecosistemas.',1),(_binary 'gé†à∞\√4àé','Talleres de Reciclaje','Programas educativos sobre la correcta separaci√≥n de residuos, el reciclaje creativo y la reutilizaci√≥n de materiales para reducir la contaminaci√≥n.',1),(_binary 'gé∞à∞\√4àé','Cuidado de R√≠os y Lagos','Limpieza y mantenimiento de cuerpos de agua para preservar su calidad, eliminar residuos y proteger las especies que habitan en ellos.',1),(_binary 'gé¬à∞\√4àé','Conservaci√≥n del Patrimonio Natural','Proyectos para proteger √°reas naturales emblem√°ticas, preservando su valor hist√≥rico, cultural y ambiental para futuras generaciones.',1);
/*!40000 ALTER TABLE `cbt_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cbt_certificates`
--

DROP TABLE IF EXISTS `cbt_certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cbt_certificates` (
  `certificate_id` binary(12) NOT NULL,
  `certificate_url` text NOT NULL,
  `event_id` binary(12) NOT NULL,
  PRIMARY KEY (`certificate_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `cbt_certificates_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `cbt_events` (`event_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cbt_certificates`
--

LOCK TABLES `cbt_certificates` WRITE;
/*!40000 ALTER TABLE `cbt_certificates` DISABLE KEYS */;
/*!40000 ALTER TABLE `cbt_certificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cbt_comments`
--

DROP TABLE IF EXISTS `cbt_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cbt_comments` (
  `comment_id` binary(12) NOT NULL,
  `content` text NOT NULL,
  `rating` int NOT NULL,
  `user_id` binary(12) NOT NULL,
  `event_id` binary(12) NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `cbt_comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `cbt_users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `cbt_comments_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `cbt_events` (`event_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cbt_comments`
--

LOCK TABLES `cbt_comments` WRITE;
/*!40000 ALTER TABLE `cbt_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `cbt_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cbt_event_registrations`
--

DROP TABLE IF EXISTS `cbt_event_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cbt_event_registrations` (
  `event_id` binary(12) NOT NULL,
  `volunteer_id` binary(12) NOT NULL,
  `attendance_status` enum('Registrado','Asistido','Cancelado') NOT NULL DEFAULT 'Registrado',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`,`volunteer_id`),
  KEY `volunteer_id` (`volunteer_id`),
  CONSTRAINT `cbt_event_registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `cbt_events` (`event_id`) ON UPDATE CASCADE,
  CONSTRAINT `cbt_event_registrations_ibfk_2` FOREIGN KEY (`volunteer_id`) REFERENCES `cbt_users` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cbt_event_registrations`
--

LOCK TABLES `cbt_event_registrations` WRITE;
/*!40000 ALTER TABLE `cbt_event_registrations` DISABLE KEYS */;
INSERT INTO `cbt_event_registrations` VALUES (_binary 'gS\"g}Q2å>',_binary 'gO\‹%>\÷xû|â','Registrado','2024-10-30 04:55:06','2024-10-30 04:55:06'),(_binary 'gS\"g}Q2å>',_binary 'g\Zm6\Ëæà_\”','Registrado','2024-10-24 19:43:44','2024-10-24 19:43:44'),(_binary 'gî\ƒ\≈WÑA\Œ\ˆ:L',_binary 'g\Zm6\Ëæà_\”','Registrado','2024-10-24 20:12:20','2024-10-24 20:12:20'),(_binary 'gî\ƒ\≈WÑA\Œ\ˆ:L',_binary 'g\Znw\Ëæà_\”','Registrado','2024-10-30 04:57:24','2024-10-30 04:57:24'),(_binary 'gî\ƒ\≈WÑA\Œ\ˆ:L',_binary 'g\Ë∑Zîø0∏\rÇ','Registrado','2024-10-28 01:30:27','2024-10-28 01:30:27'),(_binary 'gî\ƒ\≈WÑA\Œ\ˆ:L',_binary 'g\"$µó÷ñ\0\ıo˘','Registrado','2024-10-30 12:26:48','2024-10-30 12:26:48'),(_binary 'gî\ƒ\≈WÑA\Œ\ˆ:L',_binary 'g\",aó÷ñ\0\ıp','Registrado','2024-10-30 12:54:37','2024-10-30 12:54:37'),(_binary 'gî\ƒ\≈WÑA\Œ\ˆ:L',_binary 'g\"R∏ó÷ñ\0\ıp','Registrado','2024-10-30 15:41:35','2024-10-30 15:41:35'),(_binary 'g\Zk¨\Ëæà_\”',_binary 'g\Zm6\Ëæà_\”','Registrado','2024-10-24 22:08:05','2024-10-24 22:08:05'),(_binary 'g\Z\∆\∆e\ c˝=\Úà',_binary 'g\"$µó÷ñ\0\ıo˘','Registrado','2024-10-30 12:27:07','2024-10-30 12:27:07'),(_binary 'g\"T€ó÷ñ\0\ıp#',_binary 'g\"R∏ó÷ñ\0\ıp','Registrado','2024-10-30 15:51:53','2024-10-30 15:51:53'),(_binary 'g*|\»\–\‹<8à\"j',_binary 'g3\˜ôF]U!å&\Ê','Registrado','2024-11-13 12:12:08','2024-11-13 12:12:08'),(_binary 'g*|\»\–\‹<8à\"j',_binary 'g4ø^)g?\ÃÎ¢∏','Registrado','2024-11-13 15:12:45','2024-11-13 15:12:45'),(_binary 'g*|\»\–\‹<8à\"j',_binary 'g4\ıí\Ó\œu¯s\‚~','Registrado','2024-11-13 18:53:43','2024-11-13 18:53:43'),(_binary 'g3ˇ\›F]U!å&\Ê',_binary 'g3\˜ôF]U!å&\Ê','Cancelado','2024-11-13 12:17:40','2024-11-19 15:03:17'),(_binary 'g4\Û™\ﬂ\Õ\“$Æ\Â',_binary 'g4ø^)g?\ÃÎ¢∏','Registrado','2024-11-13 18:46:02','2024-11-13 18:46:02');
/*!40000 ALTER TABLE `cbt_event_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cbt_events`
--

DROP TABLE IF EXISTS `cbt_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cbt_events` (
  `event_id` binary(12) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `slug` varchar(255) NOT NULL,
  `date_time` datetime NOT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `banner` text,
  `relative_banner_url` text,
  `category_id` binary(12) NOT NULL,
  `status` enum('Programado','En Progreso','Finalizado','Cancelado') NOT NULL DEFAULT 'Programado',
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `organizer_id` binary(12) NOT NULL,
  `organization_id` binary(12) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `max_volunteers` int NOT NULL,
  `current_volunteers` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`event_id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `organizer_id` (`organizer_id`),
  KEY `organization_id` (`organization_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `cbt_events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `cbt_users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `cbt_events_ibfk_2` FOREIGN KEY (`organization_id`) REFERENCES `cbt_organizations` (`organization_id`) ON UPDATE CASCADE,
  CONSTRAINT `cbt_events_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `cbt_categories` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cbt_events`
--

LOCK TABLES `cbt_events` WRITE;
/*!40000 ALTER TABLE `cbt_events` DISABLE KEYS */;
INSERT INTO `cbt_events` VALUES (_binary 'gS\"g}Q2å>','Limpieza parque el country','Esta es la descripcion del evento limpieza del paque el country','limpieza-parque-el-country','2024-11-30 13:00:00','Parque El Country, Carrera 12, Bogot√°, 110121, Colombia',4.706396,-74.038217,'https://res.cloudinary.com/dinkcwwze/image/upload/v1729647366/event_banner/opjimzv2anau7wnaclph.webp','event_banner/opjimzv2anau7wnaclph',_binary 'gé†à∞\√4àé','Programado',1,_binary 'gO\‹%>\÷xû|â',_binary 'gO\€%>\÷xû|á','2024-10-23 01:36:07','2024-11-13 15:47:01',25,0),(_binary 'gî\ƒ\≈WÑA\Œ\ˆ:L','Limpieza plaza fundacional de suba','Limpieza del parque de la plaza fundacional de suba','limpieza-plaza-fundacional-de-suba','2024-11-24 18:30:00','Kr 81 146 06, 111156 Bogot√°, Colombia',4.741031,-74.083801,'https://res.cloudinary.com/dinkcwwze/image/upload/v1729729732/event_banner/rzsrxokauhjoxvzwt32w.webp','event_banner/rzsrxokauhjoxvzwt32w',_binary 'gPC%>\÷xû|ë','Programado',1,_binary 'gO\‹%>\÷xû|â',_binary 'gO\€%>\÷xû|á','2024-10-24 00:28:52','2024-11-13 15:48:24',30,0),(_binary 'g\Zk¨\Ëæà_\”','Charla educacion ambiental','Es una charla de educacion ambiental :b','charla-educacion-ambiental','2024-12-27 08:50:00','Calle 146 58c 50, 111156 Bogot√°, Colombia',4.732584,-74.065044,'https://res.cloudinary.com/dinkcwwze/image/upload/v1729784745/event_banner/gex0gxwawcutecolqcfg.webp','event_banner/gex0gxwawcutecolqcfg',_binary 'géHà∞\√4àç\Ì','Programado',1,_binary 'g\Zb\Á$ø{ô≤Ä[',_binary 'g\Zb\Ê$ø{ô≤ÄY','2024-10-24 15:45:48','2024-11-13 15:48:01',8,0),(_binary 'g\Z\∆\∆e\ c˝=\Úà','Reforestacion','Reforestaremos los parques','reforestacion','2025-01-04 15:00:00','V√≠a Embalse San Rafael, 251207 La Calera, Cundinamarca, Colombia',4.703861,-73.990950,'https://res.cloudinary.com/dinkcwwze/image/upload/v1729807898/event_banner/dvysqzb8lwueczz6uhee.webp','event_banner/dvysqzb8lwueczz6uhee',_binary 'gPW%>\÷xû|ó','Programado',1,_binary 'g\Zb\Á$ø{ô≤Ä[',_binary 'g\Zb\Ê$ø{ô≤ÄY','2024-10-24 22:11:41','2024-11-13 15:48:50',25,0),(_binary 'g\"T€ó÷ñ\0\ıp#','Visita quebrada la vieja','Visitaremos la quebrada de la vieja en la 72','visita-quebrada-la-vieja','2024-11-20 15:30:00','Avenida Carrera 9 123 36, 110111 Bogot√°, Colombia',4.700676,-74.032875,'https://res.cloudinary.com/dinkcwwze/image/upload/v1730303195/event_banner/ge3qdllohkyme47too5a.png','event_banner/ge3qdllohkyme47too5a',_binary 'gé^à∞\√4àç\Û','Programado',1,_binary 'g\Zb\Á$ø{ô≤Ä[',_binary 'g\Zb\Ê$ø{ô≤ÄY','2024-10-30 15:46:35','2024-11-13 15:47:24',12,0),(_binary 'g*|\»\–\‹<8à\"j','Este es otro eventos','Este es otro evento probando cupos maximos','este-es-otro-eventos','2024-11-22 15:10:00','Calle 128a 51 64, 111111 Bogot√°, Colombia',4.713793,-74.058614,'https://res.cloudinary.com/dinkcwwze/image/upload/v1730837530/event_banner/pm6jhjn2x8e9yqv0boir.jpg','event_banner/pm6jhjn2x8e9yqv0boir',_binary 'gPC%>\÷xû|ë','Programado',1,_binary 'g\Zb\Á$ø{ô≤Ä[',_binary 'g\Zb\Ê$ø{ô≤ÄY','2024-11-05 20:12:11','2024-11-13 18:53:43',20,2),(_binary 'g3ˇ\›F]U!å&\Ê','Reforestacion reserva Thomas Van der Hammel','Reforestacion de una reserva llamada thomas van der hammen en el norte de bogota','reforestacion-reserva-thomas-van-der-hammel','2024-11-30 11:20:00','Calle 223 54-32, 111166 Bogot√°, Colombia',4.802134,-74.048019,'https://res.cloudinary.com/dinkcwwze/image/upload/v1731461083/event_banner/pjaatqm2jknl8xzrobig.jpg','event_banner/pjaatqm2jknl8xzrobig',_binary 'gPW%>\÷xû|ó','Programado',1,_binary 'gO\‹%>\÷xû|â',_binary 'gO\€%>\÷xû|á','2024-11-13 01:24:45','2024-11-13 12:17:40',20,1),(_binary 'g4\Û™\ﬂ\Õ\“$Æ\Â','err','dadad','err','2024-11-14 05:48:00','Carrera 13a 127b 95, 110121 Bogot√°, Colombia',4.708771,-74.039825,'https://res.cloudinary.com/dinkcwwze/image/upload/v1731523495/event_banner/tdsbcl3b3w7dugsxdo2q.png','event_banner/tdsbcl3b3w7dugsxdo2q',_binary 'gPW%>\÷xû|ó','Programado',1,_binary 'g\Zb\Á$ø{ô≤Ä[',_binary 'g\Zb\Ê$ø{ô≤ÄY','2024-11-13 18:44:58','2024-11-13 18:46:04',2,2);
/*!40000 ALTER TABLE `cbt_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cbt_notifications`
--

DROP TABLE IF EXISTS `cbt_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cbt_notifications` (
  `notification_id` binary(12) NOT NULL,
  `user_id` binary(12) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `cbt_notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `cbt_users` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cbt_notifications`
--

LOCK TABLES `cbt_notifications` WRITE;
/*!40000 ALTER TABLE `cbt_notifications` DISABLE KEYS */;
INSERT INTO `cbt_notifications` VALUES (_binary 'gH\Á_ç=f\Ùµse',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Andres Meza | email: andresfmeza101@gmail.com | ID: 671848e75f8d3d66f4b57363',1,'2024-10-23 00:52:55','2024-10-23 01:19:22'),(_binary 'gH\Á_ç=f\Ùµsg',_binary 'gH\Á_ç=f\Ùµsc','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',1,'2024-10-23 00:52:55','2024-10-24 00:04:23'),(_binary 'gO%>\÷xû|Ö',_binary 'gH\Á_ç=f\Ùµsc','Perfil actualizado','Tu perfil ha sido actualizado exitosamente.',1,'2024-10-23 01:19:08','2024-10-23 01:19:24'),(_binary 'gO\‹%>\÷xû|ã',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Hernan Torres | email: andresoomax@gmail.com | ID: 67184fdc253ed6789e1b7c89',1,'2024-10-23 01:22:36','2024-10-23 01:44:09'),(_binary 'gO\‹%>\÷xû|ç',_binary 'gO\‹%>\÷xû|â','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',0,'2024-10-23 01:22:36','2024-10-23 01:22:36'),(_binary 'gO\‹%>\÷xû|è',_binary 'gO\‹%>\÷xû|â','Nuevo miembro de organizaci√≥n','Has sido a√±adido como miembro a la organizaci√≥n \"Chibata Test\".',0,'2024-10-23 01:22:36','2024-10-23 01:22:36'),(_binary 'gPC%>\÷xû|ì',_binary 'gH\Á_ç=f\Ùµsc','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Limpieza\". ¬°Explora nuevos eventos en esta categor√≠a!',1,'2024-10-23 01:24:19','2024-10-23 01:44:07'),(_binary 'gPC%>\÷xû|ï',_binary 'gO\‹%>\÷xû|â','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Limpieza\". ¬°Explora nuevos eventos en esta categor√≠a!',0,'2024-10-23 01:24:19','2024-10-23 01:24:19'),(_binary 'gPW%>\÷xû|ô',_binary 'gH\Á_ç=f\Ùµsc','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Reforestacion\". ¬°Explora nuevos eventos en esta categor√≠a!',1,'2024-10-23 01:24:39','2024-10-23 01:44:05'),(_binary 'gPW%>\÷xû|õ',_binary 'gO\‹%>\÷xû|â','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Reforestacion\". ¬°Explora nuevos eventos en esta categor√≠a!',0,'2024-10-23 01:24:39','2024-10-23 01:24:39'),(_binary 'gS\"g}Q2å@',_binary 'gH\Á_ç=f\Ùµsc','Nuevo evento creado','Se ha creado un nuevo evento: \"Limpieza parque el country\". ¬°Rev√≠salo y reg√≠strate si est√°s interesado!',1,'2024-10-23 01:36:07','2024-10-23 01:44:03'),(_binary 'géHà∞\√4àç\Ô',_binary 'gH\Á_ç=f\Ùµsc','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Educaci√≥n Ambiental\". ¬°Explora nuevos eventos en esta categor√≠a!',1,'2024-10-24 00:01:12','2024-10-24 00:12:23'),(_binary 'géHà∞\√4àç\Ò',_binary 'gO\‹%>\÷xû|â','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Educaci√≥n Ambiental\". ¬°Explora nuevos eventos en esta categor√≠a!',0,'2024-10-24 00:01:12','2024-10-24 00:01:12'),(_binary 'gé^à∞\√4àç\ı',_binary 'gH\Á_ç=f\Ùµsc','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Eco-turismo\". ¬°Explora nuevos eventos en esta categor√≠a!',1,'2024-10-24 00:01:34','2024-10-24 00:12:25'),(_binary 'gé^à∞\√4àç\˜',_binary 'gO\‹%>\÷xû|â','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Eco-turismo\". ¬°Explora nuevos eventos en esta categor√≠a!',0,'2024-10-24 00:01:34','2024-10-24 00:01:34'),(_binary 'génà∞\√4àç˚',_binary 'gH\Á_ç=f\Ùµsc','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Conservaci√≥n de Fauna\". ¬°Explora nuevos eventos en esta categor√≠a!',1,'2024-10-24 00:01:50','2024-10-24 00:12:28'),(_binary 'génà∞\√4àç˝',_binary 'gO\‹%>\÷xû|â','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Conservaci√≥n de Fauna\". ¬°Explora nuevos eventos en esta categor√≠a!',0,'2024-10-24 00:01:50','2024-10-24 00:01:50'),(_binary 'gé|à∞\√4àé',_binary 'gH\Á_ç=f\Ùµsc','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Huertos Comunitarios\". ¬°Explora nuevos eventos en esta categor√≠a!',1,'2024-10-24 00:02:04','2024-10-24 00:12:30'),(_binary 'gé|à∞\√4àé',_binary 'gO\‹%>\÷xû|â','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Huertos Comunitarios\". ¬°Explora nuevos eventos en esta categor√≠a!',0,'2024-10-24 00:02:04','2024-10-24 00:02:04'),(_binary 'géìà∞\√4àé',_binary 'gH\Á_ç=f\Ùµsc','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Restauraci√≥n de Ecosistemas\". ¬°Explora nuevos eventos en esta categor√≠a!',1,'2024-10-24 00:02:27','2024-10-24 00:12:32'),(_binary 'géìà∞\√4àé	',_binary 'gO\‹%>\÷xû|â','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Restauraci√≥n de Ecosistemas\". ¬°Explora nuevos eventos en esta categor√≠a!',0,'2024-10-24 00:02:27','2024-10-24 00:02:27'),(_binary 'gé†à∞\√4àé\r',_binary 'gH\Á_ç=f\Ùµsc','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Talleres de Reciclaje\". ¬°Explora nuevos eventos en esta categor√≠a!',1,'2024-10-24 00:02:40','2024-10-24 00:12:34'),(_binary 'gé†à∞\√4àé',_binary 'gO\‹%>\÷xû|â','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Talleres de Reciclaje\". ¬°Explora nuevos eventos en esta categor√≠a!',0,'2024-10-24 00:02:40','2024-10-24 00:02:40'),(_binary 'gé∞à∞\√4àé',_binary 'gH\Á_ç=f\Ùµsc','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Cuidado de R√≠os y Lagos\". ¬°Explora nuevos eventos en esta categor√≠a!',1,'2024-10-24 00:02:56','2024-10-24 00:12:36'),(_binary 'gé∞à∞\√4àé',_binary 'gO\‹%>\÷xû|â','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Cuidado de R√≠os y Lagos\". ¬°Explora nuevos eventos en esta categor√≠a!',0,'2024-10-24 00:02:56','2024-10-24 00:02:56'),(_binary 'gé¬à∞\√4àé',_binary 'gH\Á_ç=f\Ùµsc','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Conservaci√≥n del Patrimonio Natural\". ¬°Explora nuevos eventos en esta categor√≠a!',1,'2024-10-24 00:03:14','2024-10-24 00:12:38'),(_binary 'gé¬à∞\√4àé',_binary 'gO\‹%>\÷xû|â','Nueva categor√≠a disponible','Se ha a√±adido una nueva categor√≠a: \"Conservaci√≥n del Patrimonio Natural\". ¬°Explora nuevos eventos en esta categor√≠a!',0,'2024-10-24 00:03:14','2024-10-24 00:03:14'),(_binary 'géÌà∞\√4àé',_binary 'gH\Á_ç=f\Ùµsc','Perfil actualizado','Tu perfil ha sido actualizado exitosamente.',1,'2024-10-24 00:03:57','2024-10-24 00:12:40'),(_binary 'gî\ƒ\≈WÑA\Œ\ˆ:N',_binary 'gH\Á_ç=f\Ùµsc','Nuevo evento creado','Se ha creado un nuevo evento: \"Limpieza plaza fundacional de suba\". ¬°Rev√≠salo y reg√≠strate si est√°s interesado!',1,'2024-10-24 00:28:52','2024-10-30 04:42:58'),(_binary 'g\Zb\Ë$ø{ô≤Ä]',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Marshall  Gallo | email: daniel@gmail.com | ID: 671a62e71d24bf7b99b2805b',0,'2024-10-24 15:08:24','2024-10-24 15:08:24'),(_binary 'g\Zb\Ë$ø{ô≤Ä_',_binary 'g\Zb\Á$ø{ô≤Ä[','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',0,'2024-10-24 15:08:24','2024-10-24 15:08:24'),(_binary 'g\Zb\È$ø{ô≤Äa',_binary 'g\Zb\Á$ø{ô≤Ä[','Nuevo miembro de organizaci√≥n','Has sido a√±adido como miembro a la organizaci√≥n \"ABC Logistics\".',0,'2024-10-24 15:08:25','2024-10-28 00:35:56'),(_binary 'g\Zk¨\Ëæà_\”	',_binary 'gH\Á_ç=f\Ùµsc','Nuevo evento creado','Se ha creado un nuevo evento: \"Charla educacion ambiental\". ¬°Rev√≠salo y reg√≠strate si est√°s interesado!',0,'2024-10-24 15:45:48','2024-10-24 15:45:48'),(_binary 'g\Zm6\Ëæà_\”\r',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Dylan Gallo | email: dylan@gmail.com | ID: 671a6d36e8be11885f1bd30b',0,'2024-10-24 15:52:22','2024-10-24 15:52:22'),(_binary 'g\Zm7\Ëæà_\”',_binary 'g\Zm6\Ëæà_\”','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',0,'2024-10-24 15:52:23','2024-10-24 15:52:23'),(_binary 'g\Znx\Ëæà_\”',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Danner Arias | email: danner@gmail.com | ID: 671a6e77e8be11885f1bd311',0,'2024-10-24 15:57:44','2024-10-24 15:57:44'),(_binary 'g\Znx\Ëæà_\”',_binary 'g\Znw\Ëæà_\”','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',1,'2024-10-24 15:57:44','2024-10-30 04:57:09'),(_binary 'g\Zo\Ò\Ëæà_\”',_binary 'g\Zm6\Ëæà_\”','Perfil actualizado','Tu perfil ha sido actualizado exitosamente.',0,'2024-10-24 16:04:01','2024-10-24 16:04:01'),(_binary 'g\Z£qíHz7gBûa',_binary 'g\Zm6\Ëæà_\”','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Limpieza parque el country\".',0,'2024-10-24 19:43:45','2024-10-24 19:43:45'),(_binary 'g\Z™%\n&B±6±',_binary 'g\Zm6\Ëæà_\”','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Limpieza plaza fundacional de suba\".',0,'2024-10-24 20:12:21','2024-10-24 20:12:21'),(_binary 'g\Z\≈E\∆e\ c˝=\ÚÜ',_binary 'g\Zm6\Ëæà_\”','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Charla educacion ambiental\".',0,'2024-10-24 22:08:05','2024-10-24 22:08:05'),(_binary 'g\Z\∆\∆e\ c˝=\Úä',_binary 'gH\Á_ç=f\Ùµsc','Nuevo evento creado','Se ha creado un nuevo evento: \"Reforestacion\". ¬°Rev√≠salo y reg√≠strate si est√°s interesado!',0,'2024-10-24 22:11:42','2024-10-24 22:11:42'),(_binary 'g\ÁúZîø0∏\rÄ',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Charla educacion ambiental\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-10-28 01:23:40','2024-10-28 01:23:40'),(_binary 'g\Ë∏Zîø0∏\rÑ',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Ximena G√ºiza | email: Ximenita_1206@outlook.es | ID: 671ee8b75a94bf0130b80d82',0,'2024-10-28 01:28:24','2024-10-28 01:28:24'),(_binary 'g\Ë∏Zîø0∏\rÜ',_binary 'g\Ë∑Zîø0∏\rÇ','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',0,'2024-10-28 01:28:24','2024-10-28 01:28:24'),(_binary 'g\È4Zîø0∏\rà',_binary 'g\Ë∑Zîø0∏\rÇ','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Limpieza plaza fundacional de suba\".',0,'2024-10-28 01:30:28','2024-10-29 23:48:04'),(_binary 'g!õ0,∫ÜVá_…≠',_binary 'gH\Á_ç=f\Ùµsc','Contrase√±a cambiada','Tu contrase√±a ha sido cambiada exitosamente. Si no realizaste este cambio, por favor contacta con soporte.',1,'2024-10-30 02:34:24','2024-11-12 17:52:28'),(_binary 'g!π!gdæ\01ºw',_binary 'gH\Á_ç=f\Ùµsc','Contrase√±a cambiada','Tu contrase√±a ha sido cambiada exitosamente. Si no realizaste este cambio, por favor contacta con soporte.',1,'2024-10-30 04:42:09','2024-11-12 17:52:26'),(_binary 'g!ª€≥#\0ö\Òº',_binary 'gH\Á_ç=f\Ùµsc','Contrase√±a cambiada','Tu contrase√±a ha sido cambiada exitosamente. Si no realizaste este cambio, por favor contacta con soporte.',0,'2024-10-30 04:53:47','2024-10-30 04:53:47'),(_binary 'g!º≥#\0ö\Òæ',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza plaza fundacional de suba\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-10-30 04:54:42','2024-10-30 04:54:42'),(_binary 'g!º≥#\0ö\Ò¿',_binary 'g\Ë∑Zîø0∏\rÇ','Recordatorio de evento','El evento \"Limpieza plaza fundacional de suba\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-10-30 04:54:42','2024-10-30 04:54:42'),(_binary 'g!º*≥#\0ö\Ò\¬',_binary 'gO\‹%>\÷xû|â','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Limpieza parque el country\".',0,'2024-10-30 04:55:06','2024-10-30 04:55:06'),(_binary 'g!º¥≥#\0ö\Ò\ƒ',_binary 'g\Znw\Ëæà_\”','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Limpieza plaza fundacional de suba\".',0,'2024-10-30 04:57:24','2024-10-30 04:57:24'),(_binary 'g\"$∂ó÷ñ\0\ıo˚',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Johan Alexix Orostegui Audor | email: aorostegui2@gmail.com | ID: 672224b597d696000ff56ff9',0,'2024-10-30 12:21:10','2024-10-30 12:21:10'),(_binary 'g\"$∂ó÷ñ\0\ıo˝',_binary 'g\"$µó÷ñ\0\ıo˘','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',0,'2024-10-30 12:21:10','2024-10-30 12:21:10'),(_binary 'g\"%Jó÷ñ\0\ıoˇ',_binary 'g\"$µó÷ñ\0\ıo˘','Contrase√±a cambiada','Tu contrase√±a ha sido cambiada exitosamente. Si no realizaste este cambio, por favor contacta con soporte.',0,'2024-10-30 12:23:38','2024-10-30 12:23:38'),(_binary 'g\"&ó÷ñ\0\ıp',_binary 'g\"$µó÷ñ\0\ıo˘','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Limpieza plaza fundacional de suba\".',0,'2024-10-30 12:26:48','2024-10-30 12:26:48'),(_binary 'g\"&ó÷ñ\0\ıp',_binary 'g\"$µó÷ñ\0\ıo˘','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Reforestacion\".',0,'2024-10-30 12:27:07','2024-10-30 12:27:07'),(_binary 'g\",aó÷ñ\0\ıp',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Karol Valentina Sierra Diaz | email: karitomfvj12@gmail.com | ID: 67222c6197d696000ff57005',0,'2024-10-30 12:53:53','2024-10-30 12:53:53'),(_binary 'g\",aó÷ñ\0\ıp	',_binary 'g\",aó÷ñ\0\ıp','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',0,'2024-10-30 12:53:53','2024-10-30 12:53:53'),(_binary 'g\",çó÷ñ\0\ıp',_binary 'g\",aó÷ñ\0\ıp','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Limpieza plaza fundacional de suba\".',0,'2024-10-30 12:54:37','2024-10-30 12:54:37'),(_binary 'g\",™ó÷ñ\0\ıp\r',_binary 'g\",aó÷ñ\0\ıp','Perfil actualizado','Tu perfil ha sido actualizado exitosamente.',0,'2024-10-30 12:55:06','2024-10-30 12:55:06'),(_binary 'g\"-kó÷ñ\0\ıp',_binary 'g\",aó÷ñ\0\ıp','Contrase√±a cambiada','Tu contrase√±a ha sido cambiada exitosamente. Si no realizaste este cambio, por favor contacta con soporte.',0,'2024-10-30 12:58:19','2024-10-30 12:58:19'),(_binary 'g\".Pó÷ñ\0\ıp',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Andres Suarez | email: andresfelipe@gmail.com | ID: 67222e5097d696000ff57013',0,'2024-10-30 13:02:08','2024-10-30 13:02:08'),(_binary 'g\".Pó÷ñ\0\ıp',_binary 'g\".Pó÷ñ\0\ıp','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',0,'2024-10-30 13:02:08','2024-10-30 13:02:08'),(_binary 'g\"R∏ó÷ñ\0\ıp',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Carolina  Forero | email: cforeros2024@gmail.com | ID: 672252b897d696000ff5701b',0,'2024-10-30 15:37:28','2024-10-30 15:37:28'),(_binary 'g\"R∏ó÷ñ\0\ıp',_binary 'g\"R∏ó÷ñ\0\ıp','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',0,'2024-10-30 15:37:28','2024-10-30 15:37:28'),(_binary 'g\"SØó÷ñ\0\ıp!',_binary 'g\"R∏ó÷ñ\0\ıp','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Limpieza plaza fundacional de suba\".',0,'2024-10-30 15:41:35','2024-10-30 15:41:35'),(_binary 'g\"T€ó÷ñ\0\ıp%',_binary 'gH\Á_ç=f\Ùµsc','Nuevo evento creado','Se ha creado un nuevo evento: \"Visita quebrada la vieja\". ¬°Rev√≠salo y reg√≠strate si est√°s interesado!',0,'2024-10-30 15:46:35','2024-10-30 15:46:35'),(_binary 'g\"Vó÷ñ\0\ıp\'',_binary 'g\"R∏ó÷ñ\0\ıp','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Visita quebrada la vieja\".',0,'2024-10-30 15:51:53','2024-10-30 15:51:53'),(_binary 'g\"W%ó÷ñ\0\ıp)',_binary 'g\"R∏ó÷ñ\0\ıp','Contrase√±a cambiada','Tu contrase√±a ha sido cambiada exitosamente. Si no realizaste este cambio, por favor contacta con soporte.',0,'2024-10-30 15:56:21','2024-10-30 15:56:21'),(_binary 'g*|\»\–\‹<8à\"l',_binary 'gH\Á_ç=f\Ùµsc','Nuevo evento creado','Se ha creado un nuevo evento: \"Este es otro eventos\". ¬°Rev√≠salo y reg√≠strate si est√°s interesado!',1,'2024-11-05 20:12:12','2024-11-12 17:49:50'),(_binary 'g+kˇó÷ñ\0\ıp-',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Jhon Cufi√±o | email: jhon15cufi@gmail.com | ID: 672b6bff97d696000ff5702b',1,'2024-11-06 13:15:43','2024-11-12 17:49:47'),(_binary 'g+kˇó÷ñ\0\ıp/',_binary 'g+kˇó÷ñ\0\ıp+','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',0,'2024-11-06 13:15:43','2024-11-06 13:15:43'),(_binary 'g3\ÛY\ÿL+3</πY',_binary 'gO\‹%>\÷xû|â','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:31:21','2024-11-13 00:31:21'),(_binary 'g3\ÛY\ÿL+3</π[',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:31:21','2024-11-13 00:31:21'),(_binary 'g3\Ù)\ÿL+3</π]',_binary 'gO\‹%>\÷xû|â','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:34:49','2024-11-13 00:34:49'),(_binary 'g3\Ù)\ÿL+3</π_',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:34:49','2024-11-13 00:34:49'),(_binary 'g3\ÙO\ÿL+3</πa',_binary 'gO\‹%>\÷xû|â','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:35:27','2024-11-13 00:35:27'),(_binary 'g3\ÙO\ÿL+3</πc',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:35:27','2024-11-13 00:35:27'),(_binary 'g3\Ùå\ÿL+3</πe',_binary 'gO\‹%>\÷xû|â','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:36:28','2024-11-13 00:36:28'),(_binary 'g3\Ùå\ÿL+3</πg',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:36:28','2024-11-13 00:36:28'),(_binary 'g3\Ùî\ÿL+3</πi',_binary 'gO\‹%>\÷xû|â','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:36:36','2024-11-13 00:36:36'),(_binary 'g3\Ùî\ÿL+3</πk',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:36:36','2024-11-13 00:36:36'),(_binary 'g3\Ùù\ÿL+3</πm',_binary 'gO\‹%>\÷xû|â','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:36:45','2024-11-13 00:36:45'),(_binary 'g3\Ùù\ÿL+3</πo',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:36:45','2024-11-13 00:36:45'),(_binary 'g3\ı ó≤>=T\Õ¿',_binary 'gO\‹%>\÷xû|â','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:38:56','2024-11-13 00:38:56'),(_binary 'g3\ı ó≤>=T\Õ\¬',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:38:56','2024-11-13 00:38:56'),(_binary 'g3\ı\'ó≤>=T\Õ\ƒ',_binary 'gO\‹%>\÷xû|â','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:39:03','2024-11-13 00:39:03'),(_binary 'g3\ı\'ó≤>=T\Õ\∆',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 00:39:03','2024-11-13 00:39:03'),(_binary 'g3\˜öF]U!å&\Ê',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Jhon Doe | email: jhondoe@gmail.com | ID: 6733f799465d55218c26e605',1,'2024-11-13 00:49:30','2024-11-13 15:23:45'),(_binary 'g3\˜öF]U!å&\Ê	',_binary 'g3\˜ôF]U!å&\Ê','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',1,'2024-11-13 00:49:30','2024-11-13 15:23:26'),(_binary 'g3˛\√F]U!å&\Ê',_binary 'gO\‹%>\÷xû|â','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',1,'2024-11-13 01:20:03','2024-11-13 15:51:57'),(_binary 'g3˛\√F]U!å&\Ê\r',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 01:20:03','2024-11-13 01:20:03'),(_binary 'g3˛\∆F]U!å&\Ê',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza plaza fundacional de suba\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 01:20:06','2024-11-13 01:20:06'),(_binary 'g3˛\∆F]U!å&\Ê',_binary 'g\Znw\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza plaza fundacional de suba\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 01:20:06','2024-11-13 01:20:06'),(_binary 'g3˛\∆F]U!å&\Ê',_binary 'g\Ë∑Zîø0∏\rÇ','Recordatorio de evento','El evento \"Limpieza plaza fundacional de suba\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 01:20:06','2024-11-13 01:20:06'),(_binary 'g3˛\∆F]U!å&\Ê',_binary 'g\"$µó÷ñ\0\ıo˘','Recordatorio de evento','El evento \"Limpieza plaza fundacional de suba\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 01:20:06','2024-11-13 01:20:06'),(_binary 'g3˛\∆F]U!å&\Ê',_binary 'g\",aó÷ñ\0\ıp','Recordatorio de evento','El evento \"Limpieza plaza fundacional de suba\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 01:20:06','2024-11-13 01:20:06'),(_binary 'g3˛\∆F]U!å&\Ê',_binary 'g\"R∏ó÷ñ\0\ıp','Recordatorio de evento','El evento \"Limpieza plaza fundacional de suba\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 01:20:06','2024-11-13 01:20:06'),(_binary 'g3ˇ\›F]U!å&\Ê',_binary 'gH\Á_ç=f\Ùµsc','Nuevo evento creado','Se ha creado un nuevo evento: \"Reforestacion reserva Thomas Van der Hammel\". ¬°Rev√≠salo y reg√≠strate si est√°s interesado!',1,'2024-11-13 01:24:45','2024-11-13 15:23:44'),(_binary 'g4óô\ıVˇ2H[T\√',_binary 'g3\˜ôF]U!å&\Ê','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Este es otro eventos\".',1,'2024-11-13 12:12:09','2024-11-13 15:23:25'),(_binary 'g4ò\‰\Ò≠>+\‹Hß&',_binary 'g3\˜ôF]U!å&\Ê','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Reforestacion reserva Thomas Van der Hammel\".',1,'2024-11-13 12:17:40','2024-11-13 15:23:24'),(_binary 'g4ø_)g?\ÃÎ¢∫',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Danna Cardozo | email: danna.valentina070707@gmail.com | ID: 6734bf5e2906673fcceba2b8',1,'2024-11-13 15:01:51','2024-11-13 15:23:42'),(_binary 'g4ø`)g?\ÃÎ¢º',_binary 'g4ø^)g?\ÃÎ¢∏','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',0,'2024-11-13 15:01:52','2024-11-13 15:01:52'),(_binary 'g4¡\Ì)g?\ÃÎ¢æ',_binary 'g4ø^)g?\ÃÎ¢∏','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Este es otro eventos\".',0,'2024-11-13 15:12:45','2024-11-13 15:12:45'),(_binary 'g4\…1r\Èì:0(',_binary 'g\"R∏ó÷ñ\0\ıp','Recordatorio de evento','El evento \"Visita quebrada la vieja\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 15:43:45','2024-11-13 15:43:45'),(_binary 'g4\…Tr\Èì:0(',_binary 'gO\‹%>\÷xû|â','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',1,'2024-11-13 15:44:20','2024-11-13 15:51:56'),(_binary 'g4\…Tr\Èì:0( ',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 15:44:20','2024-11-13 15:44:20'),(_binary 'g4\…Zr\Èì:0(\"',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Charla educacion ambiental\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 15:44:26','2024-11-13 15:44:26'),(_binary 'g4\…xr\Èì:0($',_binary 'gO\‹%>\÷xû|â','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',1,'2024-11-13 15:44:56','2024-11-13 15:51:45'),(_binary 'g4\…xr\Èì:0(&',_binary 'g\Zm6\Ëæà_\”','Recordatorio de evento','El evento \"Limpieza parque el country\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 15:44:56','2024-11-13 15:44:56'),(_binary 'g4\Û´\ﬂ\Õ\“$Æ\Á',_binary 'gH\Á_ç=f\Ùµsc','Nuevo evento creado','Se ha creado un nuevo evento: \"err\". ¬°Rev√≠salo y reg√≠strate si est√°s interesado!',1,'2024-11-13 18:44:59','2024-11-19 14:22:34'),(_binary 'g4\Û\Í\ﬂ\Õ\“$Æ\È',_binary 'g4ø^)g?\ÃÎ¢∏','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"err\".',0,'2024-11-13 18:46:02','2024-11-13 18:46:02'),(_binary 'g4\Û\Î\ﬂ\Õ\“$Æ\Î',_binary 'g4ø^)g?\ÃÎ¢∏','Recordatorio de evento','El evento \"err\" comenzar√° pronto. ¬°No olvides asistir!',0,'2024-11-13 18:46:03','2024-11-13 18:46:03'),(_binary 'g4\ıí\Ó\œu¯s\‚Ä',_binary 'gH\Á_ç=f\Ùµsc','Nueva cuenta creada!','Una nueva cuenta se ha registrado: nombre: Carlos Martinez | email: carlos@gmail.com | ID: 6734f592eecf7504f873e27e',1,'2024-11-13 18:53:06','2024-11-19 14:22:32'),(_binary 'g4\ıì\Ó\œu¯s\‚Ç',_binary 'g4\ıí\Ó\œu¯s\‚~','Bienvenido a Chibata','¬°Gracias por unirte a nuestra plataforma! Esperamos que tengas una excelente experiencia.',0,'2024-11-13 18:53:07','2024-11-13 18:53:07'),(_binary 'g4\ı∏\Ó\œu¯s\‚Ñ',_binary 'g4\ıí\Ó\œu¯s\‚~','Confirmaci√≥n de registro','Te has registrado exitosamente para el evento \"Este es otro eventos\".',0,'2024-11-13 18:53:44','2024-11-13 18:53:44'),(_binary 'g<¶[\„s∫@år\◊',_binary 'g3\˜ôF]U!å&\Ê','Cambio de estado de asistencia','Tu estado de asistencia para el evento \"Reforestacion reserva Thomas Van der Hammel\" ha cambiado a Asistido.',0,'2024-11-19 14:53:15','2024-11-19 14:53:15'),(_binary 'g<ßW\„s∫@år\Ÿ',_binary 'g3\˜ôF]U!å&\Ê','Cambio de estado de asistencia','Tu estado de asistencia para el evento \"Reforestacion reserva Thomas Van der Hammel\" ha cambiado a Cancelado.',0,'2024-11-19 14:57:27','2024-11-19 14:57:27'),(_binary 'g<ß]\„s∫@år\€',_binary 'g3\˜ôF]U!å&\Ê','Cambio de estado de asistencia','Tu estado de asistencia para el evento \"Reforestacion reserva Thomas Van der Hammel\" ha cambiado a Asistido.',0,'2024-11-19 14:57:33','2024-11-19 14:57:33'),(_binary 'g<®\„s∫@år\›',_binary 'g3\˜ôF]U!å&\Ê','Cambio de estado de asistencia','Tu estado de asistencia para el evento \"Reforestacion reserva Thomas Van der Hammel\" ha cambiado a Registrado.',0,'2024-11-19 15:00:32','2024-11-19 15:00:32'),(_binary 'g<®∂\„s∫@år\ﬂ',_binary 'g3\˜ôF]U!å&\Ê','Cambio de estado de asistencia','Tu estado de asistencia para el evento \"Reforestacion reserva Thomas Van der Hammel\" ha cambiado a Cancelado.',0,'2024-11-19 15:03:18','2024-11-19 15:03:18');
/*!40000 ALTER TABLE `cbt_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cbt_organization_members`
--

DROP TABLE IF EXISTS `cbt_organization_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cbt_organization_members` (
  `organization_id` binary(12) NOT NULL,
  `member_id` binary(12) NOT NULL,
  `role_in` enum('Representante','Organizador') NOT NULL DEFAULT 'Representante',
  PRIMARY KEY (`organization_id`,`member_id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `cbt_organization_members_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `cbt_organizations` (`organization_id`) ON UPDATE CASCADE,
  CONSTRAINT `cbt_organization_members_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `cbt_users` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cbt_organization_members`
--

LOCK TABLES `cbt_organization_members` WRITE;
/*!40000 ALTER TABLE `cbt_organization_members` DISABLE KEYS */;
INSERT INTO `cbt_organization_members` VALUES (_binary 'gO\€%>\÷xû|á',_binary 'gO\‹%>\÷xû|â','Representante'),(_binary 'g\Zb\Ê$ø{ô≤ÄY',_binary 'g\Zb\Á$ø{ô≤Ä[','Representante');
/*!40000 ALTER TABLE `cbt_organization_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cbt_organizations`
--

DROP TABLE IF EXISTS `cbt_organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cbt_organizations` (
  `organization_id` binary(12) NOT NULL,
  `name` varchar(255) NOT NULL,
  `nit` varchar(30) NOT NULL,
  `logo` text,
  `relative_logo_url` text,
  `address` varchar(255) NOT NULL,
  `founding_date` date NOT NULL,
  `contact_number` bigint NOT NULL,
  `website` text,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`organization_id`),
  UNIQUE KEY `nit` (`nit`),
  UNIQUE KEY `contact_number` (`contact_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cbt_organizations`
--

LOCK TABLES `cbt_organizations` WRITE;
/*!40000 ALTER TABLE `cbt_organizations` DISABLE KEYS */;
INSERT INTO `cbt_organizations` VALUES (_binary 'gO\€%>\÷xû|á','Chibata Test','123456789','https://res.cloudinary.com/dinkcwwze/image/upload/v1729646555/organization_logo/wve8ck0nteerx0im7nab.png','organization_logo/wve8ck0nteerx0im7nab','calle 2 falsa','2024-09-12',3102588565,'https://chiabtatest.com',1,'2024-10-23 01:22:35','2024-10-23 01:22:35'),(_binary 'g\Zb\Ê$ø{ô≤ÄY','ABC Logistics','741258963','https://res.cloudinary.com/dinkcwwze/image/upload/v1729782500/organization_logo/pr6lkdodrr4hilcyb98b.webp','organization_logo/pr6lkdodrr4hilcyb98b','Parque industrial portos int 23','1988-12-10',3193272434,'https://abcLogistics.com',1,'2024-10-24 15:08:22','2024-10-24 15:08:22');
/*!40000 ALTER TABLE `cbt_organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cbt_roles`
--

DROP TABLE IF EXISTS `cbt_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cbt_roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `path` varchar(40) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cbt_roles`
--

LOCK TABLES `cbt_roles` WRITE;
/*!40000 ALTER TABLE `cbt_roles` DISABLE KEYS */;
INSERT INTO `cbt_roles` VALUES (1,'Administrador','/admin'),(2,'Organizador','/organizer'),(3,'Voluntario','/volunteer');
/*!40000 ALTER TABLE `cbt_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cbt_user_certificates`
--

DROP TABLE IF EXISTS `cbt_user_certificates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cbt_user_certificates` (
  `user_id` binary(12) NOT NULL,
  `certificate_id` binary(12) NOT NULL,
  PRIMARY KEY (`user_id`,`certificate_id`),
  KEY `certificate_id` (`certificate_id`),
  CONSTRAINT `cbt_user_certificates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `cbt_users` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `cbt_user_certificates_ibfk_2` FOREIGN KEY (`certificate_id`) REFERENCES `cbt_certificates` (`certificate_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cbt_user_certificates`
--

LOCK TABLES `cbt_user_certificates` WRITE;
/*!40000 ALTER TABLE `cbt_user_certificates` DISABLE KEYS */;
/*!40000 ALTER TABLE `cbt_user_certificates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cbt_users`
--

DROP TABLE IF EXISTS `cbt_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cbt_users` (
  `user_id` binary(12) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `doc_type` enum('CC','CE','PA') NOT NULL,
  `doc_num` bigint NOT NULL,
  `phone_number` bigint NOT NULL,
  `pass` varchar(255) NOT NULL,
  `avatar` text,
  `relative_avatar_url` text,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `role_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `doc_num` (`doc_num`),
  UNIQUE KEY `phone_number` (`phone_number`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `cbt_users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `cbt_roles` (`role_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cbt_users`
--

LOCK TABLES `cbt_users` WRITE;
/*!40000 ALTER TABLE `cbt_users` DISABLE KEYS */;
INSERT INTO `cbt_users` VALUES (_binary 'gH\Á_ç=f\Ùµsc','Andres','Meza','andresfmeza101@gmail.com','CC',1117964715,3223521165,'$2b$10$F2LIqnWk6AbScPv2ZOYbBeHkLylo.abhzReSI8Oh2pMdir7Z19S/.','https://res.cloudinary.com/dinkcwwze/image/upload/v1729728236/user_avatar/kke3uw6hj6by94mrcv99.jpg','user_avatar/kke3uw6hj6by94mrcv99',1,1,'2024-10-23 00:52:55','2024-11-12 19:49:34'),(_binary 'gO\‹%>\÷xû|â','Hernan','Torres','andresoomax@gmail.com','CC',1006527086,3178702683,'$2b$10$9zYqyY8a9KTvZ.b5bQk6u.X9jN2/..C.h0Qz3OYnrdP4Y0uSCAnjK','https://res.cloudinary.com/dinkcwwze/image/upload/v1729646556/user_avatar/kngivmhqwbsrc50kn5vf.jpg','user_avatar/kngivmhqwbsrc50kn5vf',1,2,'2024-10-23 01:22:36','2024-11-12 19:45:28'),(_binary 'g\Zb\Á$ø{ô≤Ä[','Marshall ','Gallo','daniel@gmail.com','CC',1019028401,3193272427,'$2b$10$5uyAV40PBnnF/pBn.85MPOsPmiro5aVY7BUiHOy1/IvkvoU8h8/Am','https://res.cloudinary.com/dinkcwwze/image/upload/v1729782502/user_avatar/ztmzkgwxesvjhsmotonz.jpg','user_avatar/ztmzkgwxesvjhsmotonz',1,2,'2024-10-24 15:08:23','2024-11-12 19:42:13'),(_binary 'g\Zm6\Ëæà_\”','Dylan','Gallo','dylan@gmail.com','CC',1245785896,3102589654,'$2b$10$ogaSNWWBhW1ICyGJJW7qBuZHZRQFqQbXhNfgUfucGnc0WYWy7pq16','https://res.cloudinary.com/dinkcwwze/image/upload/v1729785840/user_avatar/wkyzvw3ajpit8c6avep0.webp','user_avatar/wkyzvw3ajpit8c6avep0',1,3,'2024-10-24 15:52:22','2024-10-24 16:04:00'),(_binary 'g\Znw\Ëæà_\”','Danner','Arias','danner@gmail.com','CC',10025869536,3102365484,'$2b$10$H0PKJTZDHf3zk1uFV93pE.mq.BpBAPHuVYuy6y/nKyMQstCirEoXa','https://res.cloudinary.com/dinkcwwze/image/upload/v1729785461/user_avatar/bxtqiix9oujw3isrj1om.webp','user_avatar/bxtqiix9oujw3isrj1om',1,3,'2024-10-24 15:57:44','2024-10-24 15:57:44'),(_binary 'g\Ë∑Zîø0∏\rÇ','Ximena','G√ºiza','Ximenita_1206@outlook.es','CC',1019036429,3195865690,'$2b$10$nbaP1BaR9gdSaphYuQbnQ.kHTO6MS0gXaq8N.H8et9WJC1JWJuYXS','https://res.cloudinary.com/dinkcwwze/image/upload/v1730078899/user_avatar/npveieubqfp6mauxnsgu.jpg','user_avatar/npveieubqfp6mauxnsgu',1,3,'2024-10-28 01:28:23','2024-10-28 01:28:23'),(_binary 'g\"$µó÷ñ\0\ıo˘','Johan Alexix','Orostegui Audor','aorostegui2@gmail.com','CC',1016952406,3103549968,'$2b$10$whv09IGBWirQniijw/FNh.IsugRbmOfrOx54z5FiaZWUXF9B/TnBC','https://res.cloudinary.com/dinkcwwze/image/upload/v1730290869/user_avatar/g9wd06seiadwyrgisn1m.jpg','user_avatar/g9wd06seiadwyrgisn1m',1,3,'2024-10-30 12:21:10','2024-10-30 12:23:38'),(_binary 'g\",aó÷ñ\0\ıp','Karol Valentina','Gomez Diaz','karitomfvj12@gmail.com','CC',1031809377,3105158330,'$2b$10$tfbngbf7p/yjiMTSfvcEYOkIwNj4zBDsS2rxPslKMueywLERPv9KC','https://res.cloudinary.com/dinkcwwze/image/upload/v1730292905/user_avatar/wafqfrybog7e1wompd9y.jpg','user_avatar/wafqfrybog7e1wompd9y',1,3,'2024-10-30 12:53:53','2024-10-30 12:58:19'),(_binary 'g\".Pó÷ñ\0\ıp','Andres','Suarez','andresfelipe@gmail.com','CC',1014862358,3226004664,'$2b$10$JvdwXKHtYBBJ01IJ5lcbA.CDfjsnw0xGLoR0Q/i2.N.NUpBWSAlc2','https://res.cloudinary.com/dinkcwwze/image/upload/v1730293326/user_avatar/fkf1tsimge2bczvgdpvt.png','user_avatar/fkf1tsimge2bczvgdpvt',1,3,'2024-10-30 13:02:08','2024-10-30 13:02:08'),(_binary 'g\"R∏ó÷ñ\0\ıp','Carolina ','Forero','cforeros2024@gmail.com','CC',1019036412,3193527621,'$2b$10$sFzS8KL5STDxHplPaf.Uf.dc6S3dc6yCR5KxtW59VDH663iLpuBTC','https://res.cloudinary.com/dinkcwwze/image/upload/v1730302648/user_avatar/b1kkx5b6epwf49ppnrzo.jpg','user_avatar/b1kkx5b6epwf49ppnrzo',1,3,'2024-10-30 15:37:28','2024-10-30 15:56:21'),(_binary 'g+kˇó÷ñ\0\ıp+','Jhon','Cufi√±o','jhon15cufi@gmail.com','CC',1049795566,3193289548,'$2b$10$8zrxNUU2UVqyvVi/ZPqtjeDm.GQDnFa48puGh5XWIp3zZh2NjtB.G','https://res.cloudinary.com/dinkcwwze/image/upload/v1730898941/user_avatar/ywpgdeqkdgskxhfj7aux.jpg','user_avatar/ywpgdeqkdgskxhfj7aux',1,3,'2024-11-06 13:15:43','2024-11-12 19:44:22'),(_binary 'g3\˜ôF]U!å&\Ê','Jhon','Doe','jhondoe@gmail.com','CC',1006528964,3103256985,'$2b$10$Se9fetFxkGOAP3HIc62up.wXB.SWhfqsy54FtxBsmJdgYhQl6ipda','https://res.cloudinary.com/dinkcwwze/image/upload/v1731458968/user_avatar/lqst8hko9iviilj4cluq.jpg','user_avatar/lqst8hko9iviilj4cluq',1,3,'2024-11-13 00:49:29','2024-11-13 00:49:29'),(_binary 'g4ø^)g?\ÃÎ¢∏','Danna','Cardozo','danna.valentina070707@gmail.com','CC',1031810870,3237988827,'$2b$10$NUa/jtPbKJGiWdVmpfR9luc5KU.r3PiGEHw11bOavbKHppR1.6e3.','https://res.cloudinary.com/dinkcwwze/image/upload/v1731510108/user_avatar/latcywyavvxx5e6njvir.jpg','user_avatar/latcywyavvxx5e6njvir',1,3,'2024-11-13 15:01:51','2024-11-13 15:01:51'),(_binary 'g4\ıí\Ó\œu¯s\‚~','Carlos','Martinez','carlos@gmail.com','CC',1019028321,3193273421,'$2b$10$BY.Y6IZS6n0mBc0ZB.EaFubKyuTsh..jocJPYcR/Wyf6IiPj.36gq','https://res.cloudinary.com/dinkcwwze/image/upload/v1731523983/user_avatar/evdafvyzcb5rkph5ju8b.jpg','user_avatar/evdafvyzcb5rkph5ju8b',1,3,'2024-11-13 18:53:06','2024-11-13 18:53:06');
/*!40000 ALTER TABLE `cbt_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-19 15:19:06
