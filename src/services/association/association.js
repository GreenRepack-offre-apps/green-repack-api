const { query, json } = require("express");
const { today, db_config, todayWithHours } = require("../../common/utils");
const { custom_log } = require("../../common/log");
var {client, err_connnection}= require("../db");

var tableName = db_config.tables.association;

//ex: VALUES ('e-electronics', 'e@email.com', 'motdepasse', '2021-07-24')
function save(body, http_response) {
    var data = null;
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status});
    }
    date = today();
    var query = {
        text: 'INSERT INTO '+ tableName + '(rna_id, email_compte, datecreation_compte, nom) VALUES($1, $2, $3, $4)',
        values: [body.rna, body.emailCompte, date, body.nom],
    };
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Insert Fail, cause: ' + err);
            if(err.message.includes('email_compte_uniq_constr') || err.message.includes('rna_id_uniq_constr')){
                status = 'EXIST';
            }
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Insert at ' + date + ', ' + body.nom +'/' + body.emailCompte);
            status = 'SUCCES';
            data = body;
        }
        http_response.send({status: status, data: data});
        
      });
}

function find(paramvalue, paramkey, http_response) {
    var data = null;
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status});
    }
    date = today();
    var query = {
        text: 'SELECT * FROM '+ tableName + ' WHERE '+paramkey+' = $1',
        values: [paramvalue],
    };
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Select at ' + date + ', returning ' + JSON.stringify(res.rows[0]));
            data = res.rows[0];
            status = 'SUCCES';
        }
        http_response.send({status: status, data: data});
        
      });
}

function findAll(http_response) {
    var data = [];
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status});
    }

    date = today();
    var query = {
        text: 'SELECT * FROM '+ tableName,
    };
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Select at ' + date + ', returning ' + JSON.stringify(res.rows));
            res.rows.forEach(r => data.push(r));
            status = 'SUCCES';
        }
        http_response.send({status: status, data: data, });
        
      });
}

module.exports = {save, find, findAll}