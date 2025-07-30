
'use server';

import { analyzePatientData as analyzePatientDataFlow, AnalyzePatientDataInput, AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';

export async function analyzePatientData(input: AnalyzePatientDataInput): Promise<AnalyzePatientDataOutput> {
  const result = await analyzePatientDataFlow(input);
  
  // History saving is disabled as authentication has been removed.

  return result;
}
