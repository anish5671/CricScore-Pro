
# CricScore Pro — Frontend

React + Vite + Tailwind CSS frontend for cricket scorecard management.

## Setup
```bash
npm install
npm run dev
```

## Pages
| Page | Path | Description |
|------|------|-------------|
| Login | /login | User authentication |
| Register | /register | New user registration |
| Dashboard | /dashboard | Overview and stats |
| Matches | /matches | All matches |
| Live Scoring | /matches/:id/scoring | Ball by ball scoring |
| Scorecard | /matches/:id/scorecard | Match scorecard |
| Teams | /teams | Team management |
| Players | /players | Player profiles |
| Tournaments | /tournaments | Tournament management |
| Analytics | /analytics | Statistics |
| Admin | /admin | User management |

## Environment Variables
Create `.env` file:
```
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```
