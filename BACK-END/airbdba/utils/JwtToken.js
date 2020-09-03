const jwt = require('jsonwebtoken');
const db = require('./connection');
const Utente = require('../model/Utente');
//MIDDLEWARE PER VERIFICARE IL LOGIN


verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'];

    if(!token) {
        return res.status(403).send({
            auth: false, message: 'Nessun token fornito'
        });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if(err) {
            return res.status(500).send({
                auth: false,
                message: 'Errore autenticazione: ' + err
            });
        }
        req.id = decoded.id;
        next();
    })
}