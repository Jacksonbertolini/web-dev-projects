# Jones County XC

A full-stack web application with React frontend and Go backend.

## Project Structure

```
jones-county-xc/
├── frontend/          # React + Vite frontend application
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── App.jsx       # Main application component
│   │   └── main.jsx      # Application entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/           # Go backend API server
│   ├── handlers/         # HTTP request handlers
│   │   └── health.go     # Health check endpoint
│   ├── main.go           # Server entry point
│   └── go.mod            # Go module dependencies
│
├── docs/              # Project documentation
│
└── README.md          # This file
```

## Prerequisites

- **Node.js** (v18 or higher) and npm
- **Go** (v1.21 or higher)

## Getting Started

### Frontend

The frontend is built with React and Vite, using Tailwind CSS for styling.

#### Running the Frontend

```bash
cd frontend
npm install        # Install dependencies (first time only)
npm run dev        # Start development server
```

The frontend will be available at `http://localhost:5173`

#### What the Frontend Does

- Displays a "Hello World" homepage
- Uses Tailwind CSS for modern, responsive styling
- Includes a simple component structure:
  - `Header`: Navigation header component
  - `Home`: Main homepage component

### Backend

The backend is a Go HTTP server that provides API endpoints.

#### Running the Backend

```bash
cd backend
go run main.go     # Start the server
```

The backend will run on `http://localhost:8080`

#### What the Backend Does

- Provides a `/health` endpoint that returns JSON: `{"status": "ok"}`
- Runs on port 8080
- Uses proper Go project structure with separate handlers

#### Testing the Health Endpoint

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{"status":"ok"}
```

## Development

- **Frontend**: Edit files in `frontend/src/` - changes will hot-reload automatically
- **Backend**: Edit files in `backend/` - restart the server to see changes

## Building for Production

### Frontend
```bash
cd frontend
npm run build      # Creates production build in dist/
```

### Backend
```bash
cd backend
go build          # Creates executable binary
```
