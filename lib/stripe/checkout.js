"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutStripeSession = void 0;
const __1 = require("..");
async function createCheckoutStripeSession(line_items) {
    const url = process.env.WEBAPP_URL;
    const session = await __1.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/failed`,
    });
    return session;
}
exports.createCheckoutStripeSession = createCheckoutStripeSession;
//# sourceMappingURL=checkout.js.map