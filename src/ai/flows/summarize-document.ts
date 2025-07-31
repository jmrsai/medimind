
'use server';
/**
 * @fileOverview A document summarization AI agent.
 *
 * - summarizeDocument - A function that handles the document summarization process.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';


const SummarizeDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document (image or PDF) to be summarized, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;


const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the document.'),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;


const summarizeDocumentPrompt = ai.definePrompt({
    name: 'summarizeDocumentPrompt',
    model: 'googleai/gemini-1.5-pro-latest',
    input: { schema: SummarizeDocumentInputSchema },
    output: { schema: SummarizeDocumentOutputSchema },
    prompt: `You are an expert medical document analyst. Your task is to provide a clear and concise summary of the provided medical document.

    The summary should capture the key findings, conclusions, and any critical information presented in the document. It should be easily understandable by a healthcare professional who needs a quick overview.

    Document to Summarize:
    {{media url=documentDataUri}}
    
    Please generate the summary and provide it in the specified JSON format.`,
});


const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeDocumentPrompt(input);
    if (!output) {
        throw new Error("Failed to get summary from the model.");
    }
    return output;
  }
);

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
    return summarizeDocumentFlow(input);
}
