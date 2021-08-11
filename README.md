# green-repack-api

## Run app:
- 'npm run nodemon' (éxécution unique tous en modifant du code) 
- Ou 'npm start' (éxécution sans modificatiuon de code, si modification relancer la commande)


## Api info
### Création d'association sur l'api:

- URL: http://localhost:3000/api/association/create
<= Requete à envoyer:
{
    "rna": "W9C1000189",
    "email":"crr@email.com"
}

 = > Reponse en cas de succes.
{
    "status": "SUCCES",
    "data": {
        "rna": "W9C1000189",
        "emailCompte": "inn@email.com",
        "creationDateAssos": "1978-03-22",
        "nom": "INNER WHEEL DE CAYENNE CENTRE",
        "description": "Cette association a pour objet de promouvoir la sincère amitié, d'encourager l'idéal de développement personnel, 
			de stimuler l'entente internationale.",
        "emailAssos": null,
        "telephone": null,
        "siteweb": null
    }
}
= > Reponse en cas de: id rna ou le mail existe déja pour un utilisateur.
{
    "status": "EXIST",
    "data": null
}
 = > Reponse en cas de d'echec.
{
    "status": "SUCCES",
    "data": null
}