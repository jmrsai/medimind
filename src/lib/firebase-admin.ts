
import * as admin from 'firebase-admin';

function initializeAdminApp() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccount) {
        console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set. History feature will be disabled.');
        return null;
    }

    try {
        const parsedServiceAccount = JSON.parse(serviceAccount);
        return admin.initializeApp({
            credential: admin.credential.cert(parsedServiceAccount)
        });
    } catch (error) {
        console.error("Failed to parse or initialize Firebase Admin SDK:", error);
        return null;
    }
}

const adminApp = initializeAdminApp();

export const auth = adminApp ? adminApp.auth() : null;
export const dbAdmin = adminApp ? adminApp.firestore() : null;
