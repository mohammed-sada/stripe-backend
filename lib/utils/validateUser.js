"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = void 0;
function validateUser(req) {
    const user = req.currentUser;
    if (!user) {
        throw new Error('You must be authenticated');
    }
    return user;
}
exports.validateUser = validateUser;
//# sourceMappingURL=validateUser.js.map