#!/bin/bash
# =============================================================
# Ruddhaa Architects - VPS Deployment Script
# Run this on a fresh Ubuntu 22.04 VPS as root
# Usage: ssh root@YOUR_VPS_IP 'bash -s' < deploy-vps.sh
# =============================================================

set -e

# ─── CONFIGURATION (EDIT THESE) ──────────────────────────────
DOMAIN="yourdomain.com"
REPO_URL="https://github.com/devasanipranadeep/ruddha_architect.git"
ADMIN_EMAIL="ruddha.arch@gmail.com"
ADMIN_PASSWORD="20B@r1124"
JWT_SECRET="ruddha-secret-key-2024"
SUPABASE_URL="https://veeonffibrkunboagkdu.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZW9uZmZpYnJrdW5ib2Fna2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDA3MDYsImV4cCI6MjA5NTAxNjcwNn0.yJrH31gXOyn6mrIrWOl2h7SjqPDhdEGibm4I-luQT9I"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="ruddha.arch@gmail.com"
SMTP_PASSWORD="your-gmail-app-password"  # Generate at https://myaccount.google.com/apppasswords
# ──────────────────────────────────────────────────────────────

echo "========================================="
echo "  Ruddhaa Architects - VPS Setup"
echo "========================================="

# ─── STEP 1: System Update ───────────────────────────────────
echo "[1/8] Updating system..."
apt update && apt upgrade -y

# ─── STEP 2: Install Node.js 20 ──────────────────────────────
echo "[2/8] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# ─── STEP 3: Install Python 3.11 ─────────────────────────────
echo "[3/8] Installing Python..."
apt install -y python3 python3-pip python3-venv

# ─── STEP 4: Install Nginx, PM2, Certbot ─────────────────────
echo "[4/8] Installing Nginx, PM2, Certbot..."
apt install -y nginx
npm install -g pm2
apt install -y certbot python3-certbot-nginx

# ─── STEP 5: Clone & Deploy Backend ──────────────────────────
echo "[5/8] Deploying backend..."
mkdir -p /var/www
cd /var/www
git clone $REPO_URL ruddha
cd /var/www/ruddha/backend

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn uvicorn

# Create backend .env
cat > .env << EOF
SUPABASE_URL=$SUPABASE_URL
SUPABASE_KEY=$SUPABASE_KEY
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASSWORD
JWT_SECRET_KEY=$JWT_SECRET
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
SMTP_HOST=$SMTP_HOST
SMTP_PORT=$SMTP_PORT
SMTP_USER=$SMTP_USER
SMTP_PASSWORD=$SMTP_PASSWORD
EMAIL_FROM=$SMTP_USER
BACKEND_URL=https://$DOMAIN
FRONTEND_URL=https://$DOMAIN
ENVIRONMENT=production
EOF

# Create uploads directory
mkdir -p uploads

# Start backend with PM2
pm2 start "cd /var/www/ruddha/backend && source venv/bin/activate && gunicorn app.main:app -w 2 -k uvicorn.workers.UvicornWorker -b 127.0.0.1:8001" --name backend

# ─── STEP 6: Deploy Frontend ─────────────────────────────────
echo "[6/8] Deploying frontend..."
cd /var/www/ruddha/frontend

# Create frontend .env
cat > .env << EOF
VITE_API_URL=https://$DOMAIN/api
EOF

npm install
npm run build

# Start frontend with PM2 (TanStack Start serves on port 3000)
pm2 start "cd /var/www/ruddha/frontend && node dist/server/index.js" --name frontend
pm2 save
pm2 startup

# ─── STEP 7: Configure Nginx ─────────────────────────────────
echo "[7/8] Configuring Nginx..."
cat > /etc/nginx/sites-available/ruddha << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Frontend
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        client_max_body_size 10M;
    }

    # Uploaded files (served directly by Nginx)
    location /uploads/ {
        alias /var/www/ruddha/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -sf /etc/nginx/sites-available/ruddha /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# ─── STEP 8: SSL Certificate ─────────────────────────────────
echo "[8/8] Setting up SSL..."
echo ""
echo "========================================="
echo "  SETUP COMPLETE!"
echo "========================================="
echo ""
echo "Before running SSL, point your domain DNS:"
echo "  A Record: $DOMAIN -> YOUR_VPS_IP"
echo "  A Record: www.$DOMAIN -> YOUR_VPS_IP"
echo ""
echo "Then run:"
echo "  certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo ""
echo "Your site will be live at: https://$DOMAIN"
echo ""
echo "─── Useful Commands ───"
echo "  pm2 status          # Check running services"
echo "  pm2 logs backend    # View backend logs"
echo "  pm2 logs frontend   # View frontend logs"
echo "  pm2 restart all     # Restart everything"
echo "========================================="
