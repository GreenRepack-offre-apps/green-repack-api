
//var cookieParser = require('cookie-parser');
require("dotenv").config();
var express = require('express');
const { local_config } = require('./src/common/utils');
var app = express();

const {findByEmailAndPassword} = require('./src/services/authent');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

var port = process.env.PORT | 3000;

app.get('/', (req, res) => {
    res.send({app:{name:local_config.app}});
});

app.post('/auth', (req, res) => {
    console.log('[Route:/auth] => authenticate start ...');
    findByEmailAndPassword(req, res);
});

var marchanRoute = require('./src/routes/marchand/marchand');
app.use('/api'+ local_config.routes.marchand, marchanRoute);

app.listen(port, () => {
    console.log('[API] => Green-Repack app listening at http://localhost:'.concat(port));
});