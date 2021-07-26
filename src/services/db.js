const {Pool} = require('pg');

var client = new Pool({
  user: 'xwyidmgb',
  host: 'ella.db.elephantsql.com',
  database: 'xwyidmgb',
  password: '6c7eOY46Ni1EwKTQBiC04kuu7JhWLsTY'
});

var err_connnection = false;

client.connect()
    .then(r => console.log('DATABASE IS CONNECTED !!'))
    .catch(err => {
        console.log('DATABASE NOT CONNECTED !!, Cause: '+ err);
        err_connnection = true;
    });

module.exports = {client, err_connnection};