"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSubscriptions = exports.cancelSubscription = exports.createSubscription = void 0;
const __1 = require("..");
const getOrCreateCustomer_1 = require("./getOrCreateCustomer");
const firebase_1 = require("../firebase");
/*
1- Attaches a payment-method to a stripe customer
2- Subscribes the customer to a stripe plan
3- Sync the changres with Firestore
*/
async function createSubscription(userId, payment_method, plan) {
    const customer = await (0, getOrCreateCustomer_1.getOrCreateCustomer)(userId);
    // attach the payment method to stripe customer, but you can seperate this action into a seperate endpoint
    await __1.stripe.paymentMethods.attach(payment_method, { customer: customer.id });
    // update the customer default payment method to be current payment method, you can also seperate this action into a seperate endpoint
    await __1.stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: payment_method },
    });
    const subscription = await __1.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan }],
        expand: ['latest_invoice.payment_intent'],
    });
    const latest_invoice = subscription.latest_invoice;
    const payment_intent = latest_invoice.payment_intent;
    if (payment_intent.status === 'succeeded') {
        const userRef = firebase_1.firestore.collection('users').doc(userId);
        console.log(subscription.items.data[0].plan.id);
        await userRef.set({
            stripeCustomerId: customer.id,
            activePlans: (0, firebase_1.arrayUnion)(plan),
        }, { merge: true });
    }
    return subscription;
}
exports.createSubscription = createSubscription;
/*
1- Cancel Subscription
2- Sync the changres with Firestore
*/
async function cancelSubscription(userId, subscriptionId) {
    const customer = await (0, getOrCreateCustomer_1.getOrCreateCustomer)(userId);
    if (customer.metadata.firebaseUID !== userId) {
        throw new Error('You do not have the permission to cancel this subscription');
    }
    const subscription = await __1.stripe.subscriptions.del(subscriptionId); // cancel the subscription immediately
    // const subscription = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true }); // this approach have to be handled via a webhook
    if (subscription.status === 'canceled') {
        const userRef = firebase_1.firestore.collection('users').doc(userId);
        await userRef.update({
            activePlans: (0, firebase_1.arrayRemove)(subscription.items.data[0].plan.id),
        });
    }
    return subscription;
}
exports.cancelSubscription = cancelSubscription;
async function listSubscriptions(userId) {
    const customer = await (0, getOrCreateCustomer_1.getOrCreateCustomer)(userId);
    const subscriptions = await __1.stripe.subscriptions.list({
        customer: customer.id,
    });
    return subscriptions;
}
exports.listSubscriptions = listSubscriptions;
//# sourceMappingURL=blilling.js.map