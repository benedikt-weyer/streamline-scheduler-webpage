# Deployment Guide - IONOS VPS with Ansible

This guide explains how to deploy the Streamline Scheduler webpage to an IONOS VPS using Ansible for automated, reproducible deployments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [VPS Initial Setup](#vps-initial-setup)
4. [GitHub Secrets Configuration](#github-secrets-configuration)
5. [Manual Deployment](#manual-deployment)
6. [Automated Deployment (CI/CD)](#automated-deployment-cicd)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance](#maintenance)

## Prerequisites

### Local Machine
- **Ansible** 2.10+ installed
- **Python** 3.8+ installed
- **SSH** access to your VPS
- **Git** for version control

### VPS Requirements
- **Ubuntu 20.04 or 22.04** (recommended)
- **Minimum 2GB RAM** (4GB+ recommended)
- **20GB+ disk space**
- **Root or sudo access**
- **Public IP address**

### Domain & SSL
- A domain name pointing to your VPS IP
- (Optional) SSL certificate via Let's Encrypt

## Local Setup

### 1. Install Ansible

```bash
# macOS
brew install ansible

# Ubuntu/Debian
sudo apt update
sudo apt install ansible

# Using pip
pip install ansible
```

### 2. Install Ansible Collections

```bash
cd streamline-scheduler-webpage
ansible-galaxy collection install -r ansible/requirements.yml
```

### 3. Configure Inventory

Edit `ansible/inventory/hosts.yml` with your VPS details:

```yaml
all:
  children:
    production:
      hosts:
        streamline_vps:
          ansible_host: "YOUR_VPS_IP"
          ansible_user: "YOUR_SSH_USER"
          ansible_port: 22
          domain_name: "your-domain.com"
          enable_ssl: true
```

### 4. Test Connection

```bash
cd ansible
ansible production -m ping
```

## VPS Initial Setup

### Run the Setup Playbook

This playbook installs Docker, Nginx, configures the firewall, and sets up SSL (if enabled).

```bash
# From the ansible directory
cd ansible
ansible-playbook setup.yml
```

**What this does:**
- ✅ Updates system packages
- ✅ Installs Docker and Docker Compose
- ✅ Installs and configures Nginx
- ✅ Sets up UFW firewall
- ✅ Configures SSL with Let's Encrypt (if enabled)
- ✅ Creates application directory
- ✅ Sets up automatic SSL renewal

**Time:** ~10-15 minutes

## GitHub Secrets Configuration

Configure the following secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

### VPS Access Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `VPS_HOST` | VPS IP address | `123.45.67.89` |
| `VPS_USERNAME` | SSH username | `root` or `ubuntu` |
| `VPS_SSH_KEY` | Private SSH key | Contents of `~/.ssh/id_rsa` |
| `VPS_PORT` | SSH port | `22` |
| `DOMAIN_NAME` | Your domain | `streamline.example.com` |
| `ENABLE_SSL` | Enable HTTPS | `true` or `false` |

### Application Secrets

| Secret Name | Description |
|------------|-------------|
| `BETTER_AUTH_URL` | Full URL of your app |
| `BETTER_AUTH_SECRET` | Auth secret (32+ chars) |
| `POSTGRES_USER` | Database username |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Database name |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key |
| `STRIPE_PRICE_PERSONAL_MANAGED_MONTHLY` | Stripe price ID |
| `STRIPE_PRICE_PERSONAL_MANAGED_YEARLY` | Stripe price ID |
| `STRIPE_PRICE_BUSINESS_MANAGED` | Stripe price ID |
| `STRIPE_PRICE_BUSINESS_SELFHOSTED` | Stripe price ID |
| `NEXT_PUBLIC_STREAMLINE_SCHEDULER_URL` | Scheduler app URL |

### Optional Secrets

| Secret Name | Description |
|------------|-------------|
| `BETTER_AUTH_GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `BETTER_AUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth secret |

## Manual Deployment

### Deploy from Local Machine

```bash
# Export environment variables
export VPS_HOST="your-vps-ip"
export VPS_USERNAME="your-username"
export BETTER_AUTH_URL="https://your-domain.com"
# ... export all other secrets

# Run deployment
cd ansible
ansible-playbook deploy.yml
```

### What the Deploy Playbook Does

1. ✅ Copies application files to VPS
2. ✅ Generates `.env.production` with secrets
3. ✅ Stops existing containers
4. ✅ Builds new Docker images
5. ✅ Starts containers with database migrations
6. ✅ Performs health check
7. ✅ Cleans up old images

## Automated Deployment (CI/CD)

### GitHub Actions Workflow

The deployment workflow is triggered automatically on:
- Push to `main` branch
- Manual workflow dispatch

**Workflow file:** `.github/workflows/deploy.yml`

### Manual Trigger

Go to **Actions → Deploy to IONOS VPS → Run workflow**

### Viewing Deployment Logs

1. Go to **Actions** tab in GitHub
2. Click on the latest workflow run
3. View real-time logs

## Troubleshooting

### Common Issues

#### 1. Ansible Can't Connect to VPS

```bash
# Test SSH connection manually
ssh -i ~/.ssh/id_rsa user@your-vps-ip

# Check SSH key permissions
chmod 600 ~/.ssh/id_rsa

# Verify VPS firewall allows SSH
sudo ufw status
```

#### 2. Docker Build Fails

```bash
# SSH into VPS
ssh user@your-vps-ip

# Check Docker logs
cd /opt/streamline-scheduler-webpage
docker compose logs -f app

# Check disk space
df -h
```

#### 3. Database Connection Issues

```bash
# Check if database is running
docker compose ps

# View database logs
docker compose logs db

# Test database connection
docker compose exec db psql -U streamline -d streamline_db
```

#### 4. Nginx Configuration Issues

```bash
# Test nginx config
sudo nginx -t

# View nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

#### 5. SSL Certificate Issues

```bash
# Test certbot renewal
sudo certbot renew --dry-run

# Manual certificate generation
sudo certbot --nginx -d your-domain.com

# Check certificate expiry
sudo certbot certificates
```

### Viewing Application Logs

```bash
# SSH into VPS
ssh user@your-vps-ip

# View all logs
cd /opt/streamline-scheduler-webpage
docker compose logs -f

# View specific service logs
docker compose logs -f app
docker compose logs -f db
```

## Maintenance

### Updating the Application

Push changes to the `main` branch, and GitHub Actions will automatically deploy.

Or manually:

```bash
cd ansible
ansible-playbook deploy.yml
```

### Database Backup

```bash
# SSH into VPS
ssh user@your-vps-ip

# Backup database
docker compose exec db pg_dump -U streamline streamline_db > backup_$(date +%Y%m%d).sql

# Download backup to local machine
scp user@your-vps-ip:/opt/streamline-scheduler-webpage/backup_*.sql ./
```

### Database Restore

```bash
# Copy backup to VPS
scp backup.sql user@your-vps-ip:/opt/streamline-scheduler-webpage/

# SSH into VPS
ssh user@your-vps-ip
cd /opt/streamline-scheduler-webpage

# Restore database
docker compose exec -T db psql -U streamline streamline_db < backup.sql
```

### Monitoring

```bash
# Check container status
docker compose ps

# View resource usage
docker stats

# Check disk space
df -h

# Check memory usage
free -h
```

### Updating System Packages

```bash
cd ansible
ansible-playbook setup.yml --tags system
```

### Restarting Services

```bash
# Restart application
docker compose restart app

# Restart database
docker compose restart db

# Restart all services
docker compose restart

# Restart Nginx
sudo systemctl restart nginx
```

## Security Best Practices

1. **Keep secrets secure**: Never commit `.env` files to version control
2. **Use strong passwords**: Generate random passwords for database
3. **Enable UFW firewall**: Only allow necessary ports
4. **Keep system updated**: Regularly update packages
5. **Monitor logs**: Check logs for suspicious activity
6. **Backup regularly**: Automated daily database backups
7. **Use SSL/HTTPS**: Always enable SSL in production

## Additional Resources

- [Ansible Documentation](https://docs.ansible.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

## Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review application logs
- Create an issue in the repository

