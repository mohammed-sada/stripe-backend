"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAsync = void 0;
function runAsync(callback) {
    return (req, res, next) => {
        callback(req, res, next).catch(next);
    };
}
exports.runAsync = runAsync;
//# sourceMappingURL=runAsync.js.map