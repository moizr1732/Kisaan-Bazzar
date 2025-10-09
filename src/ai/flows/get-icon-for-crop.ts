
'use server';

/**
 * @fileOverview Generates an emoji icon for a given crop.
 *
 * - getIconForCrop - A function that returns an emoji for a crop.
 * - GetIconForCropInput - The input type for the getIconForCrop function.
 * - GetIconForCropOutput - The return type for the getIconForCrop function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetIconForCropInputSchema = z.object({
  cropName: z.string().describe('The name of the crop (e.g., "Potato", "Wheat").'),
});
export type GetIconForCropInput = z.infer<typeof GetIconForCropInputSchema>;

const GetIconForCropOutputSchema = z.object({
  icon: z.string().describe('A single, relevant emoji for the crop.'),
});
export type GetIconForCropOutput = z.infer<typeof GetIconForCropOutputSchema>;

export async function getIconForCrop(
  input: GetIconForCropInput
): Promise<GetIconForCropOutput> {
  return getIconForCropFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getIconForCropPrompt',
  input: { schema: GetIconForCropInputSchema },
  output: { schema: GetIconForCropOutputSchema },
  prompt: `You are an expert in agriculture and emojis. Your task is to provide a single, representative emoji icon for a given crop.

Crop Name: {{{cropName}}}

Return only one emoji that best represents this crop. For example, for "Tomato", return "🍅". For "Wheat", return "🌾".

Your response must be in the specified JSON format.
`,
});

const getIconForCropFlow = ai.defineFlow(
  {
    name: 'getIconForCropFlow',
    inputSchema: GetIconForCropInputSchema,
    outputSchema: GetIconForCropOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
