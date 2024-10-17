import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const PORT = 3001;
const router = express.Router();

console.log(process.env.DB_USER);

let connection = mysql.createConnection({
    host: process.env.DB_HOST,      // Adresse de ton serveur MariaDB
    user: process.env.DB_USER,           // Utilisateur de la base de données
    password: process.env.DB_PASSWORD,  // Mot de passe de l'utilisateur
    database: process.env.DB_NAME   // Nom de la base de données
  });

// const connection = mysql.createConnection({
//     host: '127.0.0.1',      // Adresse de ton serveur MariaDB
//     user: 'hakim',           // Utilisateur de la base de données
//     password: 'password',   // Mot de passe de l'utilisateur
//     database: 'LokkeroomDB'     // Nom de la base de données
//   });

connection.connect((err) => {
if (err) {
    console.error('Erreur de connexion à la base de données : ', err);
    return;
}
});

router.get('/', (req, res) => {
    res.end();
  }
)

router.post('/', (req, res) => {
    console.log(req.body);
    
    connection.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [ req.body.mail, req.body.password ],
        (err, results) => {
          if (err) {
            console.error('Erreur lors de l\'insertion des données : ', err);
          }
        }
      );

    res.send({ data: `User created` })
  }
)

router.put('/', (req, res) => {
    res.send({ data: `User updated` })
  }
)

router.delete('/', (req, res) => {
    res.send({ data: `User deleted` })
  }
)

export default router;