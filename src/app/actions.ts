
'use server';

import { analyzePatientData as analyzePatientDataFlow, AnalyzePatientDataInput, AnalyzePatientDataOutput } from '@/ai/flows/analyze-patient-data';
import { summarizeDocument as summarizeDocumentFlow, SummarizeDocumentInput, SummarizeDocumentOutput } from '@/ai/flows/summarize-document';

export async function analyzePatientData(input: AnalyzePatientDataInput): Promise<AnalyzePatientDataOutput> {
  const result = await analyzePatientDataFlow(input);
  return result;
}

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  const result = await summarizeDocumentFlow(input);
  return result;
}
