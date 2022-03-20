"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateCustomer = void 0;
const firebase_1 = require("../firebase");
const __1 = require("..");
async function getOrCreateCustomer(userId, params) {
    const userSnapshot = await firebase_1.firestore.collection('users').doc(userId).get();
    const { stripeCustomerId, email, displayName } = userSnapshot.data();
    console.log(email);
    if (!stripeCustomerId) {
        const customer = await __1.stripe.customers.create(Object.assign({ email, name: displayName, metadata: {
                firebaseUID: userId,
            } }, params));
        await userSnapshot.ref.update({ stripeCustomerId: customer.id });
        return customer;
    }
    else {
        const customer = await __1.stripe.customers.retrieve(stripeCustomerId);
        return customer;
    }
}
exports.getOrCreateCustomer = getOrCreateCustomer;
//# sourceMappingURL=getOrCreateCustomer.js.map