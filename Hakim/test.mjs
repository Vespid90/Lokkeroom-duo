import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.DB_USER);

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
    'SELECT email,text FROM users INNER JOIN messages ON users.userId = messages.userId WHERE lobbyId = ?',
    [ 1 ],
    (err, results) => {
        let arrMessage = [];
        if (err) {
            console.error('Erreur lors de l\'insertion des données : ', err);
        }
        console.log(results);
        for(let count = 0; count < results.length; count++){
            arrMessage.push(results[count].email + " - " + results[count].text)
        }
        console.log(arrMessage);
    }
  );