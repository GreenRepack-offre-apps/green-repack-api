
var dateFormat = require('dateformat');

var APPNAME = "Green Repack";
var GLOBAL_ROUTES = {
    marchand: '/marchand',
    client:'/client',
    produit:'/produit',
    commande:'/commande'
};
var DB_TABLE = {
    marchand: 'marchand',
    client:'client',
    produit:'produit',
    commande:'commande'
}


function todayWithHours() {
    return dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
}

function today() {
    var date = dateFormat(new Date(), "yyyy-mm-dd");
    console.log('TODAY IS : ' + date);
    return date;
}

module.exports = {
    local_config:{
        app: APPNAME,
        routes: GLOBAL_ROUTES
    },
    db_config:{
        tables: DB_TABLE
    },
    today,
    todayWithHours
}