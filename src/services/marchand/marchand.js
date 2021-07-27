const { query, json } = require("express");
const { today, db_config, todayWithHours } = require("../../common/utils");
const { custom_log } = require("../../common/log");
const { marchandData } = require("../../models/marchand-models");
var {client, err_connnection}= require("../db");

var tableName = db_config.tables.marchand;

//ex: VALUES ('e-electronics', 'e@email.com', 'motdepasse', '2021-07-24')
function save(body, http_response) {
    if (err_connnection) {
        http_response.send({statut:'ECHEC'});
    }
    date = today();
    var query = {
        text: 'INSERT INTO '+ tableName + '(nom, email, password, adresse, datecreation) VALUES($1, $2, $3, $4, $5)',
        values: [body.nom, body.email, body.password, body.adresse, date],
    };
    client.query(query, (err, res) => {
        var status = 'ECHEC';
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Insert Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Insert at ' + date + ', ' + body.nom +'/' +body.email);
            statut = 'SUCCES';
        }
        http_response.send({statut: status});
      });
}

function findAll(http_response){
    if (err_connnection) {
        http_response.send({data: []});
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
        }
        http_response.send({data: marchands});
    });
}

function findById(id, http_response) {
    if (err_connnection) {
        http_response.send({rechParam: 'ID', value:null});
    }
    var query = {
        text: 'SELECT * FROM '+ tableName + ' WHERE idmar = $1',
        values: [id],
    };
    client.query(query, (err, res) => {
        var val = null;
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Fail');
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Select at ' + todayWithHours() + ', ' +res.rows[0]);
            val = res.rows[0];
        }
        http_response.send({rechParam: 'ID', value: val});
    });
}

function findByOther(search, http_response){
    if (err_connnection) {
        http_response.send({data: []});
    }
    var query = {
        text: 'SELECT * FROM '+ tableName + 'WHERE name LIKE ' + search + '% OR email LIKE ' + search+ '%',
        values: [body.nom, body.email, body.password, date]
    };
    client.query(query, (err, res) => {    
        var marchands = [];
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Fail, cause : ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Select at ' + today() + ', fetch' + body.nom +'/' + body.email);
            res.rows.forEach(row => {
                marchands.push(row);
            });
        }
        
        http_response.send(marchands);
      });
}

module.exports = {
    save,
    findAll,
    findById,
    findByOther
};

