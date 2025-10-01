'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-driven crop advisories to farmers.
 *
 * - `getCropAdvisory`: A function that takes crop symptoms as input and returns AI-generated recommendations.
 * - `CropAdvisoryInput`: The input type for the `getCropAdvisory` function.
 * - `CropAdvisoryOutput`: The output type for the `getCropAdvisory` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropAdvisoryInputSchema = z.object({
  symptoms: z
    .string()
    .describe(
      'A description of the crop symptoms provided by the farmer.'
    ),
});

export type CropAdvisoryInput = z.infer<typeof CropAdvisoryInputSchema>;

const CropAdvisoryOutputSchema = z.object({
  recommendations: z
    .string()
    .describe(
      'AI-driven recommendations for crop health, irrigation, fertilizer, and disease treatment.'
    ),
});

export type CropAdvisoryOutput = z.infer<typeof CropAdvisoryOutputSchema>;

export async function getCropAdvisory(
  input: CropAdvisoryInput
): Promise<CropAdvisoryOutput> {
  return cropAdvisoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropAdvisoryPrompt',
  input: {schema: CropAdvisoryInputSchema},
  output: {schema: CropAdvisoryOutputSchema},
  prompt: `You are an AI assistant providing crop health advisory to farmers.
  Based on the described symptoms, provide actionable recommendations related to irrigation, 
  fertilizer, and disease treatment.

  Symptoms: {{{symptoms}}}
  `,
});

const cropAdvisoryFlow = ai.defineFlow(
  {
    name: 'cropAdvisoryFlow',
    inputSchema: CropAdvisoryInputSchema,
    outputSchema: CropAdvisoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
