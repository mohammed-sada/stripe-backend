"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntent = void 0;
const __1 = require("..");
async function createPaymentIntent(amount) {
    const paymentIntent = await __1.stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        // receipt_email:'examle@gmail.com'
    });
    return paymentIntent;
}
exports.createPaymentIntent = createPaymentIntent;
//# sourceMappingURL=payment.js.map