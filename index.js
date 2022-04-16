
//var cookieParser = require('cookie-parser');
require("dotenv").config();
var express = require('express');
var cors = require('cors');
var path = require('path');
const { local_config } = require('./src/common/utils');
var app = express();

app.use(cors());
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
app.use(express.static("src/paybox"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.set('view engine', 'pug');
//app.set('views', path.join(__dirname, 'views/paiements'));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send({app:{name:local_config.app}});
});

var marchanRoute = require('./src/routes/marchand/marchand');
app.use('/api'+ local_config.routes.marchand, marchanRoute);

var clientRoute = require('./src/routes/client/client');
app.use('/api'+ local_config.routes.client, clientRoute);

var produitRoute = require('./src/routes/produit/produit');
app.use('/api'+ local_config.routes.produit, produitRoute);

var associationRoute = require('./src/routes/association/association-projects');
app.use('/api'+ local_config.routes.association, associationRoute);

var paiementsRoute = require('./src/routes/paiement/transaction');
app.use('/paiement', paiementsRoute);

// app.get('/paiement/init', (req, res) => {
//   if(req.query.marchand) {
//     res.redirect('../check.html?user='+req.query.marchand);
//   } else if(req.query.client) {
//     res.redirect('../check.html?user='+req.query.client);
//   }
    
  //   res.render('../check', {
  //     amount: 14,
  //     content: "Paiement du produit"
  //   });
// });
var dict = {a: 1, b: 2, c: 3}; 
for([key, val] of Object.entries(dict)) {
  console.log(key, val);
}
for(v of Object.values(dict)) {
  console.log(v);
}
app.listen(port, () => {
    console.log('[API] => Green-Repack app listening at http://localhost:'.concat(port));
});