import express from 'express';
import { connection } from './logInDB.mjs';

const router = express.Router();

router.get('/', (req, res) => {


    connection.query(
        'SELECT * FROM user_lobby WHERE userId = ? AND role = ?',
        [req.params.userId, 'admin'],
        (err, results) => {
            if (err) {
                console.error('Erreur lors de la récupération des utilisateurs du lobby', err);
                return res.send({ success: false, message: 'Erreur interne du serveur' });
            }

            if (results.length > 0) {
                return res.send({
                    success: true,
                    users: results
                });
            } else {
                return res.send({
                    success: false,
                    message: 'Aucun utilisateur trouvé dans ce lobby'
                });
            }
        }
    );
});


router.get('/:userId', (req, res) => {


    connection.query(
        'SELECT * FROM user_lobby WHERE userId = ?',
        [req.params.userId],
        (err, results) => {
            if (err) {
                console.error('Erreur lors de la récupération des utilisateurs du lobby', err);
                return res.send({ success: false, message: 'Erreur interne du serveur' });
            }

            if (results.length > 0) {
                return res.send({
                    success: true,
                    users: results
                });
            } else {
                return res.send({
                    success: false,
                    message: 'Aucun utilisateur trouvé dans ce lobby'
                });
            }
        }
    );
});

export default router;
