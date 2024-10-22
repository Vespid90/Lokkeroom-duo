import express from 'express';
import signInRoute from './routes/signIn.mjs';
import logInRoute from './routes/logIn.mjs';
import messagesRoute from './routes/messages.mjs';
import usersRoute from './routes/users.mjs';
import lobbyRoute from './routes/lobby.mjs';
import { connection }  from "./routes/logInDB.mjs";
import cookieParser from 'cookie-parser';

connection.connect((err) => {
    if(err) {
        console.error('Erreur de connexion à la base de données');
        return;
    }
    console.log('Connecté à la base de données');
})

const PORT = 3001;
const app = express();

app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use("/signIn",signInRoute);
app.use("/logIn", logInRoute);
app.use("/messages", messagesRoute);
app.use("/users", usersRoute);
app.use("/lobby",lobbyRoute);


app.get('/', (req, res) => {
    res.send({ data: `Here is your data` });
    }
)

app.post('/', (req, res) => {
    res.send({ data: `User created` })
  }
)

app.put('/', (req, res) => {
    res.send({ data: `User updated` })
  }
)

app.delete('/', (req, res) => {
    res.send({ data: `User deleted` })
  }
)

app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT}/`))