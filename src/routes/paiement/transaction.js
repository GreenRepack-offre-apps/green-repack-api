const express = require("express");
//const app = express();
// This is your real test secret API key.
const stripe = require("stripe")("sk_test_51JkjkqDKurM3h7MYBDhMhoJuzrM2gVo0hOCbsi5uiaww1TfXprZ6EAZatFDJMhZ0elYRsrsLHmgxpZR83PqvOiWd0066SKKo3C");
var route = express.Router();

route.use(express.static("src/paybox"));
//route.use(express.json());

var calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  var amount = 14;
  return amount * 10;
};
/**
 * Paiement du produit recyclé
 */
route.post("/gestion/to/marchand", async (req, res) => {
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