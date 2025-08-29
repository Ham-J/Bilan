DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(180) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','employe') NOT NULL DEFAULT 'employe'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(120) NOT NULL,
  prenom VARCHAR(120) NOT NULL,
  email VARCHAR(180) NOT NULL,              
  jour DATE NOT NULL,
  heure TIME NOT NULL,
  nb_personnes TINYINT NOT NULL,
  service ENUM('midi','soir') NOT NULL,
  userId INT NULL,
  CONSTRAINT fk_res_user FOREIGN KEY (userId) REFERENCES users(id),
  CONSTRAINT chk_nb CHECK (nb_personnes > 0 AND nb_personnes <= 40)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




