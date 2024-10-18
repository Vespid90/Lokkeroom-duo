//Fichier de connexion à la DB. Voir en bas pour plus d'info
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
    }
});

export { connection };

//INFO

//Plus besoin d'importer mysql2 dans les autres fichier.mjs
//Il faut copier ces lignes de codes dans chacun des fichier.mjs
// ATTENTION à bien adapter le chemin d'accès de "./logInBD.mjs"


// import { connection }  from "./logInDB.mjs";
//
// connection.connect((err) => {
//     if(err) {
//         console.error('Erreur de connexion à la base de données');
//     }
// })