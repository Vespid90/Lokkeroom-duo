import jwt from 'jsonwebtoken';

const JWT_KEY = process.env.JWT_KEY;

const verifyToken = (req, res, next) => {
    const token = req.cookies['access-token'];

    if(!token) {
        return res.send({success: false, message: "Token manquant"});
    }

    jwt.verify(token, JWT_KEY, (err, decoded) => {
        if(err) {
            return res.send({success: false, message: 'Token invalide'});
        }

        req.user = decoded; //contien l'userID et l'email (et le password?) et devra remplacer les req.params.userId en req.user.userId
        next();
    })
};

export default verifyToken;