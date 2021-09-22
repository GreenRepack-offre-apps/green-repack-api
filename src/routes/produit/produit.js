var express = require('express');
const { selectProducts, selectAllProducts, saveProduct, updateProductState, selectOneProduct } = require('../../services/produit/produit');
var route = express.Router();


route.post('/add', (req, res) => {
    saveProduct(req.body, res);
});

route.get('/list', (req, res) => {
    if(req.query.etat_dem){
        selectAllProducts(req.query.etat_dem, res);
    }else{
        selectAllProducts(null, res);
    }
});

route.get('/user/list', (req, res) => {
    if(req.query.email_user){
        if(req.query.etat_dem){
            selectProducts(req.query.email_user, req.query.etat_dem, res);
        }else{
            selectProducts(req.query.email_user, null, res);
        }
    }
});



route.get('/get', (req, res) => {
    if(req.query.idprod){
        selectOneProduct(req.query.idprod, res);
    }
});

route.post('/update', (req, res) => {
    updateProductState(req.body, res);
});
module.exports = route;