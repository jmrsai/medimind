// This is an AI-powered function for analyzing patient data and suggesting possible diagnoses.
// It takes patient data as input, integrates relevant lab values and history findings, and formulates potential diagnoses.
// The file exports the analyzePatientData function, AnalyzePatientDataInput type, and AnalyzePatientDataOutput type.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AnalyzePatientDataInputSchema = z.object({
  patientData: z.string().describe('The patient data to analyze.  Should contain all pertinent history and lab values.'),
  documentDataUri: z.string().optional().describe("A document with patient data, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});

export type AnalyzePatientDataInput = z.infer<typeof AnalyzePatientDataInputSchema>;

const AnalyzePatientDataOutputSchema = z.object({
  diagnosis: z.string().describe('The AI-generated diagnosis based on the patient data.'),
  confidenceLevel: z.number().describe('The confidence level of the diagnosis (0-1).'),
  supportingEvidence: z.string().describe('The supporting evidence for the diagnosis.'),
  suggestedTreatments: z.string().describe('Suggested treatments based on the AI diagnosis.'),
});

export type AnalyzePatientDataOutput = z.infer<typeof AnalyzePatientDataOutputSchema>;

export async function analyzePatientData(input: AnalyzePatientDataInput): Promise<AnalyzePatientDataOutput> {
  return analyzePatientDataFlow(input);
}

const analyzePatientDataPrompt = ai.definePrompt({
  name: 'analyzePatientDataPrompt',
  input: {schema: AnalyzePatientDataInputSchema},
  output: {schema: AnalyzePatientDataOutputSchema},
  prompt: `You are an AI medical diagnosis assistant. Analyze the patient data provided and formulate a possible diagnosis.

Patient Data: {{{patientData}}}

{{#if documentDataUri}}
Analyze the following document in conjunction with the patient data provided above. The document may contain lab results, imaging reports, or other relevant medical information.
Document:
{{media url=documentDataUri}}
{{/if}}

Based on all available information, provide a diagnosis, a confidence level (0-1), supporting evidence from both the text and the document (if provided), and suggested treatments.`,
});

const analyzePatientDataFlow = ai.defineFlow(
  {
    name: 'analyzePatientDataFlow',
    inputSchema: AnalyzePatientDataInputSchema,
    outputSchema: AnalyzePatientDataOutputSchema,
  },
  async input => {
    const {output} = await analyzePatientDataPrompt(input);
    return output!;
  }
);
