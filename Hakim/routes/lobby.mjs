import express from 'express';
import { connection }  from "./logInDB.mjs";
import verifyToken from "./access-token.mjs";

const router = express.Router();
const userId = 1;

connection.connect((err) => {
if (err) {
    console.error('Erreur de connexion à la base de données : ', err);
    return;
}
});

router.use('/', verifyToken);

router.get('/', (req, res) => {
    connection.query(
        'SELECT lobby.lobbyId,name FROM user_lobby INNER JOIN lobby ON user_lobby.lobbyId = lobby.lobbyId WHERE userId = ?',
        [ req.user.userId ],
        (err, results) => {
          if (err) {
            console.error('Erreur lors de l\'insertion des données : ', err);
          }
          res.send(results);
        }
      );
  }
)

router.post('/', (req, res) => { //Crée un lobby
    connection.query(
        'INSERT INTO lobby (name, adminId) VALUES (?, ?)',
        [ req.body.name, req.user.userId ],
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
                [req.user.userId, results[0].lobbyId, 'admin' ],
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


router.get('/:lobbyId', (req, res) => { //Affiche les messages du lobby selectionné
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
                const numB = parseInt(b.split(' - ')[0]); 
                return numA - numB;
            });
            res.send(arrMessage);
        }
    )
  }
)

router.get('/:lobbyId/:messageId', (req, res) => { //Affiche un message d'un lobby selectionné
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

router.post('/:lobbyId', (req, res) => { //Poster un message dans le lobby selectionné
    connection.query(
        'INSERT INTO messages (lobbyId, userId, text) VALUES ( ?, ?, ?);',
        [ req.params.lobbyId, req.user.userId , req.body.text ],
        (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion des données : ', err);
            }
            res.send("Message added in the lobby")
        }
    )
  }
)

router.post('/:lobbyId/add-user', (req, res) => { //Ajoute un utilisateur au lobby
  connection.query(
      'SELECT adminId FROM lobby WHERE lobbyId = ?', //Requête DB pour check si l'utilisateur est un admin ou non
      [ req.params.lobbyId],
      (err, results) => {
        if (err) {
          console.error('Erreur lors de l\'insertion des données : ', err);
        }
        if(results[0].adminId === req.user.userId) {
          connection.query(
            'SELECT userId FROM users WHERE email = ?', //s'il est admin alors on va faire une requête pour aller chercher le userId de l'utilisateur que l'on veut ajouter
            [req.body.mail],
            (err, results) => {
              if (err) {
                console.error('Erreur lors de l\'insertion des données : ', err);
              }
              if(results.length > 0){
                connection.query(
                  'INSERT INTO user_lobby (userId, lobbyId, role) VALUES (?, ?, ?)', //On insert dans le user_lobby le nouvel utilisateur
                  [results[0].userId, req.params.lobbyId, "member"],
                  (err, results) => {
                    if (err) {
                      console.error('Erreur lors de l\'insertion des données : ', err);
                    }
                    res.send("User added")
                  }
                )
              } else {
                res.send("This user doesn't exist.")
              }
            }
          )
        } else {
          res.send("You can not add user because you are not the admin of this lobby.")
        }
      }
    )
  }
)

router.post('/:lobbyId/remove-user', (req, res) => { //Supprime on utilisateur du lobby
  connection.query(
    'SELECT adminId FROM lobby WHERE lobbyId = ?', //Requête DB pour check si l'utilisateur est un admin ou non
    [ req.params.lobbyId ],
    (err, results) => {
        if (err) {
          console.error('Erreur lors de l\'insertion des données : ', err);
        }
        if(results[0].adminId === req.user.userId){
          connection.query(
            'SELECT users.userId FROM users INNER JOIN user_lobby ON users.userId = user_lobby.userId WHERE lobbyId = ? AND email = ?', //On va rechercher le userId de l'utilisateur que l'on veut remove
            [ req.params.lobbyId, req.body.mail ],
            (err, results) => {
              if (err) {
                  console.error('Erreur lors de l\'insertion des données : ', err);
              }
              if (results.length > 0){
                connection.query(
                  'DELETE FROM user_lobby WHERE userId = ? AND lobbyId = ?', //On delete ici le userId lié au lobbyId
                  [results[0].userId, req.params.lobbyId],
                  (err,results) => {
                    if (err) {
                      console.error('Erreur lors de l\'insertion des données : ', err);
                    }
                    res.send("User removed")
                  }
                )
              } else {
                res.send("This user doesn't exist in this lobby")
              }
            }
          )
        } else {
          res.send("You can not remove user because you are not the admin of this lobby.")
        }
      }
    )
  }
)

router.patch('/:messageId', (req, res) => {
  connection.query(
    'SELECT messages.userId, lobby.adminId, text FROM messages INNER JOIN lobby ON messages.lobbyId = lobby.lobbyId WHERE messageId = ?', //On va rechercher les infos lié au messageId (info => userId, adminId et le texte)
    [req.params.messageId],
    (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'insertion des données : ', err);
        }
        if(results.length > 0){ //On check si le messageId indiqué dans l'URL existe
          if(req.user.userId === results[0].userId || req.user.userId === results[0].adminId){  //On check si l'utilisateur qui est connecté à le droit de modifier le message
            connection.query(
              'UPDATE messages SET text = ? WHERE messageId = ?',
              [req.body.text, req.params.messageId],
              (err, results) => {
                if (err) {
                  console.error('Erreur lors de l\'insertion des données : ', err);
                }
                res.send("Message updated")
              }
            )
          } else {
            res.send("You don't the permission to modify this message")
          }
        } else {
          res.send("Error")
        }
      }
    )
  }
)

export default router;