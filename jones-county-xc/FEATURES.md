## Jones County XC — Feature Summary

### Database (MySQL)
- **Athletes table** — Stores each runner's name, grade (9-12), personal record time, and event list, with auto-generated IDs and timestamps
- **Meets table** — Stores competition name, date, location, and description for each cross country meet
- **Results table** — Links athletes to meets with their finish time and placement; enforces a unique constraint so an athlete can only have one result per meet; cascading deletes keep data consistent if an athlete or meet is removed
- **Performance indexes** — Added indexes on grade, date, athlete ID, and meet ID for faster query performance
- **Sample data** — Seeded with 5 Jones County athletes, 3 Georgia meets, and 13 race results

### Backend API (Go + Gin)
- **GET /api/athletes** — Returns all athletes sorted alphabetically by name
- **GET /api/athletes/:id** — Returns a single athlete by ID with proper 404 handling
- **GET /api/meets** — Returns all meets sorted by date (most recent first)
- **GET /api/meets/:id/results** — Returns all race results for a specific meet, sorted by placement
- **GET /health** — Health check endpoint that returns server status
- **CORS middleware** — Configured to allow cross-origin requests from both local development and the production domain
- **sqlc code generation** — Used sqlc to generate type-safe Go code from SQL queries, including full CRUD operations for athletes, meets, and results, plus specialized queries like filtering athletes by grade, getting the fastest PRs, listing upcoming meets, and fetching most recent meet results

### Frontend (React + Vite + Tailwind CSS)
- **Header component** — Site-wide navigation header
- **AthleteList component** — Fetches and displays all athletes in a table showing name, grade, and personal record; uses React Query for data fetching with loading and error states
- **Home page** — Landing page with welcome message
- **Tailwind CSS styling** — Utility-first CSS framework for responsive, modern design
- **Production-ready build** — Vite bundles the app into optimized static assets

### Deployment Infrastructure (AWS Lightsail)
- **Server provisioning** — Ubuntu 24.04 LTS on AWS Lightsail with 1GB swap file added for low-memory stability
- **MySQL 8.0** — Installed and configured with low-memory optimizations; dedicated `xc_app` database user with least-privilege access
- **systemd service** — Backend runs as a managed system service (`jones-county-xc.service`) that starts on boot and auto-restarts on failure
- **Nginx reverse proxy** — Serves the React frontend as static files, proxies `/api/` requests to the Go backend, and handles SPA client-side routing with `try_files`
- **SSL/HTTPS** — Let's Encrypt certificate via Certbot with automatic renewal; HTTP requests redirect to HTTPS
- **Live URL** — https://jackson-web-dev.duckdns.org
