var express = require('express');
const { selectProduitsMarchand, save, update } = require('../../services/produit/produit-marchands');
const { rechParamModel }= require('../../models/models');
var route = express.Router();


route.post('/add', async(req, res) => {
    await save(req.body, res);
    res.send(await selectProduitsMarchand(null));
});

route.get('/list', async(req, res) => {
    var rep = null;
    if(req.query.statut_validation){
        const params = {statut_validation:req.query.statut_validation};
        rep = await selectProduitsMarchand(params);
    }else{
        rep = await selectProduitsMarchand(null);
    }
    res.send(rep);
});

route.get('/user/list', async(req, res) => {
    var rep = null;
    if(req.query.refmar){
        var param = null;
        if(req.query.statut_validation){
            params = {
                refmar: req.query.refmar,
                statut_validation:req.query.statut_validation
            };
        }else{
            params = {
                refmar: req.query.refmar
            };
        }
        
        rep = await selectProduitsMarchand(params);
    }
    res.send(rep);
});


route.get('/get', async(req, res) => {
    if(req.query.idprod){
        rep = await selectProduitsMarchand({idprod:req.query.idprod});
        res.send({status:rep.status, data: rep.data.lenght !== 0?rep.data[0]: null});
    }
});

route.post('/update', async(req, res) => {
    await update(req.body, res);
    res.send(await selectProduitsMarchand(null));
});
module.exports = route;