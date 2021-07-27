
const { client, err_connnection } = require("./db");
const jwt = require('jsonwebtoken');
const { custom_log } = require("../common/log");
const { today } = require("../common/utils");



const Profils = {
    CLIENT: 'CLIENT',
    MARCHAND: 'MARCHAND',
    ASSOCIATION: 'ASSOCIATION',
    ADMIN: 'ADMIN'
}

function checkProfils(profils) {
    switch (profils) {
        case Profils.ADMIN:
            return true;
        case checkProfils.ASSOCIATION:
            return true;
        case checkProfils.CLIENT:
            return true;
        case checkProfils.MARCHAND:
            return true;
        default:
            return false;
    }
}

function findByEmailAndPassword(http_Request, http_response) {
    var body = http_Request.body;
    if(!checkProfils(body.usertype)) {
        //http_response.json({profil: null, user: null});
    } else if (err_connnection) {
        //http_response.send({profil: usertype, user: null});
    }
    //var tableName =String(body.usertype).toLowerCase();
    var query = {
        text: 'SELECT * FROM '+ body.usertype + ' WHERE email = $1 AND password = $2',
        values: [body.email, body.password],
    };
    custom_log('[QUERY IN]', 'q : '+ query.text + ' & values: '+ query.values);
    client.query(query, (err, res) => {
        var val = null;
        var accessToken = null;
        if (err) {
            custom_log('[QUERY OUT][' + body.usertype + ']',  'Fail, cause: '+ err);
        } else {
            custom_log('[QUERY OUT][' + body.usertype + ']', 'Select at ' + today() + ', authent with '+ body.usertype +' : ' + body.email +' /');
            val = res.rows[0];
            accessToken = jwt.sign( {user: val.id, profil: body.usertype}, 'secrets', { expiresIn: process.env.EXPIRE_TIME_JWT | 600000});
            custom_log('[JWT]', 'authenticate');
        }
        http_response.json({profil: body.usertype, user: val, token: accessToken});
    });
}


function auth(req, res, next) {
    var tokenheader = req.headers['authorization'];
    console.log('[HEADER][JWT] => header autorize found: '+ tokenheader);
    if(tokenheader) {
        let token = ''.concat(tokenheader).split(' ')[1];
        console.log('[JWT] => access token = '+ token);
        jwt.verify(token, 'secrets', (err, user) => {
            if(err) {
                custom_log('[JWT_AUTHENT]', ' Fail, cause : '+ err);
                res.status(401).json({
                    error: new Error('Invalid session')
                });
            }else{  
                next();
            }
        });
    }else {
        res.status(401).json({error: new Error('No autorize')});
    }
}

module.exports = {
    profils: Profils,
    checkProfils,
    findByEmailAndPassword,
    auth
}