# Spotify to YouTube Music Playlist Transfer SaaS Project

## Project Overview
This project is a Software as a Service (SaaS) that enables users to transfer their Spotify playlists to YouTube Music. The service will be built using vibe coding principles and monetized via advertisements on the website. The development leverages Next.js for both frontend and backend, integrating the Spotify Web API and YouTube Data API for playlist functionality.

## Technology Stack
- **Frontend & Backend:** Next.js (React)
- **APIs:** Spotify Web API, YouTube Data API
- **Authentication:** OAuth for Spotify and Google (YouTube)
- **Advertisement Integration:** Google AdSense or similar

## Workflow Steps
The following steps outline the development process. Each step is designed for execution by an LLM, focusing on coding and UI design tasks that align with vibe coding. Proceed sequentially and confirm completion before moving to the next step.

### Step 1: Set Up the Next.js Project
- Initialize a new Next.js project with TypeScript using the command: `npx create-next-app@latest --ts`.
- Install dependencies: `axios` for API requests, `@react-oauth/google` and a similar library for Spotify OAuth, and any styling libraries (e.g., Tailwind CSS).
- Create a project structure with directories: `/components`, `/pages`, `/utils`, and `/styles`.

### Step 2: Implement Spotify OAuth Authentication
- Build an OAuth authentication flow for Spotify using Next.js API routes and React components.
- Create a login page (`/pages/login.js`) with a "Connect Spotify" button that redirects to Spotify’s OAuth endpoint.
- Set up a callback route (`/pages/api/spotify-callback.js`) to handle the authorization code and exchange it for an access token.
- Store the access token in memory or a secure client-side solution (e.g., context or local storage) for API calls.

### Step 3: Fetch Spotify Playlists
- Write a function in `/utils/spotify.js` to fetch the user’s playlists using the Spotify Web API (`/me/playlists` endpoint).
- Create a `PlaylistList` component in `/components/PlaylistList.js` to display playlists with names and a "Transfer" button.
- Add error handling for failed API requests, showing user-friendly messages in the UI.

### Step 4: Implement YouTube OAuth Authentication
- Set up an OAuth flow for Google (YouTube) using `@react-oauth/google`.
- Create a login page section (`/pages/login.js`) with a "Connect YouTube" button for Google OAuth.
- Build a callback route (`/pages/api/youtube-callback.js`) to process the authorization code and retrieve the access token.
- Store the YouTube access token securely for subsequent API requests.

### Step 5: Search for YouTube Videos
- Develop a function in `/utils/youtube.js` to search YouTube for each Spotify track using the YouTube Data API (`/search` endpoint).
- Map Spotify track details (e.g., artist and title) to YouTube video IDs, handling cases where exact matches are unavailable.
- Optimize the search to prioritize music videos or official uploads.

### Step 6: Create and Populate YouTube Playlist
- Write a function in `/utils/youtube.js` to create a new playlist using the YouTube Data API (`/playlists` endpoint).
- Add each matched video ID to the playlist using the `/playlistItems` endpoint.
- Include error handling for missing videos or API limits, logging issues and skipping problematic tracks.

### Step 7: Design the User Interface
- Design a responsive UI with Next.js components in `/components`.
- Create a main page (`/pages/index.js`) with:
  - A section to select Spotify playlists.
  - A progress bar or status indicator for the transfer process.
  - A confirmation message showing the new YouTube playlist link.
- Use CSS or Tailwind CSS to ensure accessibility and a clean, modern design.

### Step 8: Integrate Advertisements
- Add an advertisement component (e.g., `/components/AdBanner.js`) using Google AdSense or a placeholder for a similar service.
- Place ads in non-intrusive locations (e.g., sidebar or footer) within the UI.
- Ensure the ad integration follows best practices for performance and user experience.

### Step 9: Testing and Debugging
- Write unit tests for key functions (e.g., API calls in `/utils`) using a testing library like Jest.
- Perform manual end-to-end testing of the playlist transfer process in a development environment.
- Debug issues related to authentication, API responses, or UI rendering, logging errors for review.

### Step 10: Deployment Preparation
- Optimize the Next.js app for production with code splitting and static generation where applicable.
- Configure environment variables in a `.env.local` file for API endpoints and other settings (excluding API keys).
- Prepare the project for deployment on a platform like Vercel, ensuring all scripts are production-ready.

## Notes for LLM Execution
- Follow each step in order, waiting for confirmation before proceeding.
- Use modular code design, robust error handling, and inline comments for clarity.
- Ensure API calls respect rate limits and platform policies.
- Prioritize a smooth, intuitive user experience with clear feedback at each stage.

## Commands for LLM
- To start a step: "Begin Step X"
- To confirm completion: "Step X completed"
- To request clarification: "Need clarification on Step X"
- To proceed to the next step: "Proceed to Step X+1"

This structured workflow enables the development of the SaaS using vibe coding, leveraging LLM capabilities for coding and design while ensuring a high-quality, functional product.