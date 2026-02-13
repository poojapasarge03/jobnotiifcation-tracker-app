# Job Notification Tracker - Route Skeleton

This is the route skeleton for the Job Notification Tracker application, built with the KodNest Premium Build System.

## Routes

- `/` or `/dashboard` - Dashboard page
- `/saved` - Saved items page
- `/digest` - Digest page
- `/settings` - Settings page
- `/proof` - Proof page

## Features

- **Top Navigation Bar** - Clean navigation with active link highlighting (deep red underline)
- **Responsive Design** - Hamburger menu on mobile devices
- **Hash-based Routing** - Client-side routing using URL hash
- **Placeholder Pages** - Each route shows a placeholder with serif heading and subtext

## How to Run

1. Open `app/index.html` in your browser
2. Or use a local server:
   ```powershell
   cd app
   python -m http.server 8000
   ```
   Then visit: `http://localhost:8000/index.html`

## Navigation

- Click any navigation link to navigate between routes
- Active route is highlighted with a deep red underline
- On mobile, click the hamburger icon to toggle the menu

## Design System Compliance

- Uses KodNest Premium Build System colors and typography
- Off-white background (#F7F6F3)
- Deep red accent (#8B0000) for active states
- Serif headings (Georgia)
- Generous whitespace and calm layout
