
'use server';
/**
 * @fileOverview A patient data analysis AI agent.
 *
 * - analyzePatientData - A function that handles the patient diagnosis process.
 * - AnalyzePatientDataInput - The input type for the analyzePatientData function.
 * - AnalyzePatientDataOutput - The return type for the analyzePatientData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {saveAnalysisHistory} from '@/lib/firestore';

const PatientAnalysisInputSchema = z.object({
  patientData: z.string().optional().describe('The unstructured patient report data.'),
  documentDataUri: z
    .string()
    .optional()
    .describe(
      "A document (image or PDF) of the patient's report, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type AnalyzePatientDataInput = z.infer<
  typeof PatientAnalysisInputSchema
>;

const TreatmentPlanSchema = z.object({
    medications: z.array(z.string()).describe("A list of recommended medications."),
    therapies: z.array(z.string()).describe("A list of recommended therapies or procedures."),
    lifestyleModifications: z.array(z.string()).describe("A list of recommended lifestyle changes."),
});

const PatientAnalysisOutputSchema = z.object({
  primaryDiagnosis: z.string().describe('The most likely diagnosis for the patient.'),
  differentialDiagnoses: z
    .array(z.string())
    .describe('A list of other possible diagnoses, ordered from most to least likely.'),
  confidenceLevel: z
    .number()
    .min(0)
    .max(1)
    .describe('A confidence score (from 0 to 1) for the primary diagnosis.'),
  diagnosticReasoning: z
    .string()
    .describe(
      'A step-by-step explanation of how the AI arrived at the diagnosis, citing specific data points from the patient report.'
    ),
  recommendedTests: z
    .array(z.string())
    .describe(
      'A list of recommended tests to confirm the diagnosis or rule out other possibilities.'
    ),
  prognosis: z.string().describe("The likely course and outcome of the patient's condition."),
  treatmentPlan: TreatmentPlanSchema.describe("A comprehensive plan for treating the patient's condition."),
});

export type AnalyzePatientDataOutput = z.infer<
  typeof PatientAnalysisOutputSchema
>;


const analyzePatientDataPrompt = ai.definePrompt({
    name: 'analyzePatientDataPrompt',
    input: { schema: PatientAnalysisInputSchema },
    output: { schema: PatientAnalysisOutputSchema },
    prompt: `You are a world-class medical diagnostician AI. Your role is to analyze patient data with extreme accuracy and provide a comprehensive, structured report for healthcare professionals.

    Analyze the following patient information. It may include unstructured text and/or a document (image or PDF).

    Patient Report Text:
    ---
    {{{patientData}}}
    ---

    {{#if documentDataUri}}
    Patient Document:
    {{media url=documentDataUri}}
    {{/if}}

    Based on all the provided information, perform the following tasks:
    1.  **Primary Diagnosis**: Identify the most probable diagnosis.
    2.  **Differential Diagnoses**: List other potential diagnoses in order of likelihood.
    3.  **Confidence Score**: Provide a confidence level (0.0 to 1.0) for your primary diagnosis.
    4.  **Diagnostic Reasoning**: Clearly explain your reasoning. Refer to specific symptoms, findings, or data points from the input.
    5.  **Recommended Tests**: Suggest necessary diagnostic tests to confirm your findings.
    6.  **Prognosis**: Describe the likely outcome for the patient with and without treatment.
    7.  **Treatment Plan**: Formulate a comprehensive treatment plan including:
        -   Specific medications (with dosages if appropriate).
        -   Therapies or procedures.
        -   Lifestyle modifications.

    Your response must be in the structured JSON format defined by the output schema. Ensure all fields are populated with accurate, clinically relevant information.`,
});


const analyzePatientDataFlow = ai.defineFlow(
  {
    name: 'analyzePatientDataFlow',
    inputSchema: PatientAnalysisInputSchema,
    outputSchema: PatientAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await analyzePatientDataPrompt(input);
    if (!output) {
        throw new Error("Failed to get analysis from the model.");
    }
    
    // Asynchronously save to Firestore without waiting for it to complete
    saveAnalysisHistory(output).catch(err => {
        console.error("Failed to save analysis history:", err);
    });

    return output;
  }
);

export async function analyzePatientData(input: AnalyzePatientDataInput): Promise<AnalyzePatientDataOutput> {
    return analyzePatientDataFlow(input);
}
