# Kisan Bazaar: Technical Design Document

## 1. Overview
This document outlines the technical architecture, components, and data models for the Kisan Bazaar application. The system is designed as a modern, server-rendered web application with a serverless backend, leveraging AI for its core functionalities.

## 2. Architecture
The application follows a monolithic architecture using Next.js, which handles both the frontend and server-side logic (via Server Components and API Routes/Server Actions). Firebase provides the backend-as-a-service (BaaS) for authentication, database, and hosting. Genkit is used as the AI orchestration layer, simplifying interactions with Google's Gemini models.

### Core Components:
*   **Frontend (Client):** Built with Next.js (App Router), React, and TypeScript. Styled with Tailwind CSS and ShadCN UI for a consistent and modern look.
*   **AI Flows (Server):** Managed by Firebase Genkit. These are server-side TypeScript functions that define prompts, call Gemini models (for text, vision, and TTS), and structure the output.
*   **Database:** Firestore (NoSQL) is used for storing user profiles, crop information, and advisory history.
*   **Authentication:** Firebase Authentication handles user registration and login with email and password.

## 3. Data Models (Firestore)

### `users` collection
Stores public and private information for each user (farmer).
*   **Document ID:** `user.uid`
*   **Schema:**
    ```typescript
    interface UserProfile {
      uid: string;          // Firebase Auth User ID
      email: string;        // User's email
      name?: string;        // User's full name
      location?: string;     // e.g., "Sahiwal, Punjab"
      phoneNumber?: string;
      farmSize?: number;     // in acres
      language?: 'en' | 'ur' | 'pa' | 'si' | 'ps';
      photoURL?: string;     // URL to profile picture
      crops?: Crop[];        // Array of crops grown by the farmer
    }

    interface Crop {
      slug: string;         // e.g., "basmati-rice"
      name: string;         // e.g., "Basmati Rice"
      price?: string;        // Price per 40kg
      imageUrl?: string;     // URL to crop image
      icon?: string;         // Emoji icon as a fallback
    }
    ```

### `advisories` collection
Stores a history of all AI-generated diagnostic advisories for users.
*   **Document ID:** Auto-generated
*   **Schema:**
    ```typescript
    interface Advisory {
      id: string;
      userId: string;       // Foreign key to the users collection
      createdAt: Timestamp; // Server timestamp of when the advisory was created
      diagnosis: string;    // The text of the AI-generated diagnosis/advice
    }
    ```

## 4. Key AI Flows (Genkit)

All flows are defined in the `src/ai/flows/` directory.

1.  **`multilingualVoiceInteraction`**
    *   **Input:** Text, voice audio (data URI), or image (data URI), along with user context.
    *   **Process:** Uses a Gemini model with multimodal capabilities. The prompt instructs the model to act as "Moiz," an agricultural expert, detect the user's language, and provide a context-aware response based on the query and user profile.
    *   **Output:** A structured JSON object containing the `response` text and the `detectedLanguage`.

2.  **`textToSpeech`**
    *   **Input:** Text string.
    *   **Process:** Calls the `gemini-2.5-flash-preview-tts` model to generate audio. The raw PCM audio data is then encoded into a WAV format and returned as a Base64 data URI.
    *   **Output:** A JSON object with an `audio` field containing the `data:audio/wav;base64,...` string.

3.  **`getDashboardAlerts`**
    *   **Input:** User's location and list of crops.
    *   **Process:** Calls Gemini with a prompt to generate three distinct, realistic alerts: one for weather, one for a potential crop disease, and one for a market update. The model is instructed to provide output in a specific JSON format.
    *   **Output:** An array of 3 alert objects, each with a `type`, `message`, and `color` hint.

4.  **`getMarketRates`**
    *   **Input:** None.
    *   **Process:** Prompts Gemini to act as a Pakistani agricultural market expert and generate a list of 6 major crops with realistic, current market data (prices, demand, location, etc.).
    *   **Output:** A structured JSON object containing an array of crop data.

5.  **`profileAssistance`**
    *   **Input:** User's voice input and the current conversation context.
    *   **Process:** A stateful conversational flow. The AI asks one question at a time to gather profile information (name, language, etc.), storing the answers in the `context` field between turns.
    *   **Output:** The agent's next question, the updated `newContext`, and a `completed` flag.

## 5. Frontend Architecture

*   **App Router:** The app uses the Next.js App Router for file-based routing.
*   **Client Components (`'use client'`):** Used for pages and components that require interactivity, state, and browser-side hooks (e.g., `useState`, `useEffect`). Examples include the Voice Agent page and the Community Marketplace filters.
*   **Server Components:** Used wherever possible to improve performance by rendering on the server.
*   **Layouts (`src/app/layout.tsx`, `AppLayout.tsx`, `PublicLayout.tsx`):** A nested layout structure provides a consistent UI shell for different parts of the application (e.g., the authenticated dashboard vs. the public marketplace).
*   **Authentication:** `useAuth` hook provides access to the user's authentication state and profile throughout the app. It's backed by a React Context (`AuthContext`).

## 6. UI/UX Principles
*   **Mobile-First:** The design is responsive and optimized for mobile devices.
*   **Accessibility:** Key features are voice-driven to accommodate users with low literacy or who find touch interfaces difficult.
*   **Simplicity:** The UI is kept clean and uncluttered, using familiar patterns and clear iconography to guide the user.
*   **Visual Feedback:** Loaders, skeletons, and toast notifications are used to provide clear feedback to the user about the application's state.
