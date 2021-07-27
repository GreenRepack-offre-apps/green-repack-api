

function marchandData(id, body) {
    return {
        idmar: id, //to generate
        nom: body.nom,
        email: body.email,
        password: body.password,
    };
}

function input(body) {
    return {
        idmar: body.idmar,
        nom: body.nom,
        email: body.email,
        password: body.password,
        date: body.date
    };
}

module.exports = {
    marchandData
};