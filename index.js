
//var cookieParser = require('cookie-parser');
var express = require('express');
const { local_config } = require('./src/common/utils');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

var port = process.env.PORT | 3000;

app.get('/', (req, res) => {
    res.send({app:{name:local_config.app}});
});

var marchanRoute = require('./src/routes/marchand/marchand');
app.use('/api'+ local_config.routes.marchand, marchanRoute);

app.listen(port, () => {
    console.log('Green-Repack app listening at http://localhost:'.concat(port));
});