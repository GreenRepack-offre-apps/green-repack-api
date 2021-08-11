const { query, json } = require("express");
const { today, db_config, todayWithHours } = require("../../common/utils");
const { custom_log } = require("../../common/log");
var {client, err_connnection}= require("../db");

tableName = db_config.tables.produit;

function saveProduct(body, http_response) {
    var idprod = null;
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status, id:idprod});
    }
    
    tableNameRef = db_config.tables.marchand;

    var statut_validation =  'INIT';
    date = todayWithHours();

    tableName = db_config.tables.produit;
    var query = {
        text: 'INSERT INTO '+ tableName + '(refmar, date_ajout, statut_validation, marque, model, categorie, info_tech, info_esth) '+ 
        'VALUES((Select idmar FROM '+ tableNameRef + ' WHERE email = $1), $2, $3, $4, $5, $6, $7, $8) RETURNING idprod',
        values: [body.user_email, date, statut_validation, body.marque, body.model, body.categorie, body.info_tech, body.info_esth]
    };
    custom_log('[QUERY]', query.text);
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Insert Fail, cause: ' + err);
            status = 'ECHEC';
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Insert at ' + date + ', ' + body.user_email);
            console.log('produit => '+ JSON.stringify(res));
            idprod = res.rows[0].idprod;
            status = 'SUCCES';
        }
        http_response.send({status:status, id:idprod});
    });   
}

function selectProducts(email, etat_dem, http_response) {
    var data = [];
    var status = 'ECHEC';
    if (err_connnection && !email) {
        http_response.send({status:status, data:data});
    }

    tableNameRef = db_config.tables.marchand;
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
    
    custom_log('[QUERY]', queryUser.text);
    client.query(queryProduct, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', '  Select at ' + date + ', ' + body.user_email+'/'+res.rows);
            console.log('marchand id '+ JSON.stringify(res.rows));
            res.rows.forEach( r => data.push(r));
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
    // action: exped: marchand , creer produit  => STATE = INIT
    // cas Etat: INIT => proposé un prix, automatiquement et non de gestion, du produit par rapport au marché. => STATE = OFFRE_1
    // action: exped: marchand, cas Etat: OFFRE_1 => accepter/refuser => STATE = ACCEPTE_MAR_1/ANNULER_MAR_1 => CLOTURER
    // cas Etat: ACCEPTER_1 => Génerer automatiquement le colismo d'envoi du produit (pdf). => STATE = EN_ATTENTE_RECUPERATION; 
    // cas Etat: EN_ATTENTE_RECUPERATION => si timestamp > 15 jours => STATE = CLOTURE;
    // cas Etat: EN_ATTENTE_RECUPERATION => si timestamp <= 15 jours, action: exped: Gestion, la Gestion enregistre /ou automatique l'arrivé du produit=> STATE = ENREGISTRE;
    // action: exped: gestion, ANNULER_GES / ACCEPTE_GES_1 / OFFRE_2 =>  
        // 1 - // cas Etat: ANNULER_GES => action: gestion, remboursement de frais d'envoie pour récupérer le produit à la gestion => STATE =  EN_ATTENTE_REMBOURSEMENT => CLOTURER;
        // 2 - // cas Etat: ACCEPTE_GES_1 => action: gestion, paiement du produit à l'utilisateur auto ou manuelle => STATE = EN_ATTENTE_PAIEMENT => VALIDER
        // 3 - // cas Etat: OFFRE_2 => action: gestion, proposer un nouveux prix, avec la raison du changement (optionnel)
    // action: marchand, cas Etat: OFFRE_2 => accepter/refuser => STATE = ACCEPTE_MAR_2 => EN_ATTENTE_PAIEMENT => VALIDER / STATE = ANNULER_MAR_2 => EN_ATTENTE_REMBOURSEMENT => CLOTURER;
    var query = {
        text: 'UPDATE '+ tableName + ' SET statut_validation = $1 WHERE idprod = $2 AND refmar = (SELECT idmar FROM '+tableNameRef +' WHERE email = $3) AND statut_validation = $4',
        values: [body.etat_dem_next, body.idproduit, body.email_user, body.etat_dem_now]
    };
    custom_log('[QUERY]', queryUser.text);

    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', '  Select at ' + date + ', ' + body.user_email+'/'+res.rows);
            status = 'SUCCES';
        }
        http_response.send({status:status});
      });

}

module.exports = {saveProduct, selectProducts, updateProductState};