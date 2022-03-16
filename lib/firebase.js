"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.firestore = void 0;
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../service-account.json');
const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});
exports.firestore = firebaseAdmin.firestore();
exports.auth = firebaseAdmin.auth();
//# sourceMappingURL=firebase.js.map