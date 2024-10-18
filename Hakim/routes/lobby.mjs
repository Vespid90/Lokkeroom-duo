import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();
const PORT = 3001;
const router = express.Router();
const userId = 1;

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
});

router.get('/', (req, res) => {
    connection.query(
        'SELECT lobby.lobbyId,name FROM user_lobby INNER JOIN lobby ON user_lobby.lobbyId = lobby.lobbyId WHERE userId = 1',
        [ userId ],
        (err, results) => {
          if (err) {
            console.error('Erreur lors de l\'insertion des données : ', err);
          }
          res.send(results);
        }
      );
  }
)

router.post('/', (req, res) => {
    connection.query(
        'INSERT INTO lobby (name, adminId) VALUES (?, ?)',
        [ req.body.name, userId ],
        (err, results) => {
          if (err) {
            console.error('Erreur lors de l\'insertion des données : ', err);
          }
          connection.query(
            'SELECT lobbyId FROM lobby WHERE name = ?',
            [ req.body.name ],
            (err, results) => {
              if (err) {
                console.error('Erreur lors de l\'insertion des données : ', err);
              }
              connection.query(
                'INSERT INTO user_lobby (userId, lobbyId , role) VALUES (?, ?, ?)',
                [userId, results[0].lobbyId, 'admin' ],
                (err, results) => {
                  if (err) {
                    console.error('Erreur lors de l\'insertion des données : ', err);
                  }
                  res.send("Lobby created");
                }
              );
            }
          );
        }
      );
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


router.get('/:lobbyId', (req, res) => {
    connection.query(
        'SELECT messageId,email,text FROM users INNER JOIN messages ON users.userId = messages.userId WHERE lobbyId = ?',
        [ req.params.lobbyId ],
        (err, results) => {
            let arrMessage = [];
            if (err) {
                console.error('Erreur lors de l\'insertion des données : ', err);
            }
            for(let count = 0; count < results.length; count++){
                arrMessage.push(results[count].messageId + " - " + results[count].email + " - " + results[count].text)
            }
            arrMessage.sort((a, b) => {
                const numA = parseInt(a.split(' - ')[0]); // Extrait le nombre avant le premier tiret
                const numB = parseInt(b.split(' - ')[0]); // Extrait le nombre avant le premier tiret
                return numA - numB;
            });
            res.send(arrMessage);
        }
    )
  }
)

router.get('/:lobbyId/:messageId', (req, res) => {
    connection.query(
        'SELECT messageId,email,text FROM users INNER JOIN messages ON users.userId = messages.userId WHERE lobbyId = ? AND messageId = ?',
        [ req.params.lobbyId, req.params.messageId ],
        (err, results) => {
            let arrMessage = [];
            if (err) {
                console.error('Erreur lors de l\'insertion des données : ', err);
            }
            for(let count = 0; count < results.length; count++){
                arrMessage.push(results[count].messageId + " - " + results[count].email + " - " + results[count].text)
            }
            res.send(arrMessage);
        }
    )
  }
)

// router.post('/:lobbyId', (req, res) => {
//     connection.query(
//         'INSERT INTO messages (lobbyId , userId, text) VALUES ( ?, ?, ?);',
//         [ req.params.lobbyId, userId , req.body.text ],
//         (err, results) => {
//             if (err) {
//                 console.error('Erreur lors de l\'insertion des données : ', err);
//             }
//             res.send("Message added in the lobby")
//         }
//     )
//   }
// )

export default router;