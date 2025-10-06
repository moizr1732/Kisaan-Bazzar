
'use server';

/**
 * @fileOverview A multilingual voice and text interaction AI agent.
 *
 * - multilingualVoiceInteraction - A function that handles interaction in multiple languages.
 * - MultilingualVoiceInteractionInput - The input type for the multilingualVoiceInteraction function.
 * - MultilingualVoiceInteractionOutput - The return type for the multilingualVoiceInteraction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultilingualVoiceInteractionInputSchema = z.object({
  voiceCommand: z
    .string()
    .optional()
    .describe(
        'A voice recording of the user query, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  textCommand: z.string().optional().describe('A text-based user query.'),
  userProfile: z.string().optional().describe('Optional user profile information to personalize the response.'),
  location: z.string().optional().describe('Optional user location to provide location-specific information.'),
  pastInteractions: z.string().optional().describe('Optional history of past interactions to maintain context.'),
});
export type MultilingualVoiceInteractionInput = z.infer<typeof MultilingualVoiceInteractionInputSchema>;

const MultilingualVoiceInteractionOutputSchema = z.object({
  response: z.string().describe('The personalized response from the voice agent in the detected language.'),
  detectedLanguage: z.string().describe('The language detected from the user command.'),
});
export type MultilingualVoiceInteractionOutput = z.infer<typeof MultilingualVoiceInteractionOutputSchema>;

export async function multilingualVoiceInteraction(input: MultilingualVoiceInteractionInput): Promise<MultilingualVoiceInteractionOutput> {
  return multilingualVoiceInteractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'multilingualVoiceInteractionPrompt',
  input: {schema: MultilingualVoiceInteractionInputSchema},
  output: {schema: MultilingualVoiceInteractionOutputSchema},
  prompt: `Your name is Moiz. Your voice is like a Pakistani man. You are an expert in all things related to agriculture in Pakistan. You can speak languages that are commonly spoken in Pakistan (Urdu, English, Pashto, Punjabi, Sindhi). The user will ask you about queries of agriculture and you have to reply and answer in a correct and efficient way.

You will automatically detect the language of the user's command and respond accordingly.
Your responses should be personalized based on the user's profile, location, and past interactions, if available.
Maintain context during conversations for more natural and relevant interactions.

{{#if textCommand}}
User command: {{{textCommand}}}
{{else}}
Voice Command: {{media url=voiceCommand}}
{{/if}}

{{#if userProfile}}
User Profile: {{{userProfile}}}
{{/if}}

{{#if location}}
Location: {{{location}}}
{{/if}}

{{#if pastInteractions}}
Past Interactions: {{{pastInteractions}}}
{{/if}}

Respond in the detected language with a personalized and context-aware response. Also, include what language you detected in the "detectedLanguage" field.
`,
});

const multilingualVoiceInteractionFlow = ai.defineFlow(
  {
    name: 'multilingualVoiceInteractionFlow',
    inputSchema: MultilingualVoiceInteractionInputSchema,
    outputSchema: MultilingualVoiceInteractionOutputSchema,
  },
  async input => {
    if (!input.voiceCommand && !input.textCommand) {
      throw new Error('Either voiceCommand or textCommand must be provided.');
    }
    const {output} = await prompt(input);
    return output!;
  }
);
