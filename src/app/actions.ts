
'use server';

import { analyzePatientData as analyzePatientDataFlow, AnalyzePatientDataInput, AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';
import { auth } from '@/lib/firebase-admin';
import { saveAnalysisHistory } from '@/lib/firestore';


export async function analyzePatientData(input: AnalyzePatientDataInput, idToken: string): Promise<AnalyzePatientDataOutput> {

  const result = await analyzePatientDataFlow(input);

  try {
    if (!auth) {
        // This condition will be true if Firebase Admin SDK is not initialized.
        console.warn('Firebase Admin is not configured. Skipping history save.');
    } else {
        const decodedToken = await auth.verifyIdToken(idToken);
        const uid = decodedToken.uid;

        if (!uid) {
            console.warn('User is not properly logged in. Skipping history save.');
        } else {
            // Save history in the background, but don't let it block the response
            // in case of failure.
            saveAnalysisHistory(uid, result).catch(err => {
              console.error("Failed to save analysis history:", err);
            });
        }
    }
  } catch (error) {
      console.error('An error occurred while trying to save analysis history:', error);
      // We are not re-throwing the error to ensure the analysis result is still returned to the user.
  }

  return result;
}
