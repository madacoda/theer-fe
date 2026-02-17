# TanStack Start + shadcn/ui - Frontend

This is the frontend application for the AI Support "Triage & Recovery" Hub.

## Prerequisites

- Docker and Docker Compose installed.
- (Optional) Backend API running on `http://mctheer-api:3000` within the `mctheer-network`.

## Quick Start (Docker)

To run the application in a production-ready Docker container with no hassle:

### Windows (PowerShell)

```powershell
./setup.ps1
```

### Linux / Mac

```bash
chmod +x setup.sh
./setup.sh
```

This will:

1. Create the required Docker network (`mctheer-network`) if it doesn't exist.
2. Build the Docker image.
3. Start the container on port `1000`.

Access the application at [http://localhost:1000](http://localhost:1000).

## Environment Variables

Copy `.env.example` to `.env` to configure local development settings.

- `PORT`: Port to run the server on (default: 1000)
- `VITE_API_URL`: Base URL for API requests (default: /)
- `API_URL`: Backend API URL for server-side proxying (default: http://localhost:3000 locally, http://mctheer-api:3000 in Docker)

## Development

To run locally without Docker:

```bash
npm install
npm run dev
```
