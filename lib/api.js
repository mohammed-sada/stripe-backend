"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const checkout_1 = require("./stripe/checkout");
const payment_1 = require("./stripe/payment");
const webHooks_1 = require("./stripe/webHooks");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer), // buffer body is needed for stripe webhook handling
}));
exports.app.use((0, cors_1.default)({ origin: true }));
exports.app.post('/checkout', runAsync(async ({ body }, res) => {
    res.json(await (0, checkout_1.createCheckoutStripeSession)(body.line_items));
}));
exports.app.post('/payment', runAsync(async ({ body }, res) => {
    res.json(await (0, payment_1.createPaymentIntent)(body.amount));
}));
exports.app.post('/webhook', runAsync(webHooks_1.stripeWebhookHandler));
function runAsync(callback) {
    return (req, res, next) => {
        callback(req, res, next).catch(next);
    };
}
//# sourceMappingURL=api.js.map