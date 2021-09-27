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
        text: 'INSERT INTO '+ tableName + '(rna_id, datecreation_compte, password) VALUES($1, $2)',
        values: [body.rna, date, body.password]
    };
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Insert Fail, cause: ' + err);
            if(err.message.includes('rna_id_uniq_constr') || err.message.includes('rna_id_uniq_constr')){
                status = 'EXIST';
            }
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Insert at ' + date + ', ' + body.nom +'/' + body.emailCompte);
            status = 'SUCCES';
        }
        http_response.send({status: status}); 
      });
}

function valid(body, info, http_response){
    var data = null;
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status, data: data});
    }
    if(info == null){
        status = 'ECHEC_RNA';
        http_response.send({status:status, data: data});
    }
    date = today();
    var query = {
        text: 'SELECT * FROM '+ tableName + ' WHERE rna_id = $1 AND password = $2',
        values: [body.rna, body.password],
    };
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
            status = 'ECHEC_RNA_PSWD';
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Select at ' + date + ', returning ' + JSON.stringify(res.rows[0]));
            if(body.rna !=  res.rows[0].rna_id || body.password != res.rows[0].password){
                
                
            http_response.send({status: status, data: data});
            }
            data = {
                result: {
                    idassos: res.rows[0].idassos,
                    rnaId: res.rows[0].rna_id,
                    datecreation: res.rows[0].datecreation_compte
                },
                info: info,
            };
            status = 'SUCCES';
        }
        http_response.send({status: status, data: data});
        
      });
}

function find(paramvalue, paramkey, info, http_response) {
    var data = null;
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status});
    }
    date = today();
    var query = {
        text: 'SELECT idassos, rna_id, datecreation_compte FROM '+ tableName + ' WHERE '+paramkey+' = $1',
        values: [paramvalue],
    };
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Select at ' + date + ', returning ' + JSON.stringify(res.rows[0]));
            data = {
                result:{
                    idassos: res.rows[0].idassos,
                    rnaId: res.rows[0].rna_id,
                    datecreation: res.rows[0].datecreation_compte
                },
                info: info,
            };
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
        text: 'SELECT idassos, rna_id as rnaId, datecreation_compte as datecreation FROM '+ tableName,
    };
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Select at ' + date + ', returning ' + JSON.stringify(res.rows));
            res.rows.forEach(r => data.push(r));
            status = 'SUCCES';
        }
        http_response.send({status: status, data: data});
        
      });
}

module.exports = {save, valid, find, findAll}