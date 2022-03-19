import path from 'path';
import firebaseAdmin from 'firebase-admin';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    path.join(__dirname, '..', 'service-account.json')
  ),
});

export const firestore = firebaseAdmin.firestore();
export const auth = firebaseAdmin.auth();

export const arrayUnion = firebaseAdmin.firestore.FieldValue.arrayUnion;
export const arrayRemove = firebaseAdmin.firestore.FieldValue.arrayRemove;
