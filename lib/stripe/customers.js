"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPaymentmethods = exports.createSetupIntent = void 0;
const __1 = require("..");
const getOrCreateCustomer_1 = require("./getOrCreateCustomer");
async function createSetupIntent(userId) {
    const customer = await (0, getOrCreateCustomer_1.getOrCreateCustomer)(userId);
    return __1.stripe.setupIntents.create({
        customer: customer.id,
    });
}
exports.createSetupIntent = createSetupIntent;
async function listPaymentmethods(uesrId) {
    const customer = await (0, getOrCreateCustomer_1.getOrCreateCustomer)(uesrId);
    return __1.stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
    });
}
exports.listPaymentmethods = listPaymentmethods;
//# sourceMappingURL=customers.js.map