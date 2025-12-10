# Ansible Deployment for Streamline Scheduler

This directory contains Ansible playbooks and configurations for deploying the Streamline Scheduler webpage to an IONOS VPS.

## Quick Start

### 1. Install Requirements

```bash
# Install Ansible collections
ansible-galaxy collection install -r requirements.yml
```

### 2. Configure Inventory

Edit `inventory/hosts.yml` with your VPS details.

### 3. Initial Setup (Run Once)

```bash
ansible-playbook setup.yml
```

### 4. Deploy Application

```bash
ansible-playbook deploy.yml
```

## Directory Structure

```
ansible/
├── ansible.cfg              # Ansible configuration
├── requirements.yml         # Ansible Galaxy requirements
├── setup.yml               # Initial VPS setup playbook
├── deploy.yml              # Application deployment playbook
├── inventory/
│   └── hosts.yml           # Inventory file with VPS details
├── group_vars/
│   └── all.yml            # Global variables
└── templates/
    ├── nginx-site.conf.j2 # Nginx configuration template
    └── env.production.j2  # Environment variables template
```

## Playbooks

### setup.yml
**Purpose:** Initial VPS configuration (run once)

**What it does:**
- Installs Docker and Docker Compose
- Installs and configures Nginx
- Sets up UFW firewall
- Configures SSL with Let's Encrypt (optional)
- Creates application directory

**Usage:**
```bash
ansible-playbook setup.yml
```

**Tags:**
- `system` - System package updates
- `docker` - Docker installation
- `nginx` - Nginx configuration
- `ssl` - SSL setup
- `security` - Firewall configuration

### deploy.yml
**Purpose:** Deploy or update the application

**What it does:**
- Copies application files to VPS
- Generates environment configuration
- Builds and starts Docker containers
- Runs database migrations
- Performs health checks

**Usage:**
```bash
ansible-playbook deploy.yml
```

**Tags:**
- `deploy` - Main deployment tasks
- `env` - Environment configuration
- `docker` - Docker operations
- `healthcheck` - Health check
- `cleanup` - Cleanup old images

## Environment Variables

All sensitive configuration is passed via environment variables. These should be set before running playbooks:

```bash
export VPS_HOST="your-vps-ip"
export VPS_USERNAME="your-username"
export DOMAIN_NAME="your-domain.com"
export BETTER_AUTH_URL="https://your-domain.com"
export POSTGRES_PASSWORD="your-secure-password"
# ... etc
```

Or use a `.env` file with `source .env`.

## Running Specific Tasks

### Run only specific tags

```bash
# Only update system packages
ansible-playbook setup.yml --tags system

# Only restart Docker containers
ansible-playbook deploy.yml --tags docker

# Only update Nginx configuration
ansible-playbook setup.yml --tags nginx
```

### Skip specific tags

```bash
# Skip SSL setup
ansible-playbook setup.yml --skip-tags ssl
```

### Dry run

```bash
# Check what would change without making changes
ansible-playbook deploy.yml --check
```

## Testing

### Test connection to VPS

```bash
ansible production -m ping
```

### Gather facts about VPS

```bash
ansible production -m setup
```

### Run ad-hoc commands

```bash
# Check disk space
ansible production -a "df -h"

# Check Docker status
ansible production -a "docker ps"

# View application logs
ansible production -a "docker compose -f /opt/streamline-scheduler-webpage/docker-compose.yml logs --tail=50"
```

## Troubleshooting

### Enable verbose output

```bash
# Level 1 (basic)
ansible-playbook deploy.yml -v

# Level 2 (detailed)
ansible-playbook deploy.yml -vv

# Level 3 (very detailed, includes connection info)
ansible-playbook deploy.yml -vvv
```

### Common Issues

1. **SSH Connection Failed**
   - Check `VPS_HOST`, `VPS_USERNAME`, `VPS_PORT`
   - Verify SSH key is correct
   - Test manual SSH: `ssh user@host`

2. **Permission Denied**
   - Ensure user has sudo privileges
   - Check file permissions on VPS

3. **Docker Build Failed**
   - Check disk space on VPS
   - View detailed logs with `-vv`
   - SSH into VPS and check Docker logs

## Best Practices

1. **Test in staging first**: Run playbooks on a staging server before production
2. **Use version control**: Track all changes to playbooks
3. **Keep secrets secure**: Never commit sensitive data
4. **Regular backups**: Backup database before deployments
5. **Monitor deployments**: Watch for errors and warnings

## Additional Resources

- [Complete Deployment Guide](../DEPLOYMENT.md)
- [Ansible Documentation](https://docs.ansible.com/)
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/user_guide/playbooks_best_practices.html)

