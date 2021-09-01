const { query, json } = require("express");
const { today, db_config, todayWithHours } = require("../../common/utils");
const { custom_log } = require("../../common/log");
var {client, err_connnection}= require("../db");

tableName = db_config.tables.produit;

function saveProduct(body, http_response) {
    var idprod = null;
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status, id:idprod, date: null});
    }else if(body.user_email == null) {
        http_response.send({status:status, id:idprod, date: null});
        return;
    }
    
    tableNameRef = db_config.tables.marchand;

    var statut_validation =  'INIT';
    date = todayWithHours();

    tableName = db_config.tables.produit;
    var query = {
        text: 'INSERT INTO '+ tableName + '(refmar, date_ajout, date_fin, statut_validation, marque, model, categorie, info_tech, info_esth) '+ 
        'VALUES((Select idmar FROM '+ tableNameRef + ' WHERE email = $1), $2, $3, $4, $5, $6, $7, $8, $9) RETURNING idprod, date_ajout',
        values: [body.user_email, date, date, statut_validation, body.marque, body.model, body.categorie, body.info_tech, body.info_esth]
    };
    custom_log('[QUERY]', query.text);
    client.query(query, (err, res) => {
        var d = null;
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Insert Fail, cause: ' + err);
            status = 'ECHEC';
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Insert at ' + date + ', ' + body.user_email);
            console.log('produit => '+ JSON.stringify(res));
            idprod = res.rows[0].idprod;
            status = 'SUCCES';
            d = res.rows[0].date_ajout;
        }
        http_response.send({status:status, id:idprod, date: d});
    });   
}

function selectProducts(email, etat_dem, http_response) {
    var data = [];
    var status = 'ECHEC';
    if (err_connnection && !email) {
        http_response.send({status:status, data:data});
    }

    const tableNameRef = db_config.tables.marchand;
    var queryProduct = null;
    if(etat_dem) {
        queryProduct = {
            text: 'SELECT * FROM '+ tableName + ' WHERE refmar = (SELECT idmar FROM '+tableNameRef +' WHERE email = $1) AND statut_validation = $2',
            values: [email, etat_dem]
        };
    } else { 
        queryProduct = {
            text: 'SELECT * FROM '+ tableName + ' WHERE refmar = (SELECT idmar FROM '+tableNameRef +' WHERE email = $1)',
            values: [email]
        };
    }
    var date = today();
    custom_log('[QUERY]', queryProduct.text);
    client.query(queryProduct, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', '  Select at ' + date + ', result: ' +JSON.stringify( res.rows));
            console.log('marchand id '+ JSON.stringify(res.rows));
            res.rows.forEach( r => data.push(r));
            status = 'SUCCES';
        }
        http_response.send({status:status, data:data});
      });
}

function selectOneProduct(idProduit, http_response) {
    var data = null;
    var status = 'ECHEC';
    if (err_connnection && !email) {
        http_response.send({status:status, data:data});
    }
    var queryProduct = {
        text: 'SELECT * FROM '+ tableName + ' WHERE idprod = $1',
        values: [idProduit]
    }
    var date = today();
    custom_log('[QUERY]', queryProduct.text);
    client.query(queryProduct, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', '  Select at ' + date + ', result: ' +JSON.stringify(res.rows));
            console.log('marchand id '+ JSON.stringify(res.rows));
            data = res.rows[0];
            status = 'SUCCES';
        }
        http_response.send({status:status, data:data});
      });
}


function updateProductState(body, http_response){
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status});
    }

    const tableNameRef = db_config.tables.marchand;
    if(body.prix != 0){
        var query = {
            text: 'UPDATE '+ tableName + ' SET statut_validation = $1, date_fin = $2, prix = $3 WHERE idprod = $4 AND refmar = (SELECT idmar FROM '+tableNameRef +' WHERE email = $5) AND statut_validation = $6',
            values: [body.etat_dem_next, body.date_modif, body.prix, body.idproduit, body.email_user, body.etat_dem_now]
        };
    }else{
        var query = {
            text: 'UPDATE '+ tableName + ' SET statut_validation = $1, date_fin = $2, WHERE idprod = $3 AND refmar = (SELECT idmar FROM '+tableNameRef +' WHERE email = $4) AND statut_validation = $4',
            values: [body.etat_dem_next,  body.date_modif, body.idproduit, body.email_user, body.etat_dem_now]
        };
    }

    custom_log('[QUERY]', query.text);
    var date = today();
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Update Fail, cause: ' + err);
            status = 'ECHEC';
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', '  Update at ' + date + ', ' + body.email_user+'/'+res.rows);
            status = 'SUCCES';
        }
        http_response.send({status:status});
      });

}

module.exports = {saveProduct, selectProducts, selectOneProduct, updateProductState};