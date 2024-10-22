import express from 'express';
import { connection }  from "./logInDB.mjs";

const router = express.Router();

connection.connect((err) => {
    if(err) {
        console.error('Erreur de connexion à la base de données');
    }
})

router.get('/', (req, res) => {
    res.render("signIn");
  }
)

router.post('/', (req, res) => {
    console.log(req.body);
    const {mail,password} = req.body;
    connection.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [ mail, password],
        (err, results) => {
          if (err) {
            console.error('Erreur lors de l\'insertion des données : ', err);
          }
          res.send({ data: `Utilisateur créé et stocké dans la base de données` })
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

export default router;