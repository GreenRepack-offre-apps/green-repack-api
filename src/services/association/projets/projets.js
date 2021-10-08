
const { today, db_config, todayWithHours } = require("../../../common/utils");
const { custom_log } = require("../../../common/log");
var {client, err_connnection}= require("../../db"); 



var tableName = db_config.tables.projets;

function add(body, http_response) {
    var data = null;
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status});
    }
    date = todayWithHours();
    var query = {
        text: 'INSERT INTO '+ tableName + '(refassos, titre, description, datecreate) VALUES($1, $2, $3, $4)',
        values: [body.refassos, body.titre, body.description, date]
    };
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Insert Fail, cause: ' + err);
            if(err.message.includes('projets_nom_uniq_constr') || err.message.includes('projets_description_uniq_constr')) {
                status = 'EXIST';
            }
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Insert at ' + date + ', ' + body.refassos);
            status = 'SUCCES';
        }
        http_response.send({status: status}); 
      });
}

function remove(idprj, http_response) {
    var data = null;
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status});
    }
    date = todayWithHours();
    var query = {
        text: 'DELETE FROM '+ tableName + ' WHERE idproj= $1',
        values: [idprj]
    };
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Delete Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Delete at ' + date + ', ' + body.refassos);
            status = 'SUCCES';
        }
        http_response.send({status: status}); 
      });
}

function findAssosProjects(refIdassos, refRna, statut, http_response) {
    var data = [];
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status, data: data});
        return;
    }

    date = today();
    if(refRna && statut == null){
        var query = {
            text: 'SELECT * FROM '+ tableName + ' WHERE refassos = (SELECT idassos FROM '+ db_config.tables.association + ' WHERE rna_id = $1)',
            values: [refRna]
        };
    }
    // if(refRna != null){
    //     var query = {
    //         text: 'SELECT * FROM '+ tableName + ' WHERE statut=$1 AND refassos = (SELECT idassos FROM '+ db_config.tables.association + ' WHERE rna_id = $2)',
    //         values: [statut, refRna]
    //     };
    // }else if(refIdassos != null){
    //     var query = {
    //         text: 'SELECT * FROM '+ tableName + ' WHERE refassos = $1 AND statut = $2',
    //         values: [refIdassos, statut]
    //     };
    // }
    
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Select at ' + date + ', returning ' + JSON.stringify(res.rows));
            res.rows.forEach(r => {
                data.push(r);
            });
            status = 'SUCCES';
        }
        http_response.send({status: status, data: data});
      });
}

function getAll(withattente, http_response){
    var data = [];
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status, data: data});
        return;
    }

    date = today();
    if(withattente){
        var query = {
            text: 'SELECT * FROM '+ tableName + ' p ,'+ db_config.tables.association+' a WHERE p.refassos=a.idassos AND p.statut=$1 ORDER BY p.datecreate;',
            values: ['EN_ATTENTE']
        };
    }else{
        var query = {
            text: 'SELECT * FROM '+ tableName + ' p ,'+ db_config.tables.association+' a WHERE p.refassos=a.idassos AND p.statut=$1 ORDER BY p.datecreate;',
            values: ['VALIDER']
        };
    }

    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Select at ' + date + ', returning ' + JSON.stringify(res.rows));
            res.rows.forEach(r => {
                data.push({
                    idassos:r.idassos,
                    nom: r.nom,
                    projet:{
                        idproj: r.idproj,
                        refassos: r.refassos,
                        titre: r.titre,
                        description: r.description,
                        datecreate: r.datecreate,
                        datevalid: r.datevalid,
                        statut: r.statut,
                        argentcollect: r.argentcollect
                    }
                });
            });
            status = 'SUCCES';
        }
        http_response.send({status: status, data: data});
      });
}

function update(projetBody, withattente, http_response) {
    var data = null;
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status});
    }
    date = todayWithHours();

    if(withattente) {
        var query = {
            text: 'UPDATE '+ tableName + 'SET statut=$1, datevalid=$2 WHERE idproj=$3 AND refassos=$4',
            values: [projetBody.statut, date, projetBody.idproj, projetBody.refassos]
        };
    }else{
        var query = {
            text: 'UPDATE '+ tableName + 'SET argentcollect=$1 WHERE idproj= $2 AND refassos=$3',
            values: [projetBody.argentcollect, projetBody.idproj, projetBody.refassos]
        };
    }

    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Update Fail, cause: ' + err);
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Update at ' + date + ', ' + body.refassos);
            status = 'SUCCES';
        }
        http_response.send({status: status}); 
      });
}


module.exports = {add, remove, findAssosProjects, getAll, update}