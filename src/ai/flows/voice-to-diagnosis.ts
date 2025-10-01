'use server';

/**
 * @fileOverview A voice-to-diagnosis AI agent.
 *
 * - voiceToDiagnosis - A function that handles the voice to diagnosis process.
 * - VoiceToDiagnosisInput - The input type for the voiceToDiagnosis function.
 * - VoiceToDiagnosisOutput - The return type for the voiceToDiagnosis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceToDiagnosisInputSchema = z.object({
  voiceDataUri: z
    .string()
    .describe(
      'A voice recording of crop symptoms, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type VoiceToDiagnosisInput = z.infer<typeof VoiceToDiagnosisInputSchema>;

const VoiceToDiagnosisOutputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the plant symptoms.'),
});
export type VoiceToDiagnosisOutput = z.infer<typeof VoiceToDiagnosisOutputSchema>;

export async function voiceToDiagnosis(input: VoiceToDiagnosisInput): Promise<VoiceToDiagnosisOutput> {
  return voiceToDiagnosisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceToDiagnosisPrompt',
  input: {schema: VoiceToDiagnosisInputSchema},
  output: {schema: VoiceToDiagnosisOutputSchema},
  prompt: `You are an expert agriculture advisor specializing in diagnosing crop illnesses based on symptoms.

You will use the transcription of the farmer\'s voice recording to diagnose the plant and any issues it has.

Voice Recording: {{voiceDataUri}}`,
});

const voiceToDiagnosisFlow = ai.defineFlow(
  {
    name: 'voiceToDiagnosisFlow',
    inputSchema: VoiceToDiagnosisInputSchema,
    outputSchema: VoiceToDiagnosisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
