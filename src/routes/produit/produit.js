var express = require('express');
const { selectProducts, saveProduct, updateProductState } = require('../../services/produit/produit');
var route = express.Router();


route.post('/add', (req, res) => {
    saveProduct(req.body, res);
});

route.get('/list', (req, res) => {
    if(req.email_user){
        if(req.query.etat_dem){
            selectProducts(req.query.email_user, req.query.etat_dem, res);
        }else{
            selectProducts(req.query.email_user, null, res);
        }
    }
});

route.post('/update', (req, res) => {
    updateProductState(req.body, res);
});
module.exports = route;