# Streamline Account - Authentication Portal

This is the centralized authentication and application launcher for the Streamline ecosystem. It provides a unified account system that can be used across multiple Streamline applications, starting with the Streamline Scheduler.

## Features

- 🔐 **Centralized Authentication** - Single account for all Streamline applications
- 📧 **Email & Password** - Secure authentication with Better Auth
- 🎨 **Modern Landing Page** - Beautiful, responsive design with dark mode
- 👤 **User Profile** - Dashboard to manage your account and launch applications
- 🔗 **Application Launcher** - Quick access to all Streamline apps from one place
- 🔒 **Session Management** - Secure session handling and validation API
- 🌐 **Integration Ready** - Easy integration for Streamline applications

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd streamline-scheduler-webpage
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXT_PUBLIC_STREAMLINE_SCHEDULER_URL`: URL of your Streamline Scheduler instance

4. **Set up the database**:
   ```bash
   pnpm db:push
   ```

5. **Start the development server**:
   ```bash
   pnpm dev
   ```

6. **Open your browser** to [http://localhost:3001](http://localhost:3001)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Better Auth API routes
│   │   └── validate-session/ # Session validation for integrations
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── profile/           # User dashboard and app launcher
│   ├── page.tsx           # Landing page
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── navbar.tsx         # Navigation bar with auth state
│   └── theme-switcher.tsx # Dark/light mode toggle
└── server/
    ├── better-auth/       # Better Auth configuration
    └── db.ts              # Prisma client
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Authentication**: Better Auth
- **Database**: PostgreSQL with Prisma
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **State Management**: React Context + tRPC

## Integration with Streamline Applications

See [INTEGRATION.md](./INTEGRATION.md) for detailed instructions on integrating Streamline applications with this authentication system.

### Quick Integration Overview

1. Configure your application with the auth server URL
2. Add "Sign in with Streamline Account" option
3. Redirect users to the auth server for login
4. Validate session tokens using the API endpoint
5. Access user information securely

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:push` - Push database schema changes
- `pnpm db:studio` - Open Prisma Studio

## Environment Variables

See `.env.example` for all required environment variables.

### Required:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret for session encryption
- `NEXT_PUBLIC_STREAMLINE_SCHEDULER_URL` - URL of Streamline Scheduler

### Optional:
- `BETTER_AUTH_GITHUB_CLIENT_ID` - GitHub OAuth (optional)
- `BETTER_AUTH_GITHUB_CLIENT_SECRET` - GitHub OAuth (optional)

## User Flow

1. **Landing Page** → User sees features and benefits
2. **Registration** → User creates account with email/password
3. **Profile Dashboard** → User sees available applications
4. **Launch Application** → Opens Streamline Scheduler (or other apps)
5. **Seamless Auth** → Applications validate session with auth server

## Security Features

- Secure password hashing with Better Auth
- Session-based authentication
- CORS configuration for application integration
- HTTPS enforcement (production)
- Secure cookie handling
- Rate limiting ready

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Docker

Coming soon...

## Contributing

This is part of the Streamline ecosystem. For contributing guidelines, please see the main Streamline Scheduler repository.

## License

Licensed for personal self-hosting only. See the main Streamline Scheduler repository for full license details.

## Support

- Documentation: Check this README and INTEGRATION.md
- Issues: Open an issue on GitHub
- Streamline Scheduler: See the main scheduler repository
