var express = require('express');
const { save, findAll, findByAny, update } = require('../../services/marchand/marchand');
var route = express.Router();


route.get('/list', async(req, res) => {
    console.log('[API][Marchand] => fetch all marchands !');
    const rep = findAll(res);
    res.send(rep);
});

route.post('/create', async(req, res) => {
    console.log('[API][Marchand] => creating a marchand Info');
    const rep = await save(req.body);
});
route.post('/update', async(req, res) => {
    console.log('[API][Marchand] => updating  marchand ');
    console.log("Body marchand "+JSON.stringify(req.body));
    const rep = await update(req.body, res);
    res.send(rep);
});

var id_user = null;

route.param('idmar', function(req, res, next, val) {
    console.log('[API][Marchand][PARAM] => found id : ' + val);
    id_user = val;
    next();
 });

route.get('/get/:idmar', async(req, res) => {
    console.log('[API][USER] => fetch marchand by id : ' + id_user);
    const rep = await findByAny('iduser', id_user);
    res.send(rep);
});

route.get('/get', async(req, res) => {
    console.log('[API][Marchand] => fetch marchand by param : ' + JSON.stringify(req.query));
    var rep = null;
    if(req.query.email) {
        const {status, data} = await findByAny('email', req.query.email)
        .then(rst => rep = rst);
    }else if(req.query.id) {
        const rep = await findByAny('iduser', req.query.id);
    }else if(req.query.adresse) {
        const rep = await findByAny('adresse' ,req.query.adresse);
    }else if(req.query.datecreation) {
        const rep = await findByAny('datecreation', req.query.datecreation);
    }else if(req.query.nom){
        const rep = await findByAny('nom', req.query.nom);
    }
    console.log('[API][USER] => reponse user : ' + JSON.stringify(rep));
    res.send(rep);
});
module.exports = route;