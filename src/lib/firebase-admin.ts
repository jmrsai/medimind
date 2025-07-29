import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccount) {
    throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
}

const parsedServiceAccount = JSON.parse(serviceAccount);

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(parsedServiceAccount)
    });
}


export const auth = admin.auth();
export const dbAdmin = admin.firestore();