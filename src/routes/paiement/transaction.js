const express = require("express");
//const app = express();
// This is your real test secret API key.
const stripe = require("stripe")("sk_test_51JkjkqDKurM3h7MYBDhMhoJuzrM2gVo0hOCbsi5uiaww1TfXprZ6EAZatFDJMhZ0elYRsrsLHmgxpZR83PqvOiWd0066SKKo3C");
var route = express.Router();

route.use(express.static("src/paybox"));
//route.use(express.json());

var calculateOrderAmount = (amount) => {
  return amount * 10;
};
/**
 * Paiement du produit recyclé
 */
route.post("/gestion/to/marchand", async (req, res) => {
  var { items } = req.body;
  // {marchand_id, marchand_mail, amount}
  //req.body = 
  //get from db = {marchand_mail, amount, product_} 
  
  var amount = 14;
  // Create a PaymentIntent with the order amount and currency
  var paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(amount),
    currency: "eur"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

/**
 * Remboursement faits
 */

route.post("/marchand/to/gestion", async (req, res) => {
    var { items } = req.body;
    // Create a PaymentIntent with the order amount and currency
    var paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "eur"
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret
    });
  });

  /**
   * Achats clients
   */

   route.post("/client/to/gestion", async (req, res) => {
    var { items } = req.body;
    // Create a PaymentIntent with the order amount and currency
    var paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "eur"
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret
    });
  });



//app.listen(4242, () => console.log('Node server listening on port 4242!'));
module.exports = route;