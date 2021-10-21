var express = require('express');
const { save, findAll, findById, findByAnyParam, update } = require('../../services/marchand/marchand');
var route = express.Router();


route.get('/list', (req, res) => {
    console.log('[API][Marchand] => fetch all marchands !');
    findAll(res);
});

route.post('/create', (req, res) => {
    console.log('[API][Marchand] => creating a marchand Info');
    save(req.body, res);
});
route.post('/update', (req, res) => {
    console.log('[API][Marchand] => updating  marchand ');
    console.log("Body marchand "+JSON.stringify(req.body));
    update(req.body, res);
});

var idMarchand = null;

route.param('idmar', function(req, res, next, val) {
    console.log('[API][Marchand][PARAM] => found id : ' + val);
    idMarchand = val;
    next();
 });

route.get('/get/:idmar', (req, res) => {
    console.log('[API][Marchand] => fetch marchand by id : ' + idMarchand);
    findById(idMarchand,res);
});

route.get('/get', (req, res) => {
    console.log('[API][Marchand] => fetch marchand by param : ' + JSON.stringify(req.query));
    if(req.query.email){
        findByAnyParam('email', req.query.email, res);
    }else if(req.query.id) {
        findByAnyParam('idmar', req.query.id, res);
    }else if(req.query.adresse) {
        findByAnyParam('adresse' ,req.query.adresse, res);
    }else if(req.query.datecreation) {
        findByAnyParam('datecreation', req.query.datecreation, res);
    }else if(req.query.nom){
        findByAnyParam('nom',req.query.nom, res);
    }
});

module.exports = route;