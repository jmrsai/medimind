import { db } from '@/lib/firebase';
import { AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

export interface AnalysisHistoryRecord {
    id: string;
    uid: string;
    createdAt: Timestamp;
    analysis: AnalyzePatientDataOutput;
}

// Save analysis to history
export async function saveAnalysisHistory(uid: string, analysis: AnalyzePatientDataOutput): Promise<void> {
    try {
        await addDoc(collection(db, 'analysisHistory'), {
            uid: uid,
            analysis: analysis,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error writing document: ", error);
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