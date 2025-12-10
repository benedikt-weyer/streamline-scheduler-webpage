## Deployment Architecture

### Local Development
```bash
docker compose --profile local-dev up -d
```
Access: `https://localhost`

### Production Deployment

This application uses a **container registry + k3s** deployment model:

1. **Build Phase** (this repository):
   - GitHub Actions builds Docker image
   - Pushes to GitHub Container Registry (GHCR)
   - Tagged with branch name and commit SHA

2. **Deploy Phase** (`streamline-vps` repository):
   - VPS runs k3s (lightweight Kubernetes)
   - Pulls images from GHCR
   - Deploys to k3s cluster

## Deployment Flow

```
Developer Push
    ↓
GitHub Actions (this repo)
    ↓
Build Docker Image
    ↓
Push to GHCR
    ↓
Trigger Deployment Webhook
    ↓
streamline-vps Repository
    ↓
Pull from GHCR
    ↓
Deploy to k3s
    ↓
Application Running
```

## Local Build and Push

```bash
# Build image
docker build -t ghcr.io/benedikt-weyer/streamline-scheduler-webpage:latest .

# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Push image
docker push ghcr.io/benedikt-weyer/streamline-scheduler-webpage:latest
```

## Deployment Steps

1. **Make changes and push to main**:
   ```bash
   git add .
   git commit -m "feat: your changes"
   git push origin main
   ```

2. **Image is automatically built**:
   - GitHub Actions builds and pushes to GHCR
   - Image tagged with branch and SHA

3. **Deploy via VPS repository**:
   - Go to `streamline-vps` repository
   - Actions → "Deploy Application to k3s"
   - Select application and image tag
   - Click "Run workflow"

## Network Architecture

```
Internet
    ↓
k3s Ingress Controller (Traefik)
    ↓
Kubernetes Service (streamline-app)
    ↓
Pod: streamline-app:3000
    ↓
Pod: streamline-db:5432
```

All managed within k3s cluster on the VPS.
