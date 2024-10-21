import express from 'express';
import { connection }  from "./logInDB.mjs";
import verifyToken from "./access-token.mjs";


const router = express.Router();

router.use('/', verifyToken);

connection.connect((err) => {
    if(err) {
        console.error('Erreur de connexion à la base de données');
    }
})


router.get('/', (req, res) => {
        res.send({data : 'ceci est un test'});
    }
)

router.post('/', (req, res) => {
        console.log(req.body);

        connection.query(
            'INSERT INTO messages (text) VALUES (?)',
            [ req.body.text ],
            (err, results) => {
                if (err) {
                    console.error('Erreur lors de la création du message : ', err);
                }
            }
        );

        res.send({ data: `Message créé et stocké dans la base de données` })
    }
)

router.delete('/:lobbyId/:messageId', (req, res) => {


    connection.query(
        'SELECT role FROM user_lobby WHERE userId = ? AND lobbyId = ?',
        [req.user.userId, req.params.lobbyId],
        (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification du rôle', err);
                return res.send({ success: false, message: 'Erreur interne du serveur' });
            }

            if (results.length > 0 && results[0].role === 'admin') {
                connection.query(
                    'DELETE FROM messages WHERE messageId = ?',
                    [req.params.messageId],
                    (err, result) => {
                        if (err) {
                            console.error('Erreur lors de la suppression du message', err);
                            return res.send({ success: false, message: 'Erreur interne lors de la suppression' });
                        }
                        console.log(req.params.messageId);
                        return res.send({ success: true, message: 'Message supprimé avec succès' });
                    }
                );
            } else {
                return res.send({ success: false, message: 'Accès refusé, vous devez être admin pour supprimer ce message' });
            }
        }
    );
});

export default router;