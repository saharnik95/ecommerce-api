const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      payment_method_data: {
        type: 'card',
        card: {
          token: req.body.tokenId,
        },
      },
      confirm: true,
      return_url: 'http://localhost:3000/payment-success', 
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });

    console.log("PaymentIntent:", paymentIntent);

    res.status(200).json(paymentIntent);
  } catch (error) {
    console.error("Payment Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;