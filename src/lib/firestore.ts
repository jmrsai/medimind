import { db } from '@/lib/firebase';
import { AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { dbAdmin } from './firebase-admin';

export interface AnalysisHistoryRecord {
    id: string;
    uid: string;
    createdAt: Timestamp;
    analysis: AnalyzePatientDataOutput;
}

// Save analysis to history
export async function saveAnalysisHistory(uid: string, analysis: AnalyzePatientDataOutput): Promise<void> {
    if (!dbAdmin) {
        // This is a safeguard. The primary check should be in the calling function.
        console.warn("Admin SDK not initialized. Skipping history save.");
        return;
    }
    try {
        await dbAdmin.collection('analysisHistory').add({
            uid: uid,
            analysis: analysis,
            createdAt: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error writing document with Admin SDK: ", error);
        // Not re-throwing error to not block the user flow
    }
}

// Get analysis history for a user
export async function getAnalysisHistory(uid: string): Promise<AnalysisHistoryRecord[]> {
    const q = query(
        collection(db, 'analysisHistory'), 
        where("uid", "==", uid),
        orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const history: AnalysisHistoryRecord[] = [];
    querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() } as AnalysisHistoryRecord);
    });

    return history;
}
