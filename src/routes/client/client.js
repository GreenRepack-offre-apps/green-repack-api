var express = require('express');
const { add, get} = require('../../services/client/client');
var route = express.Router();

route.post("/add", (req, res) => {
    if(req.body) {
     add(req.body, res);
    }
});

route.get('/get', (req, res) => {
    if(req.query.id){
        get('idcli', req.query.id, res); 
    }else  if(req.query.refmar){
        get('refmar', req.query.refmar, res); 
    } else if(req.query.email){
        get('email', req.query.email, res); 
    } 
});

module.exports = route;