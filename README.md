# Plandera Account - Authentication Portal

This is the centralized authentication and application launcher for the Plandera ecosystem. It provides a unified account system that can be used across multiple Plandera applications.

## Features

- 🔐 **Centralized Authentication** - Single account for all Plandera applications
- 📧 **Email & Password** - Secure authentication with Better Auth
- 💳 **Stripe Payments** - Subscription management with Stripe integration
- 🎨 **Modern Landing Page** - Beautiful, responsive design with dark mode
- 💰 **Flexible Pricing** - Personal and business plans, managed and self-hosted options
- 👤 **User Profile** - Dashboard to manage your account and launch applications
- 🔗 **Application Launcher** - Quick access to all Plandera apps from one place
- 🔒 **Session Management** - Secure session handling and validation API
- 🌐 **Integration Ready** - Easy integration for Plandera applications

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd plandera-webpage
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
   - `NEXT_PUBLIC_PLANERA_URL`: URL of your Plandera application instance
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe keys (see [STRIPE_SETUP.md](./STRIPE_SETUP.md))

4. **Set up the database**:
   ```bash
   pnpm db:push
   ```

5. **Start the development server**:
   ```bash
   pnpm dev
   ```

6. **Set up Stripe** (optional, for payments):
   See [STRIPE_SETUP.md](./STRIPE_SETUP.md) for detailed instructions.

7. **Open your browser** to [http://localhost:2999](http://localhost:2999)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Better Auth API routes
│   │   ├── stripe/        # Stripe checkout, webhook, portal
│   │   ├── subscription/  # Subscription status and details
│   │   └── validate-session/ # Session validation for integrations
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── profile/           # User dashboard and app launcher
│   │   └── subscriptions/ # Subscription management page
│   ├── pricing/           # Pricing page with plans
│   ├── page.tsx           # Landing page
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── navbar.tsx         # Navigation bar with auth state
│   └── theme-switcher.tsx # Dark/light mode toggle
├── lib/
│   └── stripe.ts          # Stripe configuration and utilities
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

## Integration with Plandera Applications

See [INTEGRATION.md](./INTEGRATION.md) for detailed instructions on integrating Plandera applications with this authentication system.

### Quick Integration Overview

1. Configure your application with the auth server URL
2. Add "Sign in with Plandera Account" option
3. Redirect users to the auth server for login
4. Validate session tokens using the API endpoint
5. Access user information securely

## Available Scripts

### Development
- `pnpm dev` - Start development server (port 2999)
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format:check` - Check code formatting

### Database
- `pnpm db:push` - Push database schema changes
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio

### Production
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm preview` - Build and start production server

### Deployment (Ansible)
- See [ansible/README.md](./ansible/README.md) for Ansible commands

## Environment Variables

See `.env.example` for all required environment variables.

### Required:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret for session encryption
- `NEXT_PUBLIC_PLANERA_URL` - URL of Plandera application

### Optional:
- `BETTER_AUTH_GITHUB_CLIENT_ID` - GitHub OAuth (optional)
- `BETTER_AUTH_GITHUB_CLIENT_SECRET` - GitHub OAuth (optional)

## User Flow

1. **Landing Page** → User sees features and benefits
2. **Registration** → User creates account with email/password
3. **Profile Dashboard** → User sees available applications
4. **Launch Application** → Opens Plandera (or other apps)
5. **Seamless Auth** → Applications validate session with auth server

## Security Features

- Secure password hashing with Better Auth
- Session-based authentication
- CORS configuration for application integration
- HTTPS enforcement (production)
- Secure cookie handling
- Rate limiting ready

## Deployment

### Option 1: Kubernetes (Recommended for Production)

Deploy to a Kubernetes cluster with staging and production environments. See [K8S_QUICKSTART.md](./K8S_QUICKSTART.md) for quick start.

**Quick Start:**
```bash
# Deploy to staging (automatic on merge to main)
git push origin main

# Deploy to production (manual with confirmation)
# Go to GitHub Actions → "Deploy to Production" → Run workflow
```

**Features:**
- ✅ Separate staging and production namespaces
- ✅ Automatic deployment via GitHub Actions
- ✅ TLS certificates via cert-manager
- ✅ Horizontal scaling support
- ✅ Zero-downtime rolling updates
- ✅ PostgreSQL database included

See [K8S_QUICKSTART.md](./K8S_QUICKSTART.md) for quick reference and detailed documentation.

### Option 2: Vercel (Easiest for Quick Testing)

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

**Note:** You'll need to provide your own PostgreSQL database (use Railway, Supabase, or similar).

### Option 3: Docker Compose (Local Development)

```bash
# Copy environment template
cp env.production.template .env.production

# Edit .env.production with your values
nano .env.production

# Start services
docker compose up -d

# View logs
docker compose logs -f
```

## Contributing

This is part of the Plandera ecosystem. For contributing guidelines, please see the main Plandera repository.

## License

Licensed for personal self-hosting only. See the main Plandera repository for full license details.

## Documentation

- **[K8S_QUICKSTART.md](./K8S_QUICKSTART.md)** - Kubernetes deployment quick reference
- **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Stripe integration and payment setup
- **[INTEGRATION.md](./INTEGRATION.md)** - Integrating other applications with this auth system
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Alternative deployment options
- **[VPS-DEPLOYMENT.md](./VPS-DEPLOYMENT.md)** - Legacy VPS deployment with Ansible

## Support

- Documentation: Check this README and linked documentation files
- Issues: Open an issue on GitHub
- Plandera: See the main Plandera application repository
