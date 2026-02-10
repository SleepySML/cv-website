# Evgenii Kurdakov — Interactive Resume Website

A modern, interactive portfolio and resume website built with React and Node.js. Features an interactive terminal, particle background, animated sections, and a working contact form.

## Features

- **Interactive Terminal** — Type commands like `help`, `about`, `skills`, `experience` in the hero section
- **Particle Background** — Canvas-based animated constellation effect with mouse interaction
- **Animated Sections** — Smooth scroll-triggered animations powered by Motion (Framer Motion)
- **Experience Timeline** — Expandable cards with achievements and tech stack
- **Skill Visualization** — Color-coded skill categories with hover effects
- **Contact Form** — Working form that submits to the backend API with validation
- **Visitor Counter** — Tracks and displays visitor count
- **Responsive Design** — Fully responsive from mobile to desktop
- **Dark Theme** — Modern dark UI with cyan/purple accent gradient

## Tech Stack

### Frontend
- React 19
- Vite 6
- Motion (Framer Motion) for animations
- React Icons
- CSS3 with custom properties

### Backend
- Node.js
- Express.js
- Rate limiting for contact form
- File-based message storage

## Getting Started

### Prerequisites
- Node.js 18+ installed

### Installation

```bash
# Install all dependencies (root, server, client)
npm run install:all
```

### Development

```bash
# Start both backend (port 4000) and frontend (port 3000) concurrently
npm run dev
```

### Production Build

```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

## Project Structure

```
cv-website/
├── client/                  # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx          # Interactive terminal + particles
│   │   │   ├── ParticleBackground.jsx
│   │   │   ├── About.jsx         # Bio + animated stats
│   │   │   ├── Experience.jsx    # Timeline with expandable cards
│   │   │   ├── Skills.jsx        # Categorized skill tags
│   │   │   ├── Education.jsx     # Education + certifications
│   │   │   ├── Contact.jsx       # Working contact form
│   │   │   └── Footer.jsx        # Visitor counter
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css       # All styles
│   ├── index.html
│   └── vite.config.js
├── server/                  # Express backend
│   ├── data/
│   │   └── resume.json     # Resume data (edit to update content)
│   └── index.js            # API server
└── package.json             # Root workspace scripts
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resume` | Get complete resume data |
| GET | `/api/visitors` | Get and increment visitor count |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/terminal/:command` | Get terminal command output |

## Terminal Commands

Try these in the interactive terminal:
- `help` — List available commands
- `about` — Quick bio
- `skills` — Technical skills overview
- `experience` — Work history summary
- `education` — Educational background
- `contact` — Contact information
- `whoami` — A fun surprise
- `sudo hire evgenii` — Easter egg!
