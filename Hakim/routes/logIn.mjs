import express from 'express';
import { connection }  from "./logInDB.mjs";

const router = express.Router();
let userId = 0;

connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données');
    }
});

router.get('/', (req, res) => {
    res.end();
});


router.post('/', (req, res) => {

    connection.query(
        'SELECT email, password, userId FROM users WHERE email=? AND password=?',
        [req.body.mail, req.body.password],
        (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification des logs', err);
                return res.send({ success: false, message: 'Erreur interne du serveur' });
            }

            if (results.length > 0) {
                userId = results[0].userId;
                console.log(userId);
                return res.send({
                    success: true,
                    message: 'Email et password corrects',
                    user: results[0]
                });
            } else {
                return res.send({
                    success: false,
                    message: 'Email ou password incorrect'
                });
            }
        }
    );
});

export default router;
export {userId};