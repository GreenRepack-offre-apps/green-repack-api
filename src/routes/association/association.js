var express = require('express');
const { save, valid, find, findAll } = require('../../services/association/association');
var route = express.Router();
var request = require('request');

const API_RNA_ASSOS = 'https://entreprise.data.gouv.fr';

function rnaPublicInfo(rna) {
    var path = API_RNA_ASSOS + '/api/rna/v1/id/' + rna; 
    request.get(path, (error, response, body) => {
        if(error) {
            console.log('[EXT API][association rna] => ERROR: ' + error);
            return null;
        }
        if(response){ 
            console.log('[EXT API][association rna] => RESPONSE: : ' + JSON.stringify(response));
            return null;
        }
        if(body) {
            console.log('[EXT API][association rna] => BODY: ' + body);
            body_parser = JSON.parse(body);    
            console.log('[EXT API][association rna] => Extrait: ' + JSON.stringify(body_parser));
          
            if(body_parser.association) {
                association = body_parser.association;
                requestBody = {
                    rna: association.id_association,
                    creationDateAssos: association.date_publication_creation,
                    nom: association.titre,
                    description: association.objet,
                    emailAssos: association.email, 
                    telephone: association.telephone,
                    siteweb: association.site_web
                };
               return requestBody;
            }else{
               return null;
            }    
        }
    });
}
function isRnaPublicDatabase(reqBody, res) {
   
    var path = API_RNA_ASSOS + '/api/rna/v1/id/' + reqBody.rna;
      
    request.get(path, (error, response, body) => {
        if(error) {
            console.log('[EXT API][association rna] => ERROR: ' + error);
            res.send({status:'ECHEC', data: null});
        }
        if(response){ 
            console.log('[EXT API][association rna] => RESPONSE: : ' + JSON.stringify(response));
            res.send({status:'ECHEC', data: null});
        }
        if(body) {
            console.log('[EXT API][association rna] => BODY: ' + body);
            body_parser = JSON.parse(body);    
            console.log('[EXT API][association rna] => Extrait: ' + JSON.stringify(body_parser));
          
            if(body_parser.association) {
                association = body_parser.association;
                requestBody = {
                    rna: reqBody.rna,
                    password: reqBody.password,
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
route.post('/login', (req, res) => {
    console.log('[API][ASSOCIATION] => get info ASSOS...');
    if(req.body.rna){
        info = rnaPublicInfo(rna);
        valid(req.body, info, res);
    }
});

route.get('/list', (req, res) => {
    console.log('[API][ASSOCIATION] => get all ASSOS...');
    findAll(res);
});

route.get('/get', (req, res) => {
    console.log('[API][ASSOCIATION] => get one assos ...');
    if(req.query.rna) {
        info = rnaPublicInfo(rna);
        find(req.query.rna, info, 'rna_id', res);
    }else if(req.query.id) {
        find(req.query.id, null,'idassos', res);
    }
});

module.exports = route;