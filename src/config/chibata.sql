SET GLOBAL time_zone = '-05:00';

DROP DATABASE IF EXISTS chibata;

CREATE DATABASE IF NOT EXISTS chibata;

USE chibata;

CREATE TABLE roles (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(15) NOT NULL
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
  legal_representative TEXT NOT NULL,   -- Representante legal de la organización
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
  role_in ENUM('organizer', 'admin') NOT NULL,   -- Rol del miembro dentro de la organización
  FOREIGN KEY (organization_id) REFERENCES organizations(organization_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE localizations (
  localization_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  state BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE events (
  event_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status ENUM('scheduled', 'in-progress', 'completed', 'canceled') NOT NULL,
  state BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  organizer_id BIGINT,
  localization_id BIGINT,
  organization_id BIGINT,  -- Nueva columna para relacionar con la tabla organizations
  FOREIGN KEY (organizer_id) REFERENCES users(user_id),
  FOREIGN KEY (localization_id) REFERENCES localizations(localization_id),
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

CREATE TABLE comments (
  comment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  event_id BIGINT,
  user_id BIGINT,
  comment_text TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  state BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE categories (
  category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  category_name TEXT NOT NULL UNIQUE,
  state BOOLEAN DEFAULT FALSE
);

CREATE TABLE event_categories (
  event_id BIGINT,
  category_id BIGINT,
  PRIMARY KEY (event_id, category_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE awards (
  award_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  issued_by TEXT NOT NULL,   -- Nombre de la persona o entidad que emite el premio
  issuing_organization_id BIGINT,   -- Clave foránea para la organización emisora
  recipient_id BIGINT,   -- El ID del usuario que recibe el premio
  award_file TEXT,   -- Ruta o nombre del archivo asociado al premio (por ejemplo, un certificado)
  state BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (recipient_id) REFERENCES users(user_id),  -- Relación con la tabla users
  FOREIGN KEY (issuing_organization_id) REFERENCES organizations(organization_id)  -- Relación con la tabla organizations
);

CREATE TABLE notifications (
  notification_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  event_id BIGINT,
  notification_type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (event_id) REFERENCES events(event_id)
);

INSERT INTO roles (role_name) VALUES ("Administrador"), ("Organizador"), ("Voluntario");
INSERT INTO users VALUES (NULL, "Kelly", "Rojas", "kelly@info.com", "CC", 1025896314, 3003000000, "si", 1, "foto.jpg", "../uploads/img/user_avatar/foto.jpg", true, NOW(), NOW());

SELECT * FROM users;