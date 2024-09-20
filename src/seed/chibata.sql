DROP DATABASE IF EXISTS chibata;

CREATE DATABASE IF NOT EXISTS chibata;

USE chibata;

CREATE TABLE roles (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(20) NOT NULL,
  role_path VARCHAR(20) NOT NULL
);

CREATE TABLE users (
  user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  doc_type ENUM('CC', 'CE', 'PA') NOT NULL,
  doc_num BIGINT NOT NULL UNIQUE, 
  phone_number BIGINT NOT NULL UNIQUE,
  pass TEXT NOT NULL,
  role_id INT NOT NULL,
  profile_photo TEXT,
  relative_photo_url TEXT,
  state BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE organizations (
  organization_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  organization_name TEXT NOT NULL,   -- Nombre legal de la organización
  nit VARCHAR(20) NOT NULL UNIQUE,   -- Número de Identificación Tributaria
  address TEXT NOT NULL,   -- Dirección de la organización
  registration_date DATE NOT NULL,   -- Fecha de registro de la organización
  contact_number BIGINT,   -- Número de contacto de la organización
  website TEXT,   -- Sitio web de la organización
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  state BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE organization_members (
  member_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  organization_id BIGINT,
  user_id BIGINT,
  FOREIGN KEY (organization_id) REFERENCES organizations(organization_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

DROP TABLE events;

CREATE TABLE `events` (
  event_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title TEXT NOT NULL,
  `description` TEXT,
  `date` DATE NOT NULL,
  `time` TIME NOT NULL,
  `status` ENUM('scheduled', 'in-progress', 'completed', 'canceled') NOT NULL,
  `state` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  organizer_id BIGINT NOT NULL,
  organization_id BIGINT NOT NULL,
  FOREIGN KEY (organizer_id) REFERENCES users(user_id),
  FOREIGN KEY (organization_id) REFERENCES organizations(organization_id)
);

CREATE TABLE event_registrations (
  registration_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  event_id BIGINT,
  user_id BIGINT,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attendance_status ENUM('pending', 'attended', 'canceled') NOT NULL,
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(255) NOT NULL UNIQUE,
  state BOOLEAN DEFAULT FALSE
);

CREATE TABLE event_categories (
  event_id BIGINT,
  category_id INT,
  PRIMARY KEY (event_id, category_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE notifications (
  notification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

INSERT INTO roles (role_name, role_path) VALUES ("Administrador", "/admin"), ("Organizador", "/organization"), ("Voluntario", "/volunteer");

DELIMITER //

CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  -- Crear notificación para el super admin (user_id = 1)
  INSERT INTO notifications (user_id, title, message, is_read)
  VALUES (1, 'Nuevo Usuario Registrado', CONCAT('Se ha registrado un nuevo usuario: ', NEW.name, ' ', NEW.surname), FALSE);
  
  -- Crear notificación de bienvenida si el rol es 'Voluntario'
  IF NEW.role_id = (SELECT role_id FROM roles WHERE role_name = 'Voluntario') THEN
    INSERT INTO notifications (user_id, title, message, is_read)
    VALUES (NEW.user_id, 'Bienvenido a la plataforma', 'Tu cuenta ha sido creada exitosamente como Voluntario', FALSE);
  END IF;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER after_organization_insert
AFTER INSERT ON organizations
FOR EACH ROW
BEGIN
  -- Crear notificación para el super admin (user_id = 1)
  INSERT INTO notifications (user_id, title, message, is_read)
  VALUES (1, 'Nueva Organización Registrada', CONCAT('Se ha registrado una nueva organización: ', NEW.organization_name), FALSE);
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER after_event_insert
AFTER INSERT ON events
FOR EACH ROW
BEGIN
  -- Crear notificación para el super admin (user_id = 1)
  INSERT INTO notifications (user_id, title, message, is_read)
  VALUES (1, 'Nuevo Evento Registrado', CONCAT('Se ha registrado un nuevo evento: ', NEW.title), FALSE);

  -- Notificar a todos los miembros de la organización si existe una organización asociada
  IF NEW.organization_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, is_read)
    SELECT user_id, 'Nuevo Evento de tu Organización', CONCAT('Se ha registrado un nuevo evento: ', NEW.title)
    FROM organization_members
    WHERE organization_id = NEW.organization_id;
  END IF;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER after_event_registration_insert
AFTER INSERT ON event_registrations
FOR EACH ROW
BEGIN
  DECLARE organizer_id BIGINT;

  -- Obtener el ID del organizador del evento
  SELECT organizer_id INTO organizer_id
  FROM events
  WHERE event_id = NEW.event_id;

  -- Crear notificación para el usuario que se ha registrado en el evento
  INSERT INTO notifications (user_id, title, message, is_read)
  VALUES (NEW.user_id, 'Registro Exitoso en Evento', CONCAT('Te has registrado en el evento con ID: ', NEW.event_id), FALSE);

  -- Crear notificación para el organizador del evento
  IF organizer_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, is_read)
    VALUES (organizer_id, 'Nuevo Registro en tu Evento', CONCAT('El usuario con ID: ', NEW.user_id, ' se ha registrado en tu evento con ID: ', NEW.event_id), FALSE);
  END IF;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER after_organizer_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  -- Crear notificación de bienvenida si el rol es 'Organizador'
  IF NEW.role_id = (SELECT role_id FROM roles WHERE role_name = 'Organizador') THEN
    INSERT INTO notifications (user_id, title, message, is_read)
    VALUES (NEW.user_id, 'Bienvenido a la plataforma', 'Tu cuenta ha sido creada exitosamente como Organizador', FALSE);
  END IF;
END //

DELIMITER ;

INSERT INTO organizations VALUES
(null, "Administracion Tests", "111111-1", "KR 111 #111-11", "2024-09-19", 3223521152, "http://localhost:3000/", DEFAULT, TRUE, DEFAULT);

INSERT INTO organization_members VALUES (null, 1, 1);

SET FOREIGN_KEY_CHECKS = 0;

INSERT INTO events (title, description, date, time, status, state, created_at, updated_at, organizer_id, organization_id)
VALUES ('Evento de prueba tres', 'Esto es un evento de prueba numero 3', '2024-09-20', '13:00:00', 'scheduled', 1, NOW(), NOW(), 1, 1);

SET FOREIGN_KEY_CHECKS = 1;

SELECT * FROM events;

SELECT * FROM users;
SELECT * FROM organizations;

SHOW COLUMNS FROM events;
