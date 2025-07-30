import { AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';
import { Timestamp } from 'firebase/firestore';
import { dbAdmin } from './firebase-admin';

export interface AnalysisHistoryRecord {
    id: string;
    // uid is no longer available without authentication
    createdAt: Timestamp;
    analysis: AnalyzePatientDataOutput;
}

// History saving is disabled as authentication has been removed.
// The functions are kept for potential future use but are not currently called.

export async function saveAnalysisHistory(analysis: AnalyzePatientDataOutput): Promise<void> {
    if (!dbAdmin) {
        console.warn("Admin SDK not initialized. Skipping history save.");
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
