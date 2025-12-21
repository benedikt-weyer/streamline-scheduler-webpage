# Kubernetes Deployment Quick Start

This is a quick reference for deploying the Planera Webpage to Kubernetes. For detailed information, see [KUBERNETES_DEPLOYMENT.md](./KUBERNETES_DEPLOYMENT.md).

## Prerequisites

- Kubernetes cluster (K3s or similar)
- kubectl configured
- Traefik ingress controller
- cert-manager installed
- GitHub repository secrets configured

## Setup GitHub Secrets

Add to repository settings → Secrets and variables → Actions:

```bash
# KUBECONFIG - base64 encoded kubeconfig
cat ~/.kube/config | base64 -w 0
```

## Update Secrets (Production)

**⚠️ IMPORTANT**: Before deploying to production, update secrets in:

`k8s/production/postgres.yaml`:
```yaml
stringData:
  POSTGRES_PASSWORD: <use-strong-random-password>
  DATABASE_URL: postgresql://webpage:<same-password>@postgres:5432/webpage_db
  BETTER_AUTH_SECRET: <use-strong-random-secret-min-32-chars>
  STRIPE_SECRET_KEY: sk_live_<your-production-stripe-key>
  STRIPE_WEBHOOK_SECRET: whsec_<your-production-webhook-secret>
```

## Update Domain Names

Update domains in ingress files if needed:

- Staging: `k8s/staging/ingress.yaml`
  - `staging-www.planera.app`

- Production: `k8s/production/ingress.yaml`
  - `www.planera.app`
  - `planera.app` (redirects to www)

## Configure DNS

Point DNS A records to your cluster ingress IP:

```bash
# Get ingress IP
kubectl get svc -n kube-system traefik
```

## Deploy

### Automatic (Recommended)

**Staging**: Automatically deploys on push to `main`

**Production**: 
1. Go to Actions → "Deploy to Production"
2. Click "Run workflow"
3. Type `deploy-to-production`
4. Click "Run workflow"

### Manual

**Staging**:
```bash
kubectl apply -f k8s/staging/namespace.yaml
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<username> \
  --docker-password=<token> \
  --namespace=planera-webpage-staging
kubectl apply -f k8s/staging/
```

**Production**:
```bash
kubectl apply -f k8s/production/namespace.yaml
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=<username> \
  --docker-password=<token> \
  --namespace=planera-webpage-production
kubectl apply -f k8s/production/
```

## Monitor

```bash
# Check pods
kubectl get pods -n planera-webpage-staging
kubectl get pods -n planera-webpage-production

# Check logs
kubectl logs -f deployment/webpage -n planera-webpage-staging
kubectl logs -f deployment/webpage -n planera-webpage-production

# Check ingress
kubectl get ingress -n planera-webpage-staging
kubectl get ingress -n planera-webpage-production
```

## Common Commands

```bash
# Restart deployment
kubectl rollout restart deployment/webpage -n planera-webpage-production

# Scale replicas
kubectl scale deployment/webpage --replicas=3 -n planera-webpage-production

# Rollback
kubectl rollout undo deployment/webpage -n planera-webpage-production

# Access database
kubectl port-forward svc/postgres 5432:5432 -n planera-webpage-production

# Run migrations
POD=$(kubectl get pod -l app=webpage -n planera-webpage-production -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n planera-webpage-production $POD -- pnpm prisma migrate deploy
```

## Troubleshooting

```bash
# Describe pod
kubectl describe pod <pod-name> -n <namespace>

# Get events
kubectl get events -n <namespace> --sort-by='.lastTimestamp'

# Check certificates
kubectl get certificates -n <namespace>
```

## Environment URLs

- **Staging**: 
  - Webpage: https://staging-www.planera.app

- **Production**:
  - Webpage: https://www.planera.app
  - Webpage: https://planera.app (redirects to www)

## Workflow

1. **Develop**: Work on feature branch
2. **Test**: Create PR and review
3. **Staging**: Merge to `main` → auto-deploys to staging
4. **Validate**: Test on staging environment
5. **Production**: Manual workflow dispatch to deploy to prod

---

For detailed documentation, see [KUBERNETES_DEPLOYMENT.md](./KUBERNETES_DEPLOYMENT.md).

