"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const firebase_1 = require("../firebase");
async function verifyToken(req, res, next) {
    var _a;
    if ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization.startsWith('Bearer ')) {
        try {
            console.log(req.headers.authorization);
            const token = req.headers.authorization.split('Bearer ')[1];
            const decodedToken = await firebase_1.auth.verifyIdToken(token);
            req['currentUser'] = decodedToken;
        }
        catch (error) {
            console.log(error);
        }
        next();
    }
}
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map