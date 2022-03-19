"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhookHandler = void 0;
const __1 = require("..");
const firebase_1 = require("../firebase");
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
    'customer.subscription.deleted': async (data) => {
        const customer = (await __1.stripe.customers.retrieve(data.customer));
        const userId = customer.metadata.firebaseUID;
        const userRef = firebase_1.firestore.collection('users').doc(userId);
        await userRef.update({
            activePlans: (0, firebase_1.arrayRemove)(data.items.data[0].plan.id),
        });
    },
    'customer.subscription.created': async (data) => {
        const customer = (await __1.stripe.customers.retrieve(data.customer));
        const userId = customer.metadata.firebaseUID;
        const userRef = firebase_1.firestore.collection('users').doc(userId);
        await userRef.update({
            activePlans: data.items.data[0].plan.id,
        });
    },
    'invoice.payment_succeeded': async (data) => {
        // Add your business logic here
    },
    'invoice.payment_failed': async (data) => {
        const customer = (await __1.stripe.customers.retrieve(data.customer));
        const userId = customer.metadata.firebaseUID;
        const userSnapshot = await firebase_1.firestore.collection('users').doc(userId).get();
        await userSnapshot.ref.update({ status: 'PAST_DUE' });
    },
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