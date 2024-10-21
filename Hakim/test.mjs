import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,      // Adresse de ton serveur MariaDB
    user: process.env.DB_USER,           // Utilisateur de la base de données
    password: process.env.DB_PASSWORD,  // Mot de passe de l'utilisateur
    database: process.env.DB_NAME   // Nom de la base de données
});



connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données : ', err);
        return;
    }
    }
);

connection.query(
    'SELECT messages.userId, lobby.adminId, text FROM messages INNER JOIN lobby ON messages.lobbyId = lobby.lobbyId WHERE messageId = 5',
    (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'insertion des données : ', err);
        }
        console.log(results);
    }
  );