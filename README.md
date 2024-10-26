# Status Page Application

A simplified status page application that allows administrators to manage services and their statuses, providing a public-facing page for users to view the current status of all services. The application includes user authentication, service management, incident management, real-time updates via WebSocket, and a clean user interface.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [Demo Video](#demo-video)
- [License](#license)

## Features

1. **User Authentication**: Implemented using [Clerk](https://clerk.dev/) for secure user management.
2. **Team Management**: Users can be organized into teams for better service management.
3. **Multi-Tenant Organization**: Support for managing multiple organizations within a single application.
4. **Service Management**:
   - CRUD operations for services (e.g., "Website", "API", "Database").
   - Ability to set and update the status of each service (e.g., "Operational", "Degraded Performance", "Partial Outage", "Major Outage").
5. **Incident/Maintenance Management**:
   - Create, update, and resolve incidents or scheduled maintenance.
   - Associate incidents with specific services and add updates to ongoing incidents.
6. **Real-time Status Updates**: Implemented WebSocket connection to push status changes to connected clients in real-time.
7. **Public Status Page**: 
   - Display current status of all services.
   - Show active incidents and maintenance.
   - Timeline of recent incidents and status changes.

## Technologies Used

- **Backend**: 
  - Node.js
  - TypeScript
  - Express.js
  - MongoDB (Mongoose for ORM)
  - WebSocket for real-time communication
  - Clerk for authentication

- **Frontend**:
  - React
  - ShadcnUI for UI components
  - Axios for API requests

## Project Structure

status-page-app/ ├── status-page-backend/ # Backend code │ ├── src/ │ ├── package.json │ ├── tsconfig.json │ 
└── ... └── status-page-frontend/ # Frontend code ├── src/ ├── package.json └── ...


## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (either locally or using a cloud service like MongoDB Atlas)
- Clerk account (for user authentication)

### Environment Variables

You will need to create a `.env` file in both the `status-page-backend` and `status-page-frontend` folders with the following variables:

**Backend (.env)**
MONGODB_URI=your_mongodb_connection_string 
CLERK_API_KEY=your_clerk_api_key 
WEBSOCKET_URL=your_websocket_url


**Frontend (.env)**
REACT_APP_CLERK_FRONTEND_API_KEY=your_clerk_api_key
PORT=
REACT_APP_BACKEND_URL=your_backend_url
REACT_APP_WEBSOCKET_URL=your_websocket_url

#### Install the dependencies:
```bash
npm install
```
#### Run the backend server:
```bash
npm run dev
```

####Frontend
Navigate to the status-page-frontend directory:
```bash
cd status-page-frontend
```
Install the dependencies:
```bash

npm install
```
Run the frontend server:
```bash
npm start
```
## Deployment

This application can be deployed to platforms such as Heroku for the backend and Vercel for the frontend. Here are some brief instructions:

### Deploying Backend to Heroku

1. **Create a new Heroku app**:
   - Log in to your Heroku account and create a new app.

2. **Link it to your `status-page-backend` directory**:
   - In your terminal, navigate to the `status-page-backend` directory.
   - Run the following command to initialize a git repository if you haven't done so:
     ```bash
     git init
     ```
   - Add your Heroku remote:
     ```bash
     heroku git:remote -a your-heroku-app-name
     ```

3. **Set the environment variables on Heroku**:
   - Use the Heroku dashboard to navigate to your app's settings and add the necessary environment variables, or use the Heroku CLI:
     ```bash
     heroku config:set MONGODB_URI=your_mongodb_connection_string
     heroku config:set CLERK_API_KEY=your_clerk_api_key
     heroku config:set WEBSOCKET_URL=your_websocket_url
     ```

4. **Push your code to Heroku**:
   - Commit your changes if you haven't already:
     ```bash
     git add .
     git commit -m "Deploying to Heroku"
     ```
   - Push your code to Heroku:
     ```bash
     git push heroku master
     ```

### Deploying Frontend to Vercel

1. **Create a new Vercel project**:
   - Sign in to your Vercel account and click on "New Project".
   - Import your frontend code from GitHub or upload it directly.

2. **Link it to your `status-page-frontend` directory**:
   - When prompted, select the `status-page-frontend` directory as your project root.

3. **Set the environment variables in Vercel**:
   - Go to your project's settings in Vercel and add the necessary environment variables:
     ```
     REACT_APP_CLERK_FRONTEND_API=your_clerk_frontend_api
     REACT_APP_WEBSOCKET_URL=your_websocket_url
     ```

4. **Deploy your project**:
   - Click on "Deploy" to build and deploy your frontend application.

Your application should now be live on both Heroku and Vercel! 
