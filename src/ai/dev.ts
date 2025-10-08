'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/multilingual-voice-interaction.ts';
import '@/ai/flows/voice-profile-assistance.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/get-dashboard-alerts.ts';
import '@/ai/flows/get-market-rates.ts';
