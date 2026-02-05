# HRMS Lite - Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
2. **Vercel Account** (Free tier available)
3. **Git Repository** (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and log in
3. Create a new cluster (select FREE tier - M0)
4. Wait for cluster to be created (2-3 minutes)
5. Click "Connect" on your cluster
6. Create a database user:
   - Username: `hrms_user` (or your choice)
   - Password: Generate a secure password
   - **Save these credentials securely!**
7. Add your IP address to whitelist:
   - Click "Add Your Current IP Address"
   - For production, add `0.0.0.0/0` to allow all IPs (Vercel requirement)
8. Choose connection method: "Connect your application"
9. Copy the connection string (it looks like):
   ```
   mongodb+srv://hrms_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
10. Replace `<password>` with your actual password
11. Add database name to the connection string:
   ```
   mongodb+srv://hrms_user:yourpassword@cluster0.xxxxx.mongodb.net/hrms_lite?retryWrites=true&w=majority
   ```

## Step 2: Deploy Backend to Vercel

### Option A: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to backend folder:
   ```bash
   cd backend
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Add environment variable:
   ```bash
   vercel env add MONGODB_URL
   ```
   - Paste your MongoDB Atlas connection string when prompted
   - Select "Production" environment

6. Redeploy with environment variable:
   ```bash
   vercel --prod
   ```

### Option B: Using Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your Git repository
5. Set Root Directory to `backend`
6. Add Environment Variable:
   - Key: `MONGODB_URL`
   - Value: Your MongoDB Atlas connection string
7. Click "Deploy"
8. Copy the deployment URL (e.g., `https://your-app.vercel.app`)

## Step 3: Deploy Frontend to Vercel

1. Update frontend API URL in `frontend/src/services/api.js`:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
   ```

2. Create `.env.production` in frontend folder:
   ```
   REACT_APP_API_URL=https://your-backend.vercel.app
   ```

3. Deploy frontend:
   - Using Vercel Dashboard: Import frontend folder separately
   - Using Vercel CLI: Navigate to frontend and run `vercel --prod`

4. Add environment variable in Vercel:
   - Key: `REACT_APP_API_URL`
   - Value: Your backend Vercel URL

## Step 4: Configure CORS

The backend is already configured to accept requests from any origin. For production, you should update CORS settings in `backend/app/main.py` to only allow your frontend URL.

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Test all features:
   - Add employees
   - Mark attendance
   - View dashboard
   - Search functionality

## Troubleshooting

### MongoDB Connection Issues
- Verify your connection string is correct
- Check that IP `0.0.0.0/0` is whitelisted in MongoDB Atlas
- Ensure database user credentials are correct

### Backend Not Starting
- Check Vercel deployment logs
- Verify all environment variables are set
- Ensure `requirements.txt` is complete

### Frontend Can't Connect to Backend
- Verify `REACT_APP_API_URL` is set correctly
- Check backend CORS settings
- Ensure backend is deployed and running

## Environment Variables Summary

### Backend (Vercel)
- `MONGODB_URL`: Your MongoDB Atlas connection string

### Frontend (Vercel)
- `REACT_APP_API_URL`: Your backend Vercel URL

## Security Notes

1. **Never commit `.env` files to Git**
2. Use environment variables for all sensitive data
3. Restrict MongoDB Atlas IP whitelist in production
4. Update CORS settings to only allow your frontend domain
5. Use strong passwords for MongoDB users

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review MongoDB Atlas metrics
3. Test endpoints using Postman or curl
4. Verify all environment variables are set correctly
