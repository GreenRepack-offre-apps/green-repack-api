

function marchandData(id, body) {
    return {
        idmar: id, //to generate
        nom: body.nom,
        email: body.email,
        password: body.password,
    };
}

function input(r) {
    return {
        idmar: body.idmar, //to generate
        nom: body.nom,
        email: body.email,
        password: body.password,
        date: body.date
    };
}

module.exports = {
    marchandData
};