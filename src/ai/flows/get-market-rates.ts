'use server';

/**
 * @fileOverview Generates realistic market rate data for crops in Pakistan.
 *
 * - getMarketRates - A function that returns market data for a set of crops.
 * - GetMarketRatesOutput - The return type for the getMarketRates function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CropDataSchema = z.object({
  name: z.string().describe('The English name of the crop.'),
  urduName: z.string().describe('The Urdu name of the crop.'),
  demand: z.enum(['High', 'Medium', 'Low']).describe('The current market demand level.'),
  price40kg: z.string().describe('The price for 40kg of the crop, formatted with commas (e.g., "3,200").'),
  price1kg: z.string().describe('The price for 1kg of the crop.'),
  change: z.string().describe('The percentage change in price, with a "+" or "-" prefix (e.g., "+5.2%").'),
  mandi: z.string().describe('The name of the market (mandi) where this price is relevant.'),
  updated: z.string().describe('A human-readable string indicating when the price was last updated (e.g., "1 hour ago").'),
  icon: z.string().describe('An emoji icon representing the crop.'),
  changeColor: z.enum(['text-green-600', 'text-red-600']).describe('The Tailwind CSS class for the price change text color.'),
});

const GetMarketRatesOutputSchema = z.object({
  crops: z.array(CropDataSchema).describe('An array of 6 different, realistic crops with their market data for Pakistan.'),
});
export type GetMarketRatesOutput = z.infer<typeof GetMarketRatesOutputSchema>;

export async function getMarketRates(): Promise<GetMarketRatesOutput> {
  return getMarketRatesFlow();
}

const prompt = ai.definePrompt({
  name: 'getMarketRatesPrompt',
  output: { schema: GetMarketRatesOutputSchema },
  prompt: `You are an expert on Pakistani agricultural markets.
Generate a realistic and diverse list of exactly 6 major crops grown in Pakistan (like Wheat, Rice, Cotton, Tomato, Onion, Potato, etc.).
For each crop, provide the current, believable market data. The prices should be in Pakistani Rupees (Rs.).
The 'mandi' should be a real, relevant market location in Pakistan.
The 'updated' time should be recent and varied (e.g., "30 minutes ago", "2 hours ago").
Calculate the 'price1kg' based on the 'price40kg'.
The 'change' should be a realistic percentage, and the 'changeColor' should correspond to whether the change is positive or negative.

Your response must be in the specified JSON format.
`,
});

const getMarketRatesFlow = ai.defineFlow(
  {
    name: 'getMarketRatesFlow',
    outputSchema: GetMarketRatesOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
