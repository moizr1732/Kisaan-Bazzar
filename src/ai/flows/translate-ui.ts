'use server';

/**
 * @fileOverview A UI translation flow that translates text elements.
 *
 * - translateUI - A function that takes text and a target language and returns the translation.
 */

import { ai } from '@/ai/genkit';
import { TranslateUIInputSchema, TranslateUIOutputSchema, type TranslateUIInput, type TranslateUIOutput } from '@/lib/types';


export async function translateUI(input: TranslateUIInput): Promise<TranslateUIOutput> {
  if (input.targetLanguage === 'en') {
    return { translations: input.texts };
  }
  return translateUIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateUIPrompt',
  input: { schema: TranslateUIInputSchema },
  output: { schema: TranslateUIOutputSchema },
  prompt: `You are a UI translation expert for an agricultural app in Pakistan.
Translate the following English UI text elements into the specified target language.
Keep the translations concise and suitable for a user interface.
The order of the translated texts in the output array must exactly match the order of the input texts.

Target Language: {{{targetLanguage}}}
Texts to translate:
{{#each texts}}
- {{{this}}}
{{/each}}

Return ONLY the JSON object with the 'translations' array.
`,
});

const translateUIFlow = ai.defineFlow(
  {
    name: 'translateUIFlow',
    inputSchema: TranslateUIInputSchema,
    outputSchema: TranslateUIOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
