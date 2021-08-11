var express = require('express');
const { save, find, findAll } = require('../../services/association/association');
var route = express.Router();
var request = require('request');

const API_RNA_ASSOS = 'https://entreprise.data.gouv.fr';

function isRnaPublicDatabase(reqBody, res) {
   
    var path = API_RNA_ASSOS + '/api/rna/v1/id/' + reqBody.rna;
      
    request.get(path, (error, response, body) => {
        if(error) {
            console.log('[EXT API][association rna] => ERROR: ' + error);
            res.send({status:'ECHEC', data: false});
        }
        if(error){ 
            console.log('[EXT API][association rna] => RESPONSE: : ' + JSON.stringify(response));
            res.send({status:'ECHEC', data: false});
        }
        if(body) {
            console.log('[EXT API][association rna] => BODY: ' + body);
            body_parser = JSON.parse(body);    
            console.log('[EXT API][association rna] => Extrait: ' + JSON.stringify(body_parser));
          
            if(body_parser.association) {
                association = body_parser.association;
                requestBody = {
                    rna: reqBody.rna,
                    emailCompte: reqBody.email,
                    creationDateAssos: association.date_publication_creation,
                    nom: association.titre,
                    description: association.objet,
                    emailAssos: association.email, 
                    telephone: association.telephone,
                    siteweb: association.site_web
                };
                save(requestBody, res);
            }else{
                res.send({status:'ECHEC', data: null});
            }    
        }
    });
}

route.post('/create', (req, res) => {
    console.log('[API][ASSOCIATION] => creating ASSOS account...');
    if(req.body.rna){
        isRnaPublicDatabase(req.body, res);
    }
});

route.get('/list', (req, res) => {
    console.log('[API][ASSOCIATION] => get all ASSOS...');
    findAll(res);
});

route.get('/get', (req, res) => {
    console.log('[API][ASSOCIATION] => get one assos ...');
    if(req.query.rna){
        find(req.query.rna, 'rna_id', res);
    }else if(req.query.email) {
        find(req.query.email, 'email_compte', res);
    }else if(req.query.nom) {
        find(req.query.rna, 'nom', res);
    }else if(req.query.id) {
        find(req.query.id, 'idassos', res);
    }
});

module.exports = route;