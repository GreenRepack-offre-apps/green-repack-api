var express = require('express');
const { save, findAll, findById } = require('../../services/marchand/marchand');
const { auth } = require('../../services/authent');
var route = express.Router();


route.get('/list', auth, (req, res) => {
    console.log('[API][Marchand] => fetch all marchands !');
    findAll(res);
});

route.post('/create', (req, res) => {
    console.log('[API][Marchand] => creating a marchand Info');
    save(req.body, res);
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

module.exports = route;