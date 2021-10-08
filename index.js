
//var cookieParser = require('cookie-parser');
require("dotenv").config();
var express = require('express');
var cors = require('cors');
const { local_config } = require('./src/common/utils');
var app = express();

app.use(cors());
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

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

var associationRoute = require('./src/routes/association/association');
app.use('/api'+ local_config.routes.association, associationRoute);

app.listen(port, () => {
    console.log('[API] => Green-Repack app listening at http://localhost:'.concat(port));
});