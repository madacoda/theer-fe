# TanStack Start + shadcn/ui - Frontend

This is the frontend application for the AI Support "Triage & Recovery" Hub.

## 🛠 Prerequisites

- [Bun](https://bun.sh/) (Primary package manager)
- [Docker](https://www.docker.com/) and Docker Compose
- **Backend API**: Ensure the backend services are running before starting the frontend container.

---

## 🚀 Quick Start (Local Development)

To run the application locally using Bun:

1. **Clone the repository** (if you haven't already).
2. **Setup Environment Variables**:
   ```bash
   cp .env.example .env
   ```
3. **Install Dependencies**:
   ```bash
   bun install
   ```
4. **Run Development Server**:
   ```bash
   bun run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000) (or the port specified in your console).

---

## 🐳 Running with Docker

### 🚨 Important: Backend First

Before starting the frontend Docker container, make sure the backend services are already up and running within the `mctheer-network`.

### Automated Setup

We provide setup scripts that handle network creation and container orchestration.

#### Windows (PowerShell)

```powershell
./setup.ps1
```

#### Linux / Mac

```bash
chmod +x setup.sh
./setup.sh
```

### Manual Docker Setup

If you prefer running Docker Compose directly:

1. **Verify Network**: Ensure `mctheer-network` exists.
2. **Build and Start**:
   ```bash
   docker compose up -d --build
   ```

The application will be accessible at [http://localhost:1000](http://localhost:1000).

---

## ⚙️ Environment Variables

Configure these in your `.env` file:

| Variable       | Description                        | Default                            |
| :------------- | :--------------------------------- | :--------------------------------- |
| `PORT`         | Local server port                  | `1000`                             |
| `VITE_API_URL` | Client-side API base path          | `/`                                |
| `API_URL`      | Backend API URL (for SSR proxying) | `http://mctheer-api:3000` (Docker) |

---

## 🧪 Other Commands

- **Build**: `bun run build`
- **Preview**: `bun run preview`
- **Lint**: `bun run lint`
- **Format**: `bun run check`
- **Test**: `bun run test`
