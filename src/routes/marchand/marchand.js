var express = require('express');
const { save, findAll, findById } = require('../../services/marchand/marchand');
var mock_marchands = require('../../common/mock-marchand.json');
var route = express.Router();


route.get('/list', (req, res) => {
    console.log('fetch all marchands !');
    findAll(res);
});

route.post('/create', (req, res) => {
    console.log('creating a marchand Info');
    save(req.body, res);
});

var idMarchand = null;

route.param('idmar', function(req, res, next, val) {
    console.log('found id : ' + val);
    idMarchand = val;
    next();
 });

route.get('/get/:idmar', (req, res) => {
    console.log('fetch marchand by id : ' + idMarchand);
    findById(idMarchand,res);
});

module.exports = route;