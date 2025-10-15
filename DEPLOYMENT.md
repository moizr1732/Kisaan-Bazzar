# Kisan Bazaar: Deployment & Cost Notes

This document provides instructions for deploying the Kisan Bazaar application and an overview of the potential costs involved.

## 1. Deployment

The application is designed for easy deployment on **Firebase**.

### Prerequisites
1.  **Firebase Project:** Create a new project on the [Firebase Console](https://console.firebase.google.com/).
2.  **Node.js:** Ensure you have Node.js (v18 or later) installed.
3.  **Firebase CLI:** Install the Firebase command-line tools: `npm install -g firebase-tools`.

### Deployment Steps

1.  **Login to Firebase:**
    ```bash
    firebase login
    ```

2.  **Initialize Firebase in the Project:**
    If you haven't already, link your local project to your Firebase project.
    ```bash
    firebase init
    ```
    *   Select **App Hosting** from the features list.
    *   Follow the prompts to connect to your existing Firebase project.
    *   When asked for the public directory, it should be the output of your Next.js build (`.next`). The framework integration should handle this.

3.  **Configure Environment Variables:**
    *   You will need a Gemini API key. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to generate one.
    *   Store this key in a `.env` file in the root of your project for local development:
        ```
        GEMINI_API_KEY=your_api_key_here
        ```
    *   For deployment, add this key as a secret in Firebase App Hosting:
        ```bash
        firebase apphosting:secrets:set GEMINI_API_KEY
        ```
        You will be prompted to paste the secret value. This is more secure than storing it in your code.

4.  **Build the Application:**
    Create a production-ready build of your Next.js app.
    ```bash
    npm run build
    ```

5.  **Deploy to Firebase App Hosting:**
    Run the deploy command. This will upload your built application and configure the backend.
    ```bash
    firebase deploy --only apphosting
    ```

After the deployment is complete, the Firebase CLI will provide you with the URL to your live application.

## 2. Cost Estimation

The primary costs for this application will come from Firebase services and Google AI Platform (for Gemini API usage). Both platforms offer generous free tiers, making it very affordable to run for a hackathon or at a small scale.

### Firebase Costs
*   **Authentication:** Free for the first 50,000 Monthly Active Users (MAU).
*   **Firestore (Database):**
    *   **Free Tier:** 1 GiB storage, 50,000 reads/day, 20,000 writes/day.
    *   **Beyond Free Tier:** Costs are low (e.g., ~$0.18 per 100,000 reads). For a hackathon, you are highly unlikely to exceed the free tier.
*   **App Hosting:**
    *   **Free Tier:** 10 GB hosting storage, 35 GB/month data transfer.
    *   **Instance Hours:** The cost depends on the number of server instances running. The `apphosting.yaml` is configured with `maxInstances: 1`, which keeps costs minimal. The free tier includes a significant number of CPU-seconds per day.

**Conclusion for Firebase:** For a hackathon and initial launch, costs are likely to be **$0**.

### Google AI Platform (Gemini API) Costs

Gemini models are billed based on the number of characters in the input and output.

*   **Gemini 2.5 Flash (used for text generation and vision):**
    *   **Free Tier:** Very generous free limits are often available for new users.
    *   **Standard Pricing (Pay-as-you-go):**
        *   Input: ~$0.000125 per 1,000 characters.
        *   Output: ~$0.000375 per 1,000 characters.
        *   Images: ~$0.00025 per image.

*   **Gemini TTS (Text-to-Speech):**
    *   Pricing is typically based on the number of characters synthesized. For example, ~$0.000004 per character.

**Example Cost Scenario (per user interaction):**
*   **User asks a question:** Input (500 chars) + Output (1000 chars) = ~$0.0004375
*   **User gets TTS audio:** 1000 chars = ~$0.004

A full interaction (Question -> Response -> Spoken Audio) costs less than half a cent.

**Conclusion for Google AI:** During development and a hackathon, you will almost certainly stay within the free tier. The costs are negligible for low-to-moderate usage.

### Overall Estimated Cost for Hackathon
**Total Estimated Cost: $0**

The generous free tiers offered by both Firebase and Google Cloud are more than sufficient to build, deploy, and demonstrate this project for a hackathon without incurring any costs.
