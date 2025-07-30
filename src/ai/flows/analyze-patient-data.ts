// This is an AI-powered function for analyzing patient data and suggesting possible diagnoses.
// It takes patient data as input, integrates relevant lab values and history findings, and formulates potential diagnoses.
// The file exports the analyzePatientData function, AnalyzePatientDataInput type, and AnalyzePatientDataOutput type.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AnalyzePatientDataInputSchema = z.object({
  patientData: z.string().optional().describe('The patient data to analyze. Should contain all pertinent history and lab values.'),
  documentDataUri: z.string().optional().describe("A document with patient data, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});

export type AnalyzePatientDataInput = z.infer<typeof AnalyzePatientDataInputSchema>;

const AnalyzePatientDataOutputSchema = z.object({
  primaryDiagnosis: z.string().describe('The most likely diagnosis based on the provided data.'),
  differentialDiagnoses: z.array(z.string()).describe('A list of other possible diagnoses to consider, ranked by likelihood.'),
  confidenceLevel: z.number().describe('The confidence level for the primary diagnosis (0-1).'),
  diagnosticReasoning: z.string().describe('A step-by-step explanation of how the AI reached the primary diagnosis, citing specific evidence from the input data.'),
  recommendedTests: z.array(z.string()).describe('A list of suggested diagnostic tests or procedures to confirm the diagnosis.'),
  treatmentPlan: z.object({
    medications: z.array(z.string()).describe('A list of suggested medications, including dosage and frequency if appropriate.'),
    therapies: z.array(z.string()).describe('A list of recommended non-pharmacological therapies or interventions.'),
    lifestyleModifications: z.array(z.string()).describe('Suggested changes to lifestyle, diet, or activity.'),
  }).describe('A comprehensive, multi-faceted treatment plan.'),
  prognosis: z.string().describe('The likely course and outcome of the disease.'),
});

export type AnalyzePatientDataOutput = z.infer<typeof AnalyzePatientDataOutputSchema>;

export async function analyzePatientData(input: AnalyzePatientDataInput): Promise<AnalyzePatientDataOutput> {
  return analyzePatientDataFlow(input);
}

const analyzePatientDataPrompt = ai.definePrompt({
  name: 'analyzePatientDataPrompt',
  input: {schema: AnalyzePatientDataInputSchema},
  output: {schema: AnalyzePatientDataOutputSchema},
  prompt: `You are an expert AI medical diagnosis assistant. Your role is to provide a comprehensive and structured analysis of patient data for a healthcare professional.

Analyze the following patient information meticulously.
{{#if patientData}}
Patient Data Text: {{{patientData}}}
{{/if}}

{{#if documentDataUri}}
Also, analyze the content of this document, which may contain lab results, imaging reports, or other relevant medical information.
Document: {{media url=documentDataUri}}
{{/if}}

Based on a holistic review of all provided information, generate a detailed diagnostic report. Your response must be structured according to the output schema.
- Provide a clear Primary Diagnosis.
- List several Differential Diagnoses, ordered from most to least likely.
- State your confidence level (0-1) for the primary diagnosis.
- Give detailed Diagnostic Reasoning, citing specific findings from the patient data and document.
- Suggest Recommended Tests to confirm your findings.
- Outline a multi-part Treatment Plan including medications, therapies, and lifestyle modifications.
- Provide a Prognosis for the patient.`,
});

const analyzePatientDataFlow = ai.defineFlow(
  {
    name: 'analyzePatientDataFlow',
    inputSchema: AnalyzePatientDataInputSchema,
    outputSchema: AnalyzePatientDataOutputSchema,
  },
  async (input) => {
    const hasPatientDataText = input.patientData && input.patientData.trim() !== '';
    const hasDocument = !!input.documentDataUri;

    if (!hasPatientDataText && !hasDocument) {
      throw new Error('Please provide either patient data text or a document for analysis.');
    }
    
    const { output } = await analyzePatientDataPrompt(input);
    return output!;
  }
);
