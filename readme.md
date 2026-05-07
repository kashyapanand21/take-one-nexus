# 🎬 TAKE ONE Nexus

![Version](https://img.shields.io/badge/version-2.1.0--GOLD-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Operational-green?style=for-the-badge)
![Environment](https://img.shields.io/badge/Env-Production-red?style=for-the-badge)

> **"The signal is live. The director is on set. Welcome to the Nexus."**

TAKE ONE Nexus is a high-performance, cinematic collaboration platform for the next generation of filmmakers, writers, and creative technicians. Built with a "Director-first" philosophy, it streamlines the journey from script to screen.

---

## ⚡ Project Overview

Nexus is a hybrid ecosystem combining the speed of **Next.js 15** with the robustness of a **Custom Node.js/Express** backend. It serves as a central hub where creators can host their portfolios, pitch scripts, find technical crew, and manage real-time collaborations through an encrypted communication layer.

## 🚀 Key Features

- **Cinematic Profile System**: Technical "Creator Mode" profiles with integrated portfolios and skill matrices.
- **Script Vault**: Secure hosting and discovery for screenplays and storyboards.
- **Real-time Comms**: Instant messaging system powered by Pusher for low-latency collaboration.
- **Uplink Intelligence**: Automated matching system connecting scripts with relevant crew members.
- **Admin Control Room**: A technical command center for platform oversight and user management.
- **Responsive Geometry**: Fully adaptive UI optimized for desktop monitors and mobile field units.

## 📸 Screenshots

| Dashboard | Creator Profile | Chat Uplink |
| :---: | :---: | :---: |
| ![Placeholder](https://placehold.co/600x400/06080A/FF4D1A?text=Nexus+Dashboard) | ![Placeholder](https://placehold.co/600x400/06080A/FF4D1A?text=Creator+Profile) | ![Placeholder](https://placehold.co/600x400/06080A/FF4D1A?text=Chat+Uplink) |

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Vanilla CSS (Cinematic Grid System)
- **Backend**: Node.js, Express (Hybrid API Layer)
- **Database**: TiDB / MySQL (via Prisma ORM)
- **Real-time**: Pusher Channels
- **Auth**: JWT (JSON Web Tokens) with Secure Cookie Storage
- **Styling**: Custom CSS Variables, Glassmorphism, Neon UI Tokens
- **Deployment**: Vercel (Production Edge)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18.x or higher
- MySQL-compatible database (TiDB, PlanetScale, or local MySQL)

### Steps
1. **Clone the Uplink**:
   ```bash
   git clone https://github.com/alokr25012-lab/take-one-nexus.git
   cd take-one-nexus
   ```

2. **Initialize Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env` and fill in your credentials.

4. **Synchronize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Feed**:
   ```bash
   npm run dev
   ```

## 🔑 Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | Prisma connection string | `mysql://...` |
| `JWT_SECRET` | Secret for token signing | `...` |
| `PUSHER_APP_ID` | Real-time service ID | `...` |
| `NEXT_PUBLIC_PUSHER_KEY` | Public client key | `...` |

## 📂 Folder Structure

```text
├── prisma/               # Database Schema & Migrations
├── public/               # Static Assets & Global Scripts
├── src/
│   ├── app/              # Next.js Pages & Routes
│   ├── components/       # UI Components
│   ├── lib/              # Core Utilities (Auth, DB, Constants)
│   └── middleware/       # Route Protection
├── utils/                # Helper Functions
└── server.js             # Express API Integration
```

## 🔐 Authentication Flow

1. **Uplink Request**: User submits credentials via `/api/auth/login`.
2. **Token Generation**: Server validates and issues a signed JWT.
3. **Secure Storage**: JWT is stored in an `httpOnly` secure cookie.
4. **Session Persistence**: `getCurrentUser()` utility verifies token on server-side renders.

## 💬 Chat System Overview

The Nexus Chat Uplink utilizes **Pusher** for real-time synchronization. 
- **Channels**: `private-chat-{conversationId}`
- **Events**: `new-message`, `typing-indicator`
- **Persistence**: Messages are archived in the MySQL database via Prisma.

## 👤 Profile & Avatar System

Profiles are dynamic entities. Avatars are handled via a custom `getAvatarUrl` utility which supports:
- User-uploaded assets.
- Gender-specific fallbacks.
- Identicon generation for new recruits.

## 🔮 Future Improvements

- [ ] **Nexus AI**: Automated script analysis and genre tagging.
- [ ] **Scene Builder**: Interactive storyboard collaboration tool.
- [ ] **Film Fund Integration**: Direct-to-producer pitching pipeline.
- [ ] **PWA Support**: Full offline access for on-set coordination.

## 👥 Contributors

- **Lead Architect**: [Alok Raj](https://github.com/alokr25012)
- **Dev Crew**: Nexus Core Team

## ⚖️ License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<p align="center">
  <b>TAKE ONE Nexus © 2026 — Built for the Future of Cinema</b>
</p>
