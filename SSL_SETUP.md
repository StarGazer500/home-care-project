# SSL Setup with Nginx Proxy Manager

## Architecture Overview

```
Internet → Nginx Proxy Manager (ports 80/443) → Internal Nginx (port 80) → Backend (port 8000)
                     ↓
              Handles SSL/TLS
              Let's Encrypt certs
```

## Setup Steps

### Step 1: Update Docker Compose (Already Done)
The docker-compose.prod.yml has been updated with:
- Nginx Proxy Manager on ports 80, 443 (public), and 81 (admin UI)
- Internal nginx now only exposes port 80 to the internal network
- All services connected via `app-network`

### Step 2: Stop Current Containers
```bash
cd /path/to/home_care_project
docker-compose -f docker-compose.prod.yml down
```

### Step 3: Start All Services Including NPM
```bash
docker-compose -f docker-compose.prod.yml up -d
```

This will start:
- Backend container
- Nginx container (internal)
- Nginx Proxy Manager container

### Step 4: Access Nginx Proxy Manager Admin Interface
Open your browser and go to:
```
http://37.60.240.194:81
```
or
```
http://bridgehoito.fi:81
```

**Default Login Credentials:**
- Email: `admin@example.com`
- Password: `changeme`

**IMPORTANT:** You'll be prompted to change these immediately after first login.

### Step 5: Configure Proxy Host in NPM

1. Click **"Hosts"** → **"Proxy Hosts"** → **"Add Proxy Host"**

2. In the **Details** tab:
   - **Domain Names:**
     - `bridgehoito.fi`
     - `www.bridgehoito.fi`
   - **Scheme:** `http`
   - **Forward Hostname / IP:** `nginx` (the Docker service name)
   - **Forward Port:** `80`
   - ✅ **Cache Assets**
   - ✅ **Block Common Exploits**
   - ✅ **Websockets Support**

3. Click **Save** (don't configure SSL yet)

4. Test that HTTP works: Visit `http://bridgehoito.fi`

### Step 6: Add SSL Certificate

1. Go back to your proxy host and click **Edit** (three dots menu)

2. Go to the **SSL** tab:
   - **SSL Certificate:** Select "Request a new SSL Certificate"
   - ✅ **Force SSL** (redirects HTTP to HTTPS)
   - ✅ **HTTP/2 Support**
   - ✅ **HSTS Enabled** (recommended)
   - Enter your email address for Let's Encrypt notifications
   - ✅ **I Agree to the Let's Encrypt Terms of Service**

3. Click **Save**

NPM will automatically:
- Request SSL certificate from Let's Encrypt
- Configure HTTPS
- Set up automatic renewal (every 60 days)

### Step 7: Update Frontend Configuration

Once SSL is working, update the frontend to use HTTPS:

```bash
# Edit frontend/.env.production
VITE_API_BASE_URL=https://bridgehoito.fi/api/v1
```

Then rebuild and deploy:
```bash
cd frontend
npm run build

# Upload new assets to Contabo Object Storage
# Copy dist/index.html to production

# Restart containers
docker-compose -f docker-compose.prod.yml restart nginx
```

### Step 8: Test Everything

1. Visit `http://bridgehoito.fi` - Should redirect to HTTPS
2. Visit `https://bridgehoito.fi` - Should show your app with padlock icon
3. Test login functionality
4. Check browser console for any mixed content warnings

## Troubleshooting

### Cannot Access Admin Panel (Port 81)
Make sure your firewall allows port 81:
```bash
sudo ufw allow 81/tcp
```

### SSL Certificate Failed
- Ensure ports 80 and 443 are accessible from the internet
- Check that DNS is properly configured
- Verify email address is valid
- Check NPM logs: `docker logs nginx-proxy-manager`

### Mixed Content Warnings
After enabling HTTPS, if you see mixed content warnings:
- Ensure `.env.production` uses `https://`
- Rebuild frontend
- Upload new assets
- Clear browser cache

### Connection Issues After SSL
- Check backend CORS in `backend/src/core/config.py` includes `https://bridgehoito.fi`
- Verify NPM is forwarding to correct internal service
- Check NPM logs and nginx logs

## Security Notes

1. **Change NPM Default Password** immediately after first login
2. **Firewall Port 81** after initial setup (or restrict to your IP):
   ```bash
   sudo ufw deny 81/tcp
   # Or allow only from your IP
   sudo ufw allow from YOUR_IP to any port 81
   ```
3. **Enable HSTS** in NPM SSL settings
4. **Keep NPM Updated** - Check for updates regularly

## Checking SSL Certificate Status

Visit: https://www.ssllabs.com/ssltest/analyze.html?d=bridgehoito.fi

This will give you a security grade (aim for A or A+).

## Certificate Renewal

Nginx Proxy Manager automatically renews Let's Encrypt certificates. No manual action needed!

Certificates are renewed 30 days before expiry.

## Backup

Important volumes to backup:
- `npm_data` - Contains NPM configuration and database
- `npm_letsencrypt` - Contains SSL certificates

```bash
# Backup volumes
docker run --rm -v npm_data:/data -v $(pwd):/backup alpine tar czf /backup/npm_data_backup.tar.gz -C / data
docker run --rm -v npm_letsencrypt:/data -v $(pwd):/backup alpine tar czf /backup/npm_certs_backup.tar.gz -C / data
```

## Current Configuration Status

- ✅ Docker Compose configured with NPM
- ✅ Backend CORS already allows HTTPS
- ✅ Internal networking set up
- ⏳ **Next Steps:**
  1. Deploy updated docker-compose.yml
  2. Access NPM admin interface
  3. Configure proxy host
  4. Request SSL certificate
  5. Update frontend to use HTTPS
