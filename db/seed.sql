USE resto;

INSERT INTO users (email, password, role) VALUES
('admin@resto.local', 'admin123', 'admin'),
('employe@resto.local', 'employe123', 'employe');

INSERT INTO reservations (nom, prenom, email, jour, heure, nb_personnes, service, userId) VALUES
('Dupont', 'Alice', 'alice.dupont@example.com', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '12:30:00', 2, 'midi', NULL),
('Martin', 'Bob', 'bob.martin@example.com', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '19:15:00', 4, 'soir', 2);










