

function rechParamModel(body){
    var entries = [];
    var values = [];
    for([key, val] of Object.entries(body)) {
        entries.push(key);
        values.push(val);
    }
    return{
        entries,
        values
    }
}

module.exports = {
    rechParamModel
};