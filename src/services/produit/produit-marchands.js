const { query, json } = require("express");
const { today, db_config, todayWithHours } = require("../../common/utils");
const { custom_log } = require("../../common/log");
var {client, err_connnection}= require("../db");
const { default: DateDiff } = require("date-diff");

tableName = db_config.tables.produit;

tableNameRef = db_config.tables.marchand;

function save(body) {
    return new Promise((resolve, reject) => {
        var idprod = null;
        var status = 'ECHEC';
        if (err_connnection) {
            reject({status:status});
        }else if(!body.user_email) {
            reject({status:status});
            return;
        }
        
        var statut_validation =  'INIT';
        date = todayWithHours();
    
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
                reject({status:status});
            } else {
                custom_log('[QUERY OUT][' + tableName + ']', 'Insert at ' + date + ', ' + body.user_email);
                console.log('produit => '+ JSON.stringify(res));
                idprod = res.rows[0].idprod;
                status = 'SUCCES';
                d = res.rows[0].date_ajout;
                resolve({status:status, id:idprod, date: d});
            }
            
        });   
    })
   
}

// function selectAllProducts(etat_dem, http_response) {
//     var data = [];
//     var status = 'ECHEC';
//     if (err_connnection) {
//         http_response.send({status:status, data:data});
//     }
//     if(etat_dem) {
//         queryProduct = {
//             text: 'SELECT idprod, refmar, date_ajout, date_fin, date_fin, statut_validation, marque, model,'
//             +' categorie, info_tech,info_esth, prix, email AS user FROM '+ tableName + ', '+ db_config.tables.marchand+' WHERE refmar = idmar AND statut_validation = $1 ORDER BY date_fin',
//             values: [etat_dem]
//         };
//     } else { 
//         queryProduct = {
//             text: 'SELECT idprod, refmar, date_ajout, date_fin, date_fin, statut_validation, marque, model,'
//             +' categorie, info_tech,info_esth, prix, email AS user FROM '+ tableName + ',' + db_config.tables.marchand + ' WHERE refmar = idmar ORDER BY date_fin',
//         };
//     }

//     var date = today();
//     custom_log('[QUERY]', queryProduct.text);
//     client.query(queryProduct, (err, res) => {
//         if (err) {
//             custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
//         } else {
//             custom_log('[QUERY OUT][' + tableName + ']', '  Select at ' + date + ', result: ' +JSON.stringify(res.rows));
//             console.log('marchand id '+ JSON.stringify(res.rows));

//             status = 'SUCCES';
//         }
//         http_response.send({status:status, data:data});
//       });
// }

// function selectProducts(email, etat_dem, http_response) {
//     var data = [];
//     var status = 'ECHEC';
//     if (err_connnection && !email) {
//         http_response.send({status:status, data:data});
//     }

//     const tableNameRef = db_config.tables.marchand;
//     var queryProduct = null;
//     if(etat_dem) {
//         queryProduct = {
//             text: 'SELECT * FROM '+ tableName + ' WHERE refmar = (SELECT idmar FROM '+tableNameRef +' WHERE email = $1) AND statut_validation = $2 ORDER BY date_fin',
//             values: [email, etat_dem]
//         };
//     } else { 
//         queryProduct = {
//             text: 'SELECT * FROM '+ tableName + ' WHERE refmar = (SELECT idmar FROM '+tableNameRef +' WHERE email = $1 ORDER BY date_fin)',
//             values: [email]
//         };
//     }
//     var date = today();
//     custom_log('[QUERY]', queryProduct.text);
//     client.query(queryProduct, (err, res) => {
//         if (err) {
//             custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
//         } else {
//             custom_log('[QUERY OUT][' + tableName + ']', '  Select at ' + date + ', result: ' +JSON.stringify(res.rows));
//             console.log('marchand id '+ JSON.stringify(res.rows));
//             res.rows.forEach( r => {
//                 var diff =  r.date_fin?new DateDiff(new Date(), r.date_fin).days():null;
//                 //r['delais'] = diff.days();
//                 Object.assign(r, {delais: 15 - (Math.ceil(diff)-1)});
//                 data.push(r);
//             });
//             status = 'SUCCES';
//         }
//         http_response.send({status:status, data:data});
//       });
// }

// function selectOneProduct(idProduit, http_response) {
//     var data = null;
//     var status = 'ECHEC';
//     if (err_connnection && !email) {
//         http_response.send({status:status, data:data});
//     }
//     var queryProduct = {
//         text: 'SELECT * FROM '+ tableName + ' WHERE idprod = $1',
//         values: [idProduit]
//     }
//     var date = today();
//     custom_log('[QUERY]', queryProduct.text);
//     client.query(queryProduct, (err, res) => {
//         if (err) {
//             custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
//         } else {
//             custom_log('[QUERY OUT][' + tableName + ']', '  Select at ' + date + ', result: ' +JSON.stringify(res.rows));
//             console.log('marchand id '+ JSON.stringify(res.rows));
//             data = res.rows[0];
//             status = 'SUCCES';
//         }
//         http_response.send({status:status, data:data});
//       });
// }


function update(body){
   return new Promise ((resolve, reject) => {
    var status = 'ECHEC';
    if (err_connnection) {
        resolve({status:status});
    }
    dateHour = todayWithHours();
    const tableNameRef = db_config.tables.marchand;
    var query = {};
    if(body.prix){
        query = {
            text: 'UPDATE '+ tableName + ' SET statut_validation = $1, date_fin = $2, prix = $3, ex_state = $5 WHERE idprod = $4 AND statut_validation = $5',
            values: [body.etat_dem_next, dateHour, body.prix, body.idproduit, body.etat_dem_now]
        };
    }else{
        query = {
            text: 'UPDATE '+ tableName + ' SET statut_validation = $1, date_fin = $2, ex_state = $4 WHERE idprod = $3 AND statut_validation = $4',
            values: [body.etat_dem_next,  dateHour, body.idproduit, body.etat_dem_now]
        };
    }

    custom_log('[QUERY]', query.text);
    client.query(query, (err, res) => {
        if (err) {
            custom_log('[QUERY OUT][' + tableName + ']',  'Update Fail, cause: ' + err);
            status = 'ECHEC';
            resolve({status:status});
        } else {
            custom_log('[QUERY OUT][' + tableName + ']', '  Update at ' + dateHour);
            status = 'SUCCES';
            resolve({status:status});
        }
       
      });
   });
}

function selectProduitsMarchand(param) {
    return new Promise((resolve, reject) => {
        var data = null;
        var status = 'ECHEC';
        if (err_connnection) {
           resolve({status:status, data:data});
        }
        var queryProduct = {};
        if(!param){
            queryProduct = { 
                text: 'SELECT * FROM '+ tableName
            };
        }else{
            var text = 'SELECT * FROM '+ tableName + ' WHERE';
            var i = 1;
            for([key, val] of Object.entries(param)) {
                text += ' '+ key + ' = $' + i;
                i++;
            };
            queryProduct = { 
                text: text,
                values: Object.values(param)
            };
        }
        var date = today();
        queryProduct.values?custom_log('[QUERY]', queryProduct.text):custom_log('[QUERY]',  queryProduct.text + ' values= '+JSON.stringify(queryProduct.values));
        client.query(queryProduct, (err, res) => {
            if (err) {
                custom_log('[QUERY OUT][' + tableName + ']',  'Select Fail, cause: ' + err);
                resolve({status:status, data:data});
            } else {
                custom_log('[QUERY OUT][' + tableName + ']', '  Select at ' + date + ', result: ' +JSON.stringify(res.rows));
                data = [];
                res.rows.forEach( r => {
                    var diff =  r.date_fin?new DateDiff(new Date(), r.date_fin).days():null;
                    //r['delais'] = diff.days();
                    Object.assign(r, {delais: 15 - (Math.ceil(diff)-1)});
                    data.push(r);     
                });
                status = 'SUCCES';
                resolve({status:status, data:data});
            }
          });
    });
}


module.exports = {selectProduitsMarchand, save, update};