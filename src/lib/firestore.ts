import { AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';
import { Timestamp } from 'firebase/firestore';
import { dbAdmin } from './firebase-admin';

export interface AnalysisHistoryRecord {
    id: string;
    // uid is no longer available without authentication
    createdAt: Timestamp;
    analysis: AnalyzePatientDataOutput;
}

// History saving is disabled as the Firebase Admin SDK has been removed 
// to prevent runtime errors.
export async function saveAnalysisHistory(analysis: AnalyzePatientDataOutput): Promise<void> {
    if (!dbAdmin) {
        console.warn("Admin SDK not available. Skipping history save.");
        return;
    }
    try {
        await dbAdmin.collection('analysisHistory').add({
            analysis: analysis,
            createdAt: Timestamp.now(),
        });
    } catch (error) {
        console.error("Error writing document with Admin SDK: ", error);
    }
}
