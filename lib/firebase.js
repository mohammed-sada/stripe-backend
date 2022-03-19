"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayRemove = exports.arrayUnion = exports.auth = exports.firestore = void 0;
const path_1 = __importDefault(require("path"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(path_1.default.join(__dirname, '..', 'service-account.json')),
});
exports.firestore = firebase_admin_1.default.firestore();
exports.auth = firebase_admin_1.default.auth();
exports.arrayUnion = firebase_admin_1.default.firestore.FieldValue.arrayUnion;
exports.arrayRemove = firebase_admin_1.default.firestore.FieldValue.arrayRemove;
//# sourceMappingURL=firebase.js.map