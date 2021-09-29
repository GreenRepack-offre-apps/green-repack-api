
const { today, db_config, todayWithHours } = require("../../../common/utils");
const { custom_log } = require("../../../common/log");
var {client, err_connnection}= require("../../db"); 



var tableName = db_config.tables.projets;

function add(body, rna_exist, http_response) {
    var data = null;
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status});
    }else if(rna_exist == false){
        res.send({status:'ECHEC_RNA'});
    }
    date = todayWithHours();
    var query = {
        text: 'INSERT INTO '+ tableName + '(refassos, titre, description, datecreate) VALUES($1, $2, $3, $4)',
        values: [body.refassos, body.titre, body.description, date]
    };
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Insert Fail, cause: ' + err);
            if(err.message.includes('assos_rna_id_uniq_constr')) {
                status = 'EXIST';
            }
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', 'Insert at ' + date + ', ' + body.refassos);
            status = 'SUCCES';
        }
        http_response.send({status: status}); 
      });
}

function findAssosProjects(rnaRef, http_response) {
    var data = null;
    var status = 'ECHEC';
    if (err_connnection) {
        http_response.send({status:status, data: data});
        return;
    }

    date = today();
    var query = {
        text: 'SELECT * FROM '+ tableName + ', WHERE refassos = (Select idassos FROM '+ db_config.tables.association + ' WHERE rna_id = $1)',
        values: [rnaRef],
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

function getAll(){

}


module.exports = {add, findAssosProjects, getAll}