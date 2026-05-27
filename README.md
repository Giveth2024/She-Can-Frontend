# She Can Foundation — Frontend

READ requirements.txt file First

A modern Next.js admin and public intake frontend built for the She Can Foundation. This app provides a public contact submission form and a Clerk-secured admin console for reviewing, refreshing, and deleting intake records.

## Core Tech Stack

- Next.js 16.2.6
- React 19.2.4
- Clerk Auth (`@clerk/nextjs`)
- Tailwind CSS v4
- ESLint 9

## Key Architecture & Features

- Public contact submission page with client-side validation and form state handling.
- Clerk-based authentication flow for admin access.
- Admin redirect route and auth callback sync page.
- Admin dashboard with protected record fetching, refresh, and delete capabilities.
- Global layout and styling with Tailwind CSS and font loading in `src/app/layout.js`.

## Getting Started & Local Installation

### Prerequisites

- Node.js `>= 18.x`
- npm `>= 10.x`
- A Clerk application configured for frontend auth
- A backend API URL for intake submission and admin endpoints

### Installation Steps

```bash
# 1. Clone the project repository
git clone <repo-url> frontend

# 2. Move into the frontend folder
cd frontend

# 3. Install core dependencies
npm install
```

### Environment Configuration (`.env.local`)

Create a `.env.local` file at the project root with the following values:

```env
NEXT_PUBLIC_API_BASE_URL=your_backend_url_here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
# Add Clerk server-side keys as required by your deployment platform, e.g.:
# CLERK_SECRET_KEY=your_clerk_secret_key_here
# CLERK_ISSUER_BASE_URL=your_clerk_issuer_url_here
```

### Development Runtime Commands

- **Run Development Server:** `npm run dev`
- **Build Production Bundle:** `npm run build`
- **Start Production Server:** `npm run start`
- **Lint Files:** `npm run lint`

---

## Directory & Page Architecture Blueprint

### Folder Directory Map

```text
/
  package.json
  next.config.mjs
  proxy.ts
  README.md
  src/
    app/
      layout.js
      page.js
      admin/
        page.js
        auth-callback/
          page.js
        dashboard/
          page.js
        sign-in/
          [[...sign-in]]/
            page.js
```

### Page Documentation Structure

#### 📄 `/`
- **Purpose:** Public contact intake page for visitors to submit name, email, and a message.
- **Access Clearance:** Public access.
- **State Management:** `formData`, `errors`, `isLoading`, `isSubmitted`, `serverError`.
- **Side-Effects & Hooks:** No `useEffect`; form validation runs on submit and local state changes reset validation errors.
- **External API Dependencies:** `POST ${process.env.NEXT_PUBLIC_API_BASE_URL}/api/submissions` with JSON payload `{ name, email, message }`.

#### 📄 `/admin`
- **Purpose:** Admin entry route that immediately redirects users to the login gate.
- **Access Clearance:** Public access, redirects to sign-in page.
- **State Management:** None.
- **Side-Effects & Hooks:** Uses Next.js server-side `redirect()` from `next/navigation`.
- **External API Dependencies:** None.

#### 📄 `/admin/sign-in`
- **Purpose:** Clerk sign-in page to authenticate admin users.
- **Access Clearance:** Public access with authentication gateway.
- **State Management:** None locally inside the page component.
- **Side-Effects & Hooks:** Reads search params via `useSearchParams()` to support redirect flow.
- **External API Dependencies:** Clerk frontend login system via `@clerk/nextjs`.

#### 📄 `/admin/auth-callback`
- **Purpose:** Post-login sync page that validates Clerk session, logs sign-in activity, then routes to the dashboard.
- **Access Clearance:** Authenticated admin only.
- **State Management:** `errorMessage`, `runLogSync` ref.
- **Side-Effects & Hooks:** `useEffect` waits for Clerk auth load, checks `userId`, gets token, posts to `/api/admin/log-signin`, then redirects to `/admin/dashboard`.
- **External API Dependencies:** `POST ${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/log-signin` with bearer token authorization.

#### 📄 `/admin/dashboard`
- **Purpose:** Protected admin dashboard for reviewing incoming submissions and managing records.
- **Access Clearance:** Authenticated admin only.
- **State Management:** `submissions`, `loading`, `errorMessage`.
- **Side-Effects & Hooks:** `useEffect` fetches submission list on mount and when `getToken` changes. Supports record delete with reload-free state updates.
- **External API Dependencies:** 
  - `GET ${process.env.NEXT_PUBLIC_API_BASE_URL}/api/submissions` with `Authorization: Bearer <token>`.
  - `DELETE ${process.env.NEXT_PUBLIC_API_BASE_URL}/api/submissions/:id` with `Authorization: Bearer <token>`.

---

## Global Architecture & Component Standards

- **Authentication & Route Protection Strategy:** The app is built to use Clerk authentication. `src/app/layout.js` wraps the app in `ClerkProvider`. The root middleware logic is present in `proxy.ts` via `clerkMiddleware()` and is intended to enforce auth-protected routes.
- **Styling Architecture:** Tailwind CSS is used for layout and design. Global styles are imported from `src/app/globals.css`, and fonts are loaded in the root layout via Google Fonts.
- **Client/Server Boundaries:** `use client` is declared on interactive pages (`page.js` files that use hooks, Clerk, or client-side form logic). Layout is server-rendered with `ClerkProvider` around the body.

## Production Deployment Notes

- This project is compatible with Vercel or any platform that supports Next.js 16.
- Deployments should inject the `NEXT_PUBLIC_API_BASE_URL` and Clerk environment variables through platform environment settings.
- Use `npm run build` for production compilation and `npm run start` to launch the optimized build.
- Verify Clerk configuration and backend API endpoint availability before issuing production traffic.
