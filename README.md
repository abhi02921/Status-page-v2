
---

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
  - **Next.js** (instead of React)
  - ShadcnUI for UI components
  - socket.io for real time status update

## Project Structure

```bash
status-page-app/
├── backend/        # Backend code
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
└── frontend/       # Frontend code (Next.js)
    ├── src/
    ├── package.json
    └── ...
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (either locally or using a cloud service like MongoDB Atlas)
- Clerk account (for user authentication)

### Environment Variables

You will need to create a `.env` file in both the `status-page-backend` and `status-page-frontend` folders with the following variables:

#### **Backend (`.env`)**
```bash
MONGODB_URI=your_mongodb_connection_string 
CLERK_API_KEY=your_clerk_api_key 
WEBSOCKET_URL=your_websocket_url
```

#### **Frontend (`.env.local`)**
```bash
NEXT_PUBLIC_BACKEND_URL=your_backend_url
NEXT_PUBLIC_WEBSOCKET_SERVER_URL=your_websocket_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Install Dependencies

1. **Backend**:
   Navigate to the `status-page-backend` directory and install the dependencies:
   ```bash
   cd backend
   npm install
   ```

2. **Frontend**:
   Navigate to the `status-page-frontend` directory and install the dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

#### Run the Backend Server

Make sure your MongoDB server is running (if using locally), and then run the backend:

```bash
npm run dev
```

This will start the backend on `http://localhost:5000` (or whatever port you configure).

#### Run the Frontend (Next.js)

Navigate to the `status-page-frontend` directory and start the Next.js frontend server:

```bash
npm run dev
```

This will start the frontend on `http://localhost:3000`.

Now, you should have both the backend and frontend running locally.

## Deployment

You can deploy this application using platforms like **Vercel** for the frontend and **Railway**, **Render**, or similar platforms for the backend.

### Deploying the Backend (Railway, Render, or others)

1. **Create a new project** on your chosen platform (e.g., Railway or Render).
2. **Link it to your `status-page-backend` directory**.
3. **Set the environment variables** on the deployment platform as required:
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `MONGODB_URI`
   - `CLERK_API_KEY`
   - `WEBSOCKET_URL`
4. **Deploy the backend**.

Refer to the documentation of the platform you're using for more details on how to deploy Node.js applications.

### Deploying the Frontend to Vercel

1. **Create a new Vercel project**:
   - Sign in to your Vercel account and click on "New Project".
   - Import your frontend code from GitHub or upload it directly.

2. **Link it to your `status-page-frontend` directory**:
   - When prompted, select the `status-page-frontend` directory as your project root.

3. **Set the environment variables in Vercel**:
   - Go to your project's settings in Vercel and add the necessary environment variables:
     ```bash
     NEXT_PUBLIC_BACKEND_URL=your_backend_url
     NEXT_PUBLIC_WEBSOCKET_SERVER_URL=your_websocket_url
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
     CLERK_SECRET_KEY=your_clerk_secret_key
     ```

4. **Deploy your project**:
   - Click on "Deploy" to build and deploy your Next.js frontend application.

## License

This project is licensed under the MIT License.

---

