# Streamline Account - Authentication Portal

This is the centralized authentication and application launcher for the Streamline ecosystem. It provides a unified account system that can be used across multiple Streamline applications, starting with the Streamline Scheduler.

## Features

- 🔐 **Centralized Authentication** - Single account for all Streamline applications
- 📧 **Email & Password** - Secure authentication with Better Auth
- 💳 **Stripe Payments** - Subscription management with Stripe integration
- 🎨 **Modern Landing Page** - Beautiful, responsive design with dark mode
- 💰 **Flexible Pricing** - Personal and business plans, managed and self-hosted options
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

## Integration with Streamline Applications

See [INTEGRATION.md](./INTEGRATION.md) for detailed instructions on integrating Streamline applications with this authentication system.

### Quick Integration Overview

1. Configure your application with the auth server URL
2. Add "Sign in with Streamline Account" option
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

### Option 1: IONOS VPS with Docker & Ansible (Recommended for Full Control)

Fully automated deployment using Ansible playbooks. See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.

**Quick Start:**

1. **Initial VPS Setup** (run once):
   ```bash
   cd ansible
   ansible-playbook setup.yml
   ```

2. **Deploy Application**:
   ```bash
   ansible-playbook deploy.yml
   ```

3. **Automated CI/CD**: Push to `main` branch triggers automatic deployment via GitHub Actions

**Features:**
- ✅ Docker containerization
- ✅ PostgreSQL database included
- ✅ Nginx reverse proxy
- ✅ SSL/HTTPS with Let's Encrypt
- ✅ Automated deployments
- ✅ Zero-downtime updates

### Option 2: Vercel (Easiest)

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

**Note:** You'll need to provide your own PostgreSQL database (use Railway, Supabase, or similar).

### Option 3: Docker Compose (Local or VPS)

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

This is part of the Streamline ecosystem. For contributing guidelines, please see the main Streamline Scheduler repository.

## License

Licensed for personal self-hosting only. See the main Streamline Scheduler repository for full license details.

## Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide for VPS with Ansible
- **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Stripe integration and payment setup
- **[INTEGRATION.md](./INTEGRATION.md)** - Integrating other applications with this auth system
- **[ansible/README.md](./ansible/README.md)** - Ansible playbook documentation

## Support

- Documentation: Check this README and linked documentation files
- Issues: Open an issue on GitHub
- Streamline Scheduler: See the main scheduler repository
