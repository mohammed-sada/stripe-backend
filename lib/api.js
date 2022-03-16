"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const verifyToken_1 = require("./middlewares/verifyToken");
const runAsync_1 = require("./utils/runAsync");
const validateUser_1 = require("./utils/validateUser");
const checkout_1 = require("./stripe/checkout");
const payment_1 = require("./stripe/payment");
const webHooks_1 = require("./stripe/webHooks");
const customers_1 = require("./stripe/customers");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer), // buffer body is needed for stripe webhook handling
}));
exports.app.use((0, morgan_1.default)('combined'));
exports.app.use((0, cors_1.default)({ origin: true }));
exports.app.use(verifyToken_1.verifyToken);
exports.app.post('/checkout', (0, runAsync_1.runAsync)(async (req, res) => {
    res.json(await (0, checkout_1.createCheckoutStripeSession)(req.body.line_items));
}));
exports.app.post('/payment', (0, runAsync_1.runAsync)(async (req, res) => {
    res.json(await (0, payment_1.createPaymentIntent)(req.body.amount));
}));
exports.app.post('/webhook', (0, runAsync_1.runAsync)(webHooks_1.stripeWebhookHandler));
exports.app.post('/wallet', async (req, res) => {
    const user = (0, validateUser_1.validateUser)(req);
    res.json(await (0, customers_1.createSetupIntent)(user.uid));
});
exports.app.get('/wallet', async (req, res) => {
    const user = (0, validateUser_1.validateUser)(req);
    const paymentMethods = await (0, customers_1.listPaymentmethods)(user.uid);
    res.json(paymentMethods.data); // array of payment methods
});
//# sourceMappingURL=api.js.map