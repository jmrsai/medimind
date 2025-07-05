'use server';

import { analyzePatientData as analyzePatientDataFlow, AnalyzePatientDataInput, AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';

export async function analyzePatientData(input: AnalyzePatientDataInput): Promise<AnalyzePatientDataOutput> {
  // In a real app, you would add authentication and authorization checks here.
  // For example, ensuring the user is a logged-in healthcare professional.

  try {
    const result = await analyzePatientDataFlow(input);
    return result;
  } catch (error) {
    console.error('Error analyzing patient data:', error);
    // You can throw a more specific error or return a structured error object.
    throw new Error('Failed to analyze patient data. Please try again later.');
  }
}
