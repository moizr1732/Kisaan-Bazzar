'use server';

/**
 * @fileOverview An AI agent for guiding users through profile creation using voice interaction.
 *
 * - profileAssistance - A function that guides the user through profile creation.
 * - ProfileAssistanceInput - The input type for the profileAssistance function.
 * - ProfileAssistanceOutput - The return type for the profileAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProfileAssistanceInputSchema = z.object({
  userInput: z
    .string()
    .describe("The user's voice input or response to the agent's questions."),
  context: z
    .string()
    .optional()
    .describe('The ongoing context of the conversation.'),
});
export type ProfileAssistanceInput = z.infer<typeof ProfileAssistanceInputSchema>;

const ProfileAssistanceOutputSchema = z.object({
  agentResponse: z.string().describe('The agent response or question for the user.'),
  newContext: z
    .string()
    .optional()
    .describe('The updated context of the conversation.'),
  completed: z.boolean().describe('Whether the profile creation is complete.'),
});
export type ProfileAssistanceOutput = z.infer<typeof ProfileAssistanceOutputSchema>;

export async function profileAssistance(input: ProfileAssistanceInput): Promise<ProfileAssistanceOutput> {
  return profileAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'profileAssistancePrompt',
  input: {schema: ProfileAssistanceInputSchema},
  output: {schema: ProfileAssistanceOutputSchema},
  prompt: `You are a voice agent guiding a new user through profile creation.

  Your goal is to collect the necessary information to create a user profile by asking one question at a time. Maintain context throughout the conversation.

  Consider the user's previous input: {{{userInput}}}
  Current context: {{{context}}}

  If the user input answers the question, then store it and move onto the next question.
  If you already have all the information needed, respond that the profile creation is complete and set 'completed' to true, otherwise set to false.

  Here are the fields needed for the user profile:
  - Full Name
  - Email Address
  - Preferred Language (Urdu, English, Pashto, Punjabi, or Sindhi)

  Respond with a question to the user and include the updated context for the next turn.  If the user asks something unrelated to profile creation, politely steer the conversation back on track.

  Make sure the response is designed to be spoken by a voice assistant. The response should be concise and friendly.  Do not say words like "full name", instead say "What is your name?"
  Set newContext with the latest context.

  Output in JSON format.
  `,
});

const profileAssistanceFlow = ai.defineFlow(
  {
    name: 'profileAssistanceFlow',
    inputSchema: ProfileAssistanceInputSchema,
    outputSchema: ProfileAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
