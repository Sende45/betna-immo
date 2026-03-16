const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  try {
    const { priceId } = req.body;
    const userId = req.user.id; // Récupéré via le middleware auth

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // L'ID que tu as copié de ton dashboard Stripe
          quantity: 1,
        },
      ],
      // ✅ Metadata cruciale pour le Webhook
      metadata: {
        userId: userId,
      },
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Error:", err);
    res.status(500).json({ message: "Erreur lors de la création de la session de paiement" });
  }
};