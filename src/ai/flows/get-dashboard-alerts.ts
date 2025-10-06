'use server';

/**
 * @fileOverview Generates real-time, personalized dashboard alerts for farmers.
 *
 * - getDashboardAlerts - A function that returns relevant alerts based on user profile.
 * - GetDashboardAlertsInput - The input type for the getDashboardAlerts function.
 * - GetDashboardAlertsOutput - The return type for the getDashboardAlerts function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AlertSchema = z.object({
  type: z.enum(['Weather Alert', 'Disease Alert', 'Market Update']),
  message: z.string().describe('The detailed alert message for the user.'),
  color: z
    .enum(['bg-yellow-100 text-yellow-800', 'bg-red-100 text-red-800', 'bg-green-100 text-green-800'])
    .describe(
      'The Tailwind CSS classes for styling the alert. Yellow for weather, red for disease, green for market.'
    ),
});

const GetDashboardAlertsInputSchema = z.object({
  location: z.string().optional().describe('The user\'s location (e.g., "Lahore, Punjab").'),
  crops: z.array(z.string()).optional().describe('A list of crops the user grows.'),
});
export type GetDashboardAlertsInput = z.infer<typeof GetDashboardAlertsInputSchema>;

const GetDashboardAlertsOutputSchema = z.object({
  alerts: z.array(AlertSchema).describe('An array of 3 personalized alerts for the user.'),
});
export type GetDashboardAlertsOutput = z.infer<typeof GetDashboardAlertsOutputSchema>;

export async function getDashboardAlerts(
  input: GetDashboardAlertsInput
): Promise<GetDashboardAlertsOutput> {
  return getDashboardAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDashboardAlertsPrompt',
  input: { schema: GetDashboardAlertsInputSchema },
  output: { schema: GetDashboardAlertsOutputSchema },
  prompt: `You are an agricultural expert providing timely alerts to farmers in Pakistan.
Generate exactly 3 personalized alerts based on the user's information.

User's Location: {{{location}}}
User's Crops: {{#if crops}}{{#each crops}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}Not specified{{/if}}

Create one of each of the following alert types:
1.  **Weather Alert:** Provide a real, actionable weather forecast for the user's location.
2.  **Disease Alert:** Warn about a potential, realistic crop disease for one of the user's specified crops and location. If no crops are specified, provide a general disease alert for a common crop in the given location.
3.  **Market Update:** Give a recent, realistic price update (increase or decrease) for a relevant crop in a nearby market.

For each alert, provide the appropriate color style:
- 'bg-yellow-100 text-yellow-800' for Weather Alert
- 'bg-red-100 text-red-800' for Disease Alert
- 'bg-green-100 text-green-800' for Market Update

Your response must be in the specified JSON format. The alerts should be concise and easy to understand for a farmer.
`,
});

const getDashboardAlertsFlow = ai.defineFlow(
  {
    name: 'getDashboardAlertsFlow',
    inputSchema: GetDashboardAlertsInputSchema,
    outputSchema: GetDashboardAlertsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
