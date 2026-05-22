# Deployment Guide

This guide will help you deploy the Ruddha Architects & Interiors website with separate frontend and backend deployments.

## Prerequisites

- GitHub account with the repository pushed
- Vercel account (for frontend)
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
   - **Root Directory**: `server`
   - **Dockerfile Path**: `Dockerfile`

### 1.3 Set Environment Variables
Add these environment variables in Render dashboard:

```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
ADMIN_EMAIL=ruddha.arch@gmail.com
ADMIN_PASSWORD=your-secure-password
JWT_SECRET_KEY=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=ruddha.arch@gmail.com
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### 1.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Copy the deployed URL (e.g., `https://ruddha-architects-api.onrender.com`)

---

## Step 2: Deploy Frontend (React) on Vercel

### 2.1 Create a Vercel Account
1. Go to [https://vercel.com](https://vercel.com) and sign up
2. Connect your GitHub account

### 2.2 Import Project
1. Click "Add New" → "Project"
2. Select your `ruddha_architect` repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Set Environment Variables
Add this environment variable in Vercel dashboard:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```
(Replace with your actual backend URL from Step 1.4)

### 2.4 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Copy the deployed URL (e.g., `https://ruddha-architects.vercel.app`)

---

## Step 3: Update Backend CORS

After deploying the frontend, update the backend CORS:

1. Go to your Render dashboard
2. Open the backend service
3. Go to "Environment" section
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```
5. Click "Save Changes" to redeploy

---

## Step 4: Verify Deployment

1. Visit your frontend URL (Vercel)
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
- Check Vercel deployment logs
- Verify `VITE_API_URL` is correct
- Ensure backend is running and accessible

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your Vercel URL
- Check that backend allows your frontend origin

### Image Upload Issues
- Ensure uploads directory has write permissions
- Check file size limits on Render

---

## Alternative Deployment Options

### Netlify (Frontend Alternative)
Similar to Vercel:
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_URL`

### Railway (Backend Alternative)
1. Connect your repository to Railway
2. Railway will auto-detect the Docker setup
3. Set environment variables in Railway dashboard
4. Deploy

---

## Production Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured for both
- [ ] CORS configured correctly
- [ ] Admin panel accessible
- [ ] Contact form working
- [ ] Image uploads working
- [ ] Portfolio displaying correctly
- [ ] Stats updating correctly

---

## Post-Deployment

1. **Monitor Logs**: Regularly check Render and Vercel logs
2. **Update CORS**: If you change frontend URL, update backend CORS
3. **Backup Database**: Regularly backup your Supabase database
4. **Update Dependencies**: Keep dependencies updated for security
