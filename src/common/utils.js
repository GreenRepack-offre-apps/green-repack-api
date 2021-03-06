
var dateFormat = require('dateformat');

var APPNAME = "Green Repack";
var GLOBAL_ROUTES = {
    users: '/users',
    produit:'/produit',
    commande:'/commande',
    association: '/association'
};

var DB_TABLE = {
    marchand: 'users',
    client:'users',
    produit:'produit_marchand',
    commande:'commande',
    association:'association',
    projets:'projets'
};


function todayWithHours() {
    return dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
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
};