const { query, json } = require("express");
const { today, db_config, todayWithHours } = require("../../common/utils");
const { custom_log } = require("../../common/log");
var {client, err_connnection}= require("../db");
const {rechParamModel} = require("../../models/models")

var tableName = db_config.tables.marchand;

//ex: VALUES ('e-electronics', 'e@email.com', 'motdepasse', '2021-07-24')
function save(body) {
    return new Promise((resolve, reject) => {
        custom_log('[REQ BODY]',JSON.stringify(body)); 
        var status = 'ECHEC';
        if (err_connnection) {
           resolve({status:status});
        }
        date = today();
        var vals = [body.nom, body.email, body.adresse, date, body.client, body.marchand];

        var str = 'INSERT INTO '+ tableName + '(nom, email, adresse, datecreation, isclient, ismarchand ) VALUES($1, $2, $3, $4, $5, $6)'

        var query = {
            text: str,
            values: vals
        };
        
        client.query(query, (err, res) => {
            if (err) {
                custom_log('[QUERY OUT][' + tableName + ']',  'Insert Fail, cause: ' + err);
                status = 'ECHEC';
            } else {
                custom_log('[QUERY OUT][' + tableName + ']', 'Insert at ' + date + ', ' + body.nom +'/' +body.email);
                status = 'SUCCES';
            }
            resolve({status: status});
            
        });
    })
}

function update(body, param) {
    return new Promise((resolve, reject) => {
        var status = 'ECHEC';
        if (err_connnection) {
            resolve({status:status});
        }
        date = today();
        const bodyPayload = rechParamModel(body);
        var str = 'UPDATE '+ tableName + ' SET';
        var i = 1;
        bodyPayload.entries.forEach( e => {
            str += ' ' + e + ' = $'+i;
            i++;
        });
        var vals =  bodyPayload.values;
        vals.push(param.idmar);
        var query = {
            text: str + ' WHERE idmar = $'+i+ ' RETURNING *',
            values: vals
        };
        client.query(query, (err, res) => {
            if (err) {
                custom_log('[QUERY OUT][' + tableName + ']',  'Update Fail, cause: ' + err);
            } else {
                custom_log('[QUERY OUT][' + tableName + ']', 'Update at ' + date + ', new user = ' + JSON.stringify( res.rows));
                status = 'SUCCES';
                body.client=true;
            }
            resolve({status: status, data: res.rows[0]});
          });
    });

}

function findAll(){
    return new Promise((resolve, reject) => {
        var status = 'ECHEC';
        if (err_connnection) {
            resolve({status:status});
        }
        var queryAll = {
            text: 'SELECT * FROM '+ tableName
        };
        client.query(queryAll, (err, res) => {    
            var marchands = [];
            if (err) {
                custom_log('[QUERY OUT][' + tableName + ']',  'Select all Fail cause : ' + err);
            } else { 
                custom_log('[QUERY OUT][QUERY OUT][' + tableName + ']', 'Select at ' + todayWithHours() +', fetch: '+ JSON.stringify(res.rows)); 
                res.rows.forEach(row => {
                    marchands.push(row);
                });  
                status = 'SUCCES';
            }
            resolve({status: status, data: marchands});
        });
    });
}

// function findById(id) {
//     if (err_connnection) {
//         http_response.send({rechParam: 'ID', value:null});
//     }
//     var query = {
//         text: 'SELECT * FROM '+ tableName + ' WHERE idmar = $1',
//         values: [id],
//     };
//     client.query(query, (err, res) => {
//         var val = null;
//         if (err) {
//             custom_log('[QUERY OUT][' + tableName + ']',  'Fail');
//         } else {
//             custom_log('[QUERY OUT][' + tableName + ']', 'Select at ' + todayWithHours() + ', ' +res.rows[0]);
//             val = res.rows[0];
//             console.log("marchand found = "+JSON.stringify(val));
//         }
//         http_response.send({rechParam: 'ID', value: val});
//     });
// }

function findByAny(param, value) {
    return new Promise((resolve, reject) => {
        var status = 'ECHEC';
        if (err_connnection) {
            resolve({status:status});
        }
        var query = {
            text: 'SELECT * FROM public.'+ tableName + ' WHERE '+param+' = $1',
            values: [value]
        };
        custom_log('[QUERY][' + tableName + ']', query.text + ' with val '+ query.values);
        client.query(query, (err, res) => {
            var val = null;
            if (err) {
                custom_log('[QUERY OUT][' + tableName + ']',  'Fail, cause: '+ err);
            } else {
                custom_log('[QUERY OUT][' + tableName + ']', 'Select at ' + todayWithHours() + ', ' +JSON.stringify(res.rows));
                val = res.rows[0];
                status = 'SUCESS';
            }
            resolve({status: status, data: val});
        });
    });
}


module.exports = {
    save,
    findAll,
    findByAny,
    update
};

