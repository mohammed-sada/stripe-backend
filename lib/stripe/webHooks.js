"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhookHandler = void 0;
const __1 = require("..");
/*
 1- Validate the stripe webhook secret
 2- Call the handler for the event type
*/
// event types:
const webhookHandlers = {
    'payment_intent.succeeded': async (data) => {
        // fullfil the user purchase
    },
    'payment_intent.payment_failed': async (data) => { },
};
async function stripeWebhookHandler(req, res) {
    const sig = req.headers['stripe-signature'];
    const event = __1.stripe.webhooks.constructEvent(
    // validate that this webhook req is coming from stripe API
    req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    try {
        await webhookHandlers[event.type](event.data.object);
        //  Object containing the API resource relevant to the event => PaymentIntent Object in this case
        res.status(200).send({ received: true });
    }
    catch (err) {
        console.log(err);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
}
exports.stripeWebhookHandler = stripeWebhookHandler;
// Webhooks provide a way to listen to diffreent events that happen at the stripe API
//# sourceMappingURL=webHooks.js.map