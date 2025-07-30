# MediMind: AI-Powered Medical Diagnosis Assistant

Created by JMR

MediMind is an advanced, AI-driven web application designed to support healthcare professionals by providing rapid analysis of patient reports and summarization of medical documents. It leverages generative AI to offer insights, potential diagnoses, and treatment recommendations based on the data provided.

## Key Features

- **Patient Report Analysis**: Paste unstructured patient notes or upload medical documents (like lab results or imaging reports) to receive a comprehensive analysis. The AI identifies a primary diagnosis, lists differential diagnoses, provides a confidence score, and outlines the diagnostic reasoning.
- **Comprehensive Treatment Plans**: For each analysis, the AI generates a detailed treatment plan, including recommended medications, therapies, and lifestyle modifications.
- **Document Summarization**: Quickly get the gist of lengthy medical articles or research papers by uploading them for a concise, AI-generated summary.
- **Modern & Responsive UI**: Built with Next.js and ShadCN UI components for a clean, intuitive, and fully responsive user experience that works seamlessly on desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **UI**: [ShadCN UI](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)
- **AI/Generative**: Google Gemini via [Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: Firebase App Hosting

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en) (version 20 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repository-url>
   cd <repository-folder>
   ```

2. **Install NPM packages:**
   ```sh
   npm install
   ```

### Running the Development Server

Once the dependencies are installed, you can run the local development server:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

This application is configured for easy deployment using **Firebase App Hosting**. Once your Firebase project is set up and the Firebase CLI is installed and authenticated, you can deploy the application with a single command:

```sh
firebase deploy
```

This command will build your Next.js application and deploy it to Firebase.
