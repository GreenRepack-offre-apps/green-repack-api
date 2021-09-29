var express = require('express');
const { save, valid, find, findAll } = require('../../services/association/association');
const { add, findAssosProjects, getAll } = require('../../services/association/projets/projets');
var route = express.Router();
var request = require('request');

const API_RNA_ASSOS = 'https://entreprise.data.gouv.fr';

function rnaPublicInfo(httpBody, res) {
    var path = API_RNA_ASSOS + '/api/rna/v1/id/' + httpBody.rna; 
    request.get(path, (error, response, body) => {
        if(error) {
            console.log('[EXT API][association rna] => ERROR: ' + error);
            return null;
        }
        else if(response.statusCode != 200){ 
            console.log('[EXT API][association rna] => RESPONSE: : ' + JSON.stringify(response));
            return null;
        }
        else if(body != undefined) {
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
               return valid(httpBody, requestBody, res);
            }else{
               return null;
            }    
        }
    });
}
function rnaPublicInfo2(rna, res) {
    var path = API_RNA_ASSOS + '/api/rna/v1/id/' + rna; 
    request.get(path, (error, response, body) => {
        if(error) {
            console.log('[EXT API][association rna] => ERROR: ' + error);
            return find(null, null, null, res);
        }
        else if(response.statusCode != 200){ 
            console.log('[EXT API][association rna] => RESPONSE: : ' + JSON.stringify(response));
            return find(null, null, null, res);
        }
        else if(body != undefined) {
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
               return find(rna, 'rna_id', requestBody, res);
            }else{
                return find(null, null, null, res);
            }    
        }
    });
}
function isRnaPublicDatabase(reqBody, res) {
   
    var path = API_RNA_ASSOS + '/api/rna/v1/id/' + reqBody.rna;
      
    request.get(path, (error, response, body) => {
        if(error) {
            console.log('[EXT API][association rna] => ERROR: ' + error);
            save(reqBody, false, res);
        }else if(response.statusCode !== 200){ 
            console.log('[EXT API][association rna] => RESPONSE: : ' + JSON.stringify(response));
            save(reqBody, false, res);
        }
        else if(body) {
            body_parser = JSON.parse(body);    
            console.log('[EXT API][association rna] => Extrait: ' + JSON.stringify(body_parser));
          
            if(body_parser.association) {
                save(reqBody, true, res);
            }else{
                save(reqBody, false, res);
            }    
        }
    });
}

route.post('/create', (req, res) => {
    console.log('[API][ASSOCIATION] => creating ASSOS account...');
    if(req.body.rna){
        isRnaPublicDatabase(body, res);
    }
});
route.post('/login', (req, res) => {
    console.log('[API][ASSOCIATION] => get info ASSOS...');
    if(req.body.rna){
        rnaPublicInfo(req.body, res);
    }
});

route.get('/list', (req, res) => {
    console.log('[API][ASSOCIATION] => get all ASSOS...');
    findAll(res);
});

route.get('/get', (req, res) => {
    console.log('[API][ASSOCIATION] => get one Assos ...');
    if(req.query.rna) {
        rnaPublicInfo2(req.query.rna, res);
    } else if (req.query.id) {
        find(req.query.id, 'idassos',null, res);
    }
});

/**
 * PROJECTS
 */
route.get('/projets/list', (req, res) => {
    console.log('[API][PROJET] => get assos all project...');
    if(req.query.rna) {
        findAssosProjects(rna,res);
    }
});

route.get('/projets/all', (req, res) => {
    console.log('[API][PROJET] => get all ...');
    getAll();
});

route.post('/projets/add', (req, res) => {
    if(req.body) {
        add(req.body, res);
    }
});

route.get('/projets/get', (req, res) => {
    console.log('[API][PROJET] => get one ...');
    if(req.query.idproj){

    }
});
module.exports = route;