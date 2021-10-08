const { Query } = require("pg");
const { custom_log } = require("../../common/log");
const { db_config, today } = require("../../common/utils");
const { err_connnection, client } = require("../db");

var tableName = db_config.tables.client;

function add(body, http_response){
    console.log('body = '+ JSON.stringify(body));
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status});
    }
    date = today();
    var query = {};
    if(body.refmar != null){
        var query1 = {
            text: 'INSERT INTO '+ tableName + '(refmar, nom, prenom, email, adresse, datecreation) VALUES($1, $2, $3, $4, $5, $6) returning idcli',
            values: [body.refmar, body.nom, body.prenom, body.email, body.adresse, date]
        };
        query = query1;
    }else{
        query2 = {
            text: 'INSERT INTO '+ tableName + '(nom, prenom, email, adresse, datecreation) VALUES($1, $2, $3, $4, $5) returning idcli',
            values: [body.nom, body.prenom, body.email, body.adresse, date]
        };
        query = query2;
    }
    
    custom_log('[QUERY][' + tableName + ']',  JSON.stringify(query));
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Insert Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Insert at ' + date + ', ' +body.email+ ' result = '+JSON.stringify(res.rows[0]));
            if(res.rows[0].idcli){
                status = 'SUCCES';
            }
        }
        http_response.send({status: status});
        
      });
}

function get(key, value, http_response){
    var status = 'ECHEC';
    var data = null;
    if (err_connnection) {
        http_response.send({status:status, data:data});
    }
    date = today();
    var query = {
        text: 'SELECT * FROM '+ tableName + ' WHERE '+key+'=$1',
        values: [value],
    };
    custom_log('[QUERY][' + tableName + ']',  JSON.stringify(query));
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Select at ' + date + ', ' +res.rows.lenght != 0?JSON.stringify(res.rows[0]):'--empty--');
            data = res.rows.lenght != 0? res.rows[0]:null;
            status = 'SUCCES';
        }
        http_response.send({status: status, data:data});
        
      });
}

module.exports = {get, add}