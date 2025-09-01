#  Application de réservation de restaurant

Projet réalisé dans le cadre du devoir bilan CEF.  
Application complète **React + Bootstrap (front)** et **Express + Sequelize + MySQL (back)** permettant de gérer des réservations de restaurant avec rôles **visiteur**, **employé**, **admin**.

---

## Fonctionnalités

###  Utilisateurs
- **Visiteur**
  - Page d’accueil
  - Consultation de la carte
  - Formulaire de réservation publique
  - Connexion
- **Employé** (après connexion)
  - Accès uniquement à la page **Réservations**
  - Création / modification / suppression de réservations
- **Admin** (après connexion)
  - Accès à la gestion des **utilisateurs** (CRUD)
  - Accès à la gestion des **réservations**

### Réservations
- Chaque réservation comporte : nom, prénom, email, date, heure, nombre de personnes, service (midi/soir).
- Règles métier :
  - Réservation obligatoire **J+1 minimum**
  - Service **midi** limité à 12h–14h
  - Service **soir** limité à 19h–21h
  - Maximum **40 couverts par service et par jour**

---

##technique

- **Frontend** : React (Create React App), React Router, Axios, Bootstrap
- **Backend** : Node.js, Express.js, Sequelize ORM
- **Base de données** : MySQL
- **Auth** : JWT (JSON Web Token), bcrypt pour le hachage des mots de passe

---

##  Installation

```bash
git clone https://github.com/Ham-J/Bilan.git
cd Bilan

-installer la base donnée
-renommer .env.example en .env
-dans terminal cd back-end npm run dev
-dans un autre terminal cd front-end npm start
 ```
---

## Se connecter à l'application
compte admin ---> Anna@resto.local / admin123 
compte employe ---> test@employe.com / 1234


