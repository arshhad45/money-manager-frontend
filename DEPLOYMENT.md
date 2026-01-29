# Frontend Deployment Guide

## Environment Configuration

The frontend uses environment variables to configure the API backend URL.

### For Local Development

Create a `.env` file in the `frontend` folder:

```env
# Leave empty to use Vite proxy, or set to localhost
VITE_API_URL=http://localhost:4000
```

Or simply don't create a `.env` file - the Vite proxy will handle API requests in development.

### For Production Deployment

Create a `.env.production` file in the `frontend` folder:

```env
VITE_API_URL=https://money-manager-backend-1-51q8.onrender.com
```

**Important:** When deploying to platforms like Vercel, Netlify, or Render, you need to set the environment variable in the platform's dashboard:

- **Variable name:** `VITE_API_URL`
- **Variable value:** `https://money-manager-backend-1-51q8.onrender.com`

## Deployment Steps

### Option 1: Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend folder: `cd frontend`
3. Run: `vercel`
4. Set environment variable `VITE_API_URL` in Vercel dashboard
5. Redeploy

### Option 2: Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variable `VITE_API_URL` in Netlify dashboard
4. Redeploy

### Option 3: Render

1. Connect your repository to Render
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable `VITE_API_URL=https://money-manager-backend-1-51q8.onrender.com`
5. Deploy

### Option 4: GitHub Pages / Static Hosting

1. Build: `npm run build`
2. Upload the `dist` folder contents to your hosting provider
3. Make sure to set `VITE_API_URL` as an environment variable during build, or create a `.env.production` file before building

## Building for Production

```bash
cd frontend
npm run build
```

The built files will be in the `dist` folder.

## Testing Production Build Locally

```bash
npm run build
npm run preview
```

This will serve the production build locally so you can test it before deploying.
