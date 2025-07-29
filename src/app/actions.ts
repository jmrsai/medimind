'use server';

import { analyzePatientData as analyzePatientDataFlow, AnalyzePatientDataInput, AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';
import { auth } from '@/lib/firebase-admin';
import { saveAnalysisHistory } from '@/lib/firestore';


export async function analyzePatientData(input: AnalyzePatientDataInput, idToken: string): Promise<AnalyzePatientDataOutput> {
  const decodedToken = await auth.verifyIdToken(idToken);
  const uid = decodedToken.uid;

  if (!uid) {
    throw new Error('You must be logged in to perform an analysis.');
  }

  try {
    const result = await analyzePatientDataFlow(input);
    
    // Save history in the background, but don't let it block the response
    // in case of failure.
    saveAnalysisHistory(uid, result).catch(err => {
      console.error("Failed to save analysis history:", err);
    });

    return result;
  } catch (error) {
    console.error('Error analyzing patient data in server action:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred during analysis.');
  }
}
