const { client, err_connnection } = require("./db");

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

function findByEmailAndPassword(body, tableName, http_response) {
    if(!checkProfils(body.usertype)) {
        http_response.send({profil: null, user: null});
        return;
    } else if (err_connnection) {
        http_response.send({profil: usertype, user: null});
    }
    var query = {
        text: 'SELECT * FROM '+ tableName + ' WHERE email = $1 AND password = $2',
        values: [body.email, body.password],
    };
    client.query(query, (err, res) => {
        var val = null;
        if (err) {
            custom_log('[' + tableName + ']',  'Fail, cause: '+ err);
        } else {
            custom_log('[' + tableName + ']', 'Select at ' + today() + ' marchand: ' + body.email);
            val = res.rows[0];
        }
        http_response.send({profil: body.usertype, user: val});
    });
}

module.exports = {
    usertype: USER_TYPE,
    checkProfils,
    findByEmailAndPassword
}