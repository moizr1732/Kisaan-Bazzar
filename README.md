
# Kisan Bazaar

This project is a Next.js application built with Firebase Studio. It's an AI-powered assistant and marketplace for farmers.

## Getting Your Project on GitHub

Follow these steps in your terminal to get your code on GitHub.

1.  **Initialize Git:**
    ```bash
    git init -b main
    ```

2.  **Add and Commit Files:**
    ```bash
    git add .
    git commit -m "Initial commit"
    ```

3.  **Link to Your GitHub Repo:**
    ```bash
    # Replace <YOUR_REPOSITORY_URL> with the actual URL from GitHub
    git remote add origin <YOUR_REPOSITORY_URL>
    ```

4.  **Push Your Code:**
    ```bash
    git push -u origin main
    ```

## Deploying Your Application

You can deploy this application to either Vercel or Firebase App Hosting.

### Option 1: Deploying to Vercel (Recommended)

Vercel is the creator of Next.js and provides a seamless deployment experience.

1.  **Push your code to GitHub** (if you haven't already).
2.  Go to [vercel.com](https://vercel.com/new) and sign up or log in with your GitHub account.
3.  **Import your GitHub repository** (`Kisaan-Bazzar`).
4.  **Configure Environment Variables:** Vercel will ask for environment variables. You need to add your Gemini API key.
    *   **Name:** `GEMINI_API_KEY`
    *   **Value:** Paste your actual Gemini API key here.
5.  Click **Deploy**. Vercel will automatically build and deploy your site.

### Option 2: Deploying to Firebase App Hosting

This project is also configured for deployment on Firebase.

1.  **Install Firebase CLI:**
    ```bash
    npm install -g firebase-tools
    ```
2.  **Login to Firebase:**
    ```bash
    firebase login
    ```
3.  **Set Your API Key:** This command securely stores your key for deployment.
    ```bash
    firebase apphosting:secrets:set GEMINI_API_KEY
    ```
    You will be prompted to paste in your key.
4.  **Deploy:**
    ```bash
    firebase deploy --only apphosting
    ```
