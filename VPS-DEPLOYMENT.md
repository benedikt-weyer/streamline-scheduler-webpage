## Deployment Architecture

This application can be deployed in two modes:

### 1. Local Development (with local nginx)
```bash
docker compose --profile local-dev up -d
```
Access: `https://localhost`

### 2. Production (VPS with main nginx proxy)
```bash
docker compose up -d
```

In production:
- App is exposed to the `proxy-network` (shared with main VPS nginx)
- Main VPS nginx (from `streamline-vps` repo) handles routing
- Subdomain configured via VPS infrastructure

## VPS Deployment

### Prerequisites
1. Deploy main VPS infrastructure from `streamline-vps` repository
2. Configure subdomain routing for this application

### Steps

1. **Configure subdomain** (from `streamline-vps` repository):
   - Go to GitHub Actions → "Update Subdomain Configuration"
   - Click "Run workflow"
   - Enter:
     - Subdomain: `scheduler`
     - Upstream host: `streamline-app` (container name)
     - Upstream port: `3000`
     - Domain: `yourdomain.com`
     - Enable SSL: `true`

2. **Deploy application** (from this repository):
   - Trigger GitHub Actions deployment workflow
   - Or manually:
     ```bash
     ansible-playbook -i ansible/inventory/hosts.yml ansible/deploy.yml
     ```

3. **Access**:
   - `https://scheduler.yourdomain.com`

## Network Architecture

```
Internet
    ↓
Main VPS Nginx (port 443)
    ↓
proxy-network (Docker)
    ↓
streamline-app:3000
    ↓
streamline-network (Docker)
    ↓
streamline-db:5432
```

The application connects to two networks:
- `proxy-network`: Shared external network for main VPS nginx
- `streamline-network`: Internal network for app-database communication
