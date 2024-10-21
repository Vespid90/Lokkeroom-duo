import express from 'express';
import { connection }  from "./logInDB.mjs";

const router = express.Router();



const connection = mysql.createConnection({
    host: process.env.DB_HOST,      // Adresse de ton serveur MariaDB
    user: process.env.DB_USER,           // Utilisateur de la base de données
    password: process.env.DB_PASSWORD,  // Mot de passe de l'utilisateur
    database: process.env.DB_NAME   // Nom de la base de données
});


connection.connect((err) => {
    if(err) {
        console.error('Erreur de connexion à la base de données');
    }
})

router.get('/', (req, res) => {
    res.end();
  }
)

router.post('/', (req, res) => {
    connection.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [ req.body.mail, req.body.password],
        (err, results) => {
          if (err) {
            console.error('Erreur lors de l\'insertion des données : ', err);
          }
        }
      );

    res.send({ data: `Utilisateur créé et stocké dans la base de données` })
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