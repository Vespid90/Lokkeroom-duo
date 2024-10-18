import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const PORT = 3001;
const router = express.Router();

import { connection }  from "./logInDB.mjs";

connection.connect((err) => {
    if(err) {
        console.error('Erreur de connexion à la base de données');
    }
})

router.get('/', (req, res) => {
    res.end();
  }
)

router.post('/', (req, res) => {
    console.log(req.body);
    
    connection.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [ req.body.mail, req.body.password ],
        (err, results) => {
          if (err) {
            console.error('Erreur lors de l\'insertion des données : ', err);
          }
        }
      );

    res.send({ data: `User created` })
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

export default router;