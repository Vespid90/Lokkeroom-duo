import express from 'express';
import { connection } from "./logInDB.mjs";
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_KEY = process.env.JWT_KEY;

connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données');
    }
});

router.get('/', (req, res) => {
    res.render("logIn");
});

router.post('/', (req, res) => {

    connection.query(
        'SELECT userId, email FROM users WHERE email=? AND password=?',
        [req.body.mail, req.body.password],
        (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification des logs', err);
                return res.send({ success: false, message: 'Erreur interne du serveur' });
            }

            if (results.length > 0) {
                const user = {
                    userId: results[0].userId,
                    email: results[0].email
                };
                const token = jwt.sign(user, JWT_KEY, { expiresIn: '1h' });
                res.cookie('access-token', token, {
                    httpOnly: true, // Rend le cookie inaccessible depuis JavaScript (sécurise contre les attaques XSS)
                    secure: false,   // Utilise HTTPS pour ce cookie (en production)
                    maxAge: 3600000, // Durée de validité du cookie (1 heure)
                  });
                return res.render("lobby")
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
