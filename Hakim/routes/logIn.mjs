import express from 'express';
const router = express.Router();

import { connection }  from "./logInDB.mjs";


connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données');
    }
});


router.get('/', (req, res) => {
    res.end();
});


router.post('/', (req, res) => {
    const { mail, password } = req.body;


    connection.query(
        'SELECT email, password FROM users WHERE email=? AND password=?',
        [mail, password],
        (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification des logs', err);
                return res.json({ success: false, message: 'Erreur interne du serveur' });
            }

            if (results.length > 0) {
                return res.json({
                    success: true,
                    message: 'Email et password corrects',
                    user: results[0]
                });
            } else {
                return res.json({
                    success: false,
                    message: 'Email ou password incorrect'
                });
            }
        }
    );
});

export default router;
