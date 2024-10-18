import express from 'express';
import signInRoute from './routes/signIn.mjs';
import logInRoute from './routes/logIn.mjs';

import { connection }  from "./routes/logInDB.mjs";

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

app.use("/signIn",signInRoute);
app.use("/logIn", logInRoute);

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





// const readline = require('node:readline/promises');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });

//   let obj = {
//     lobby : [{lobbyId : 0, 
//             name : "", 
//             adminId : 0, 
//             userId : [], 
//             messageId : []}],
//     users : [{userId : 0, 
//             email : "", 
//             password : "" , 
//             lobbyId : []}],
//     messages : [{messageId : 0, 
//                 text : "", 
//                 userId : 0, 
//                 lobbyId : 0}]
//     };

// let user = {}
// let lobby = {};
// let acces = false;

// async function signUp() {
//     console.log("Sign up");
//     console.log("------------------------");
//     let mail = await rl.question("Enter your mail : ");
//     let password = await rl.question("Enter your password : ");
//     obj.users.push({});
//     let index = obj.users.length - 1;
//     obj.users[index].userId = index;
//     obj.users[index].email = mail;
//     obj.users[index].password = password;
//     obj.users[index].lobbyId = [];
// }

// async function logIn(){
//     console.log("Log in");
//     console.log("------------------------");
//     let mail = await rl.question("Enter your mail : ");
//     let password = await rl.question("Enter your password : ");
//     for(let count = 0; count < obj.users.length; count ++){
//         if(obj.users[count].email === mail){
//             if(obj.users[count].password === password){
//                 acces = true;
//                 console.log("You are logged in !");
//                 user.userId = obj.users[count].userId;
//                 user.email = obj.users[count].email;
//                 user.password = obj.users[count].password;
//                 user.lobbyId = obj.users[count].lobbyId;
//             }
//         }
//     };
//     if(acces == false){
//         console.log("Wrong mail or wrong password !");
//     };
// }

// async function createLobby() {
//     console.log("------------------------");
//     let name = await rl.question("Enter the name lobby : ");
//     obj.lobby.push({});
//     let index = obj.lobby.length - 1;
//     obj.lobby[index].lobbyId = index;
//     obj.lobby[index].name = name;
//     obj.lobby[index].adminId = user.userId;
//     obj.lobby[index].userId = [];
//     obj.lobby[index].messageId = [];
//     obj.users[user.userId].lobbyId.push(index);
//     user.lobbyId.push(index);
//     console.log(obj);
// }

// function viewLobby() {
//     let list = 1;
//     console.log("------------------------");
//     console.log("Here are your lobby : ");
//     for(let count = 0; count < obj.lobby.length; count ++){ 
//         if(user.lobbyId.includes(obj.lobby[count].lobbyId)){ // on check pour chaque lobby existant si le user est membre du lobby
//             console.log(list + " - " + obj.lobby[count].name);
//             list++;
//         }
//     }
// }

// async function selectLobby() {
//     console.log("------------------------");
//     let select = await rl.question("Which lobby do you want to select ? Type the number : ");
//     return user.lobbyId[select - 1];
// }

// async function addUserInLobby(lobbyId){
//     console.log("------------------------");
//     let addingUserMail = await rl.question("Enter the user mail to add in the lobby : ");
//     if(obj.lobby[lobbyId].adminId === user.userId){ // on check ici si il a les droits admin
//         for(let count = 0; count < obj.users.length; count ++){
//             if(addingUserMail === obj.users[count].email){  // on check parmis les users lequel correspond à l'input
//                 obj.lobby[lobbyId].userId.push(obj.users[count].userId); // on rajoute le userId dans le lobby selectionné au préalable
//                 obj.users[count].lobbyId.push(lobbyId); // on rajoute le lobbyId dans le user
//             }
//         }
//     } else {
//         console.log("You do not have the rights to add a member to the lobby.")
//     }
// }

// async function postMessage(lobbyId){
//     console.log("------------------------");
//     let message = await rl.question("Type your message : ");
//     obj.messages.push({});
//     let index = obj.messages.length - 1;
//     obj.messages[index].messageId = index;
//     obj.messages[index].text = message;
//     obj.messages[index].userId = user.userId;
//     obj.messages[index].lobbyId = lobbyId;
//     obj.lobby[lobbyId].messageId.push(index);
// }

// async function viewMessage(lobbyId){
//     console.log("------------------------");
//     console.log("Lobby's messages : ")
//     for(let count = 0; count < obj.lobby[lobbyId].messageId.length; count ++){ 
//         let messageId = obj.lobby[lobbyId].messageId[count]; // on recup le messageId dans le tableau messageId du lobby
//         let text = obj.messages[messageId].text; // avec ce messageId on recup le text correspondant
//         let userId = obj.messages[messageId].userId; //avec ce messageId on recup le userId correspondant
//         let mail = obj.users[userId].email; //avec le userId on recup le mail correspondant à cet userId
//         console.log(count + 1 + " - " + mail + " : " + text);
//     }
// }

// async function main(){
//     await signUp();
//     await logIn();
//     await createLobby();
//     await viewLobby();
//     let lobbyId = await selectLobby();
//     await addUserInLobby(lobbyId);
//     await postMessage(lobbyId);
//     await viewMessage(lobbyId);
//     await postMessage(lobbyId);
//     await viewMessage(lobbyId);
// }

// main();