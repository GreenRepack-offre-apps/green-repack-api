var express = require('express');
const { save, findAll, findByAny, update } = require('../../services/users/users');
var route = express.Router();


route.get('/list', async(req, res) => {
    console.log('[API][USER] => fetch all marchands !');
    const rep = findAll(res);
    res.send(rep);
});

route.post('/create', async(req, res) => {
    console.log('[API][USER] => creating a USER Info');
    var rep = null;
    await save(req.body).then(rst => rep = rst);
    res.send(rep);
});
route.post('/update', async(req, res) => {
    console.log('[API][USER] => updating  USER ...');
    const id = req.query.iduser;
    console.log("With Body USER "+JSON.stringify(req.body) 
    + ' & param: ' + id);
    var rep = null;
    await update(req.body, id).then(rst => rep = rst);
    res.send(rep);
});

var id_user = null;

route.param('iduser', function(req, res, next, val) {
    console.log('[API][USER][PARAM] => found id : ' + val);
    id_user = val;
    next();
 });

route.get('/get/:iduser', async(req, res) => {
    console.log('[API][USER] => fetch USER by id : ' + id_user);
    const rep = await findByAny('iduser', id_user);
    res.send(rep);
});

route.get('/get', async(req, res) => {
    console.log('[API][USER] => fetch USER by param : ' + JSON.stringify(req.query));
    var rep = null;
    if(req.query.email) {
        await findByAny('email', req.query.email)
        .then(rst => rep = rst);
    }else if(req.query.id) {
        rep = await findByAny('iduser', req.query.id);
    }else if(req.query.adresse) {
        rep = await findByAny('adresse' ,req.query.adresse);
    }else if(req.query.datecreation) {
        rep = await findByAny('datecreation', req.query.datecreation);
    }else if(req.query.nom){
        rep = await findByAny('nom', req.query.nom);
    }
    console.log('[API][USER] => reponse user : ' + JSON.stringify(rep));
    res.send(rep);
});
module.exports = route;