# Deployment Guide

This guide will help you deploy the Ruddhaa Architects & Interiors website. The frontend uses TanStack Start with SSR, which is designed for Cloudflare Pages.

## Prerequisites

- GitHub account with the repository pushed
- Cloudflare account (for frontend) - [https://pages.cloudflare.com](https://pages.cloudflare.com)
- Render account (for backend) - [https://render.com](https://render.com)
- Supabase account (database) - already configured

---

## Step 1: Deploy Backend (FastAPI) on Render

### 1.1 Create a Render Account
1. Go to [https://render.com](https://render.com) and sign up
2. Connect your GitHub account

### 1.2 Create New Web Service
1. Click "New+" → "Web Service"
2. Select your `ruddha_architect` repository
3. Configure the service:
   - **Name**: `ruddha-architects-api`
   - **Environment**: `Docker`
   - **Root Directory**: `backend`
   - **Dockerfile Path**: `Dockerfile`

### 1.3 Set Environment Variables
Add these environment variables in Render dashboard:

```
SUPABASE_URL=https://veeonffibrkunboagkdu.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlZW9uZmZpYnJrdW5ib2Fna2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDA3MDYsImV4cCI6MjA5NTAxNjcwNn0.yJrH31gXOyn6mrIrWOl2h7SjqPDhdEGibm4I-luQT9I
ADMIN_EMAIL=ruddha.arch@gmail.com
ADMIN_PASSWORD=20B@r1124
JWT_SECRET_KEY=ruddha-secret-key-2024
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ruddha.arch@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=ruddha.arch@gmail.com
FRONTEND_URL=https://your-frontend-url.pages.dev
```

### 1.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Copy the deployed URL (e.g., `https://ruddha-architect-api.onrender.com`)

---

## Step 2: Deploy Frontend (TanStack Start) on Cloudflare Pages

### 2.1 Create a Cloudflare Account
1. Go to [https://pages.cloudflare.com](https://pages.cloudflare.com) and sign up
2. Connect your GitHub account

### 2.2 Import Project
1. Click "Create a project" → "Connect to Git"
2. Select your `ruddha_architect` repository
3. Configure the build settings:
   - **Project name**: `ruddha-architects`
   - **Production branch**: `main`
   - **Framework preset**: `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `frontend/dist`
   - **Root directory**: `frontend`

### 2.3 Set Environment Variables
Add this environment variable in Cloudflare Pages dashboard:

```
VITE_API_URL=https://ruddha-architect-api.onrender.com/api
```

### 2.4 Deploy
1. Click "Save and Deploy"
2. Wait for deployment to complete
3. Copy the deployed URL (e.g., `https://ruddha-architects.pages.dev`)

---

## Step 3: Update Backend CORS

After deploying the frontend, update the backend CORS:

1. Go to your Render dashboard
2. Open the backend service
3. Go to "Environment" section
4. Update `FRONTEND_URL` to your Cloudflare Pages URL:
   ```
   FRONTEND_URL=https://your-frontend-url.pages.dev
   ```
5. Click "Save Changes" to redeploy

---

## Step 4: Verify Deployment

1. Visit your frontend URL (Cloudflare Pages)
2. Check if the site loads correctly
3. Try accessing the admin panel at `/admin`
4. Test the contact form
5. Check the portfolio page

---

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Ensure all environment variables are set
- Verify Supabase connection

### Frontend Issues
- Check Cloudflare Pages deployment logs
- Verify `VITE_API_URL` is correct
- Ensure backend is running and accessible

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your Cloudflare Pages URL
- Check that backend allows your frontend origin

### Image Upload Issues
- Ensure uploads directory has write permissions
- Check file size limits on Render

---

## Alternative Deployment Options

### Vercel (Not Recommended)
Vercel does not support TanStack Start out of the box without additional SSR configuration. Cloudflare Pages is recommended.

### Railway (Backend Alternative)
1. Connect your repository to Railway
2. Railway will auto-detect the Docker setup
3. Set environment variables in Railway dashboard
4. Deploy

---

## Production Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Cloudflare Pages
- [ ] Environment variables configured for both
- [ ] CORS configured correctly
- [ ] Admin panel accessible
- [ ] Contact form working
- [ ] Image uploads working
- [ ] Portfolio displaying correctly
- [ ] Stats updating correctly

---

## Post-Deployment

1. **Monitor Logs**: Regularly check Render and Cloudflare Pages logs
2. **Update CORS**: If you change frontend URL, update backend CORS
3. **Backup Database**: Regularly backup your Supabase database
4. **Update Dependencies**: Keep dependencies updated for security
