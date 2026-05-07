# 🛠 Technical Specification — TAKE ONE Nexus

## 1. Frontend Architecture
- **Framework**: Next.js 15.1 (App Router)
- **Runtime**: React 19 (Server & Client Components)
- **Styling**: 
  - Vanilla CSS 3 with custom Design Tokens.
  - CSS Variables for dynamic theme switching.
  - Cinematic Grid System (12-column adaptive).
  - Modern Typography (Inter & Bebas Neue).
- **Animations**: CSS Keyframes + Framer Motion (for complex transitions).

## 2. Backend Architecture
- **Environment**: Node.js 20+
- **API Strategy**: Hybrid approach.
  - **Next.js API Routes**: For serverless functions and SSR data fetching.
  - **Express.js Integration**: For persistent services and complex middleware logic.
- **ORM**: Prisma Client (Type-safe database access).

## 3. Database Layer
- **Primary DB**: TiDB (Distributed SQL, MySQL-compatible).
- **Hosting**: TiDB Cloud (Serverless).
- **Schema Management**: Prisma Migrations.
- **Connection Strategy**: Singleton pattern with connection pooling optimized for Vercel Serverless.

## 4. Authentication System
- **Implementation**: Custom JWT-based authentication.
- **Security**: 
  - Tokens stored in `httpOnly`, `Secure`, `SameSite=Lax` cookies.
  - CSRF protection via middleware.
  - Role-Based Access Control (RBAC) for Admin/Creator/Crew.

## 5. Real-time Communication
- **Provider**: Pusher Channels.
- **Architecture**:
  - Event-driven message synchronization.
  - Client-side subscription via Pusher JS.
  - Server-side triggering via Pusher SDK.
  - Support for typing indicators and online presence.

## 6. Deployment & Infrastructure
- **Hosting**: Vercel (Edge Network).
- **CI/CD**: GitHub Actions integrated with Vercel Deployments.
- **Environment Management**: Vercel Environment Variables.
- **Asset Delivery**: Next.js Optimized Image loader + Vercel Edge Cache.

## 7. State Management
- **Server State**: Next.js 15 Fetch Cache & Revalidation tags.
- **Client State**: 
  - React `useState` / `useContext` for local UI state.
  - Browser URL for filter/search persistence.

## 8. API Structure
- **RESTful Endpoints**: `/api/auth`, `/api/profile`, `/api/scripts`, `/api/chat`.
- **Validation**: Zod (for request payload validation).
- **Error Handling**: Standardized JSON error responses with technical codes.

## 9. Performance Optimizations
- **Static Generation**: ISR (Incremental Static Regeneration) for non-private pages.
- **Dynamic Rendering**: `force-dynamic` for authenticated Creator Profiles.
- **Bundling**: Automatic code splitting and tree-shaking via Webpack/Turbo.
- **Database**: Indexing on critical columns (`email`, `user_id`, `script_id`).

## 10. Security Practices
- **Sanitization**: Automatic escaping via Prisma and React.
- **Headers**: CSP (Content Security Policy), HSTS, X-Frame-Options.
- **Rate Limiting**: Implemented at the API gateway level.

## 11. Future Scalability Plans
- **Microservices**: Migrating the Chat system to a dedicated Go/Rust service.
- **Vector Search**: Integrating Pinecone for AI-powered script matching.
- **Storage**: S3-compatible object storage for high-resolution video reels.

---
**Document Version**: 1.0.4  
**Last Updated**: 2026-05-08  
**System Status**: STABLE
