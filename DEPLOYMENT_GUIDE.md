# Portfolio Deployment Guide

This guide provides detailed instructions for deploying your Next.js portfolio application to production. Follow these steps to ensure a smooth deployment process.

## Table of Contents

1. [Preparing Your Application](#1-preparing-your-application)
2. [Database Setup](#2-database-setup)
3. [Deployment Options](#3-deployment-options)
   - [Vercel (Recommended)](#option-1-vercel-recommended)
   - [Netlify](#option-2-netlify)
   - [Self-Hosting](#option-3-self-hosting)
4. [Continuous Integration/Deployment](#4-continuous-integrationdeployment)
5. [Post-Deployment Steps](#5-post-deployment-steps)
6. [Domain and DNS Configuration](#6-domain-and-dns-configuration)
7. [Troubleshooting](#7-troubleshooting)

## 1. Preparing Your Application

### 1.1 Update Environment Variables

Create a `.env.production` file with production-specific values:

```bash
# Production environment variables
DATABASE_URL="your_production_database_url"
JWT_SECRET="generate_a_strong_random_string"
JWT_EXPIRES_IN="7d"
ADMIN_EMAIL="your_admin_email@example.com"
# Generate a new password hash for production
ADMIN_PASSWORD_HASH="new_secure_password_hash"
```

To generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

To generate a new password hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('your_secure_password', 10))"
```

### 1.2 Test Your Build Locally

Build and test your application locally before deployment:

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

Verify that everything works correctly in the production build.

## 2. Database Setup

### 2.1 Choose a Database Provider

Select a PostgreSQL provider for your production database:

- **Supabase**: [supabase.com](https://supabase.com/) - Generous free tier
- **Neon**: [neon.tech](https://neon.tech/) - Serverless PostgreSQL
- **Railway**: [railway.app](https://railway.app/) - Simple deployment
- **Render**: [render.com](https://render.com/docs/databases) - PostgreSQL hosting
- **AWS RDS**: [aws.amazon.com/rds/postgresql](https://aws.amazon.com/rds/postgresql/) - Enterprise solution
- **DigitalOcean**: [digitalocean.com/products/managed-databases](https://www.digitalocean.com/products/managed-databases)

### 2.2 Set Up Your Production Database

1. Create an account with your chosen provider
2. Create a new PostgreSQL database
3. Note the connection string (will look like `postgresql://username:password@host:port/database`)
4. Update your production environment variables with this connection string

### 2.3 Run Database Migrations

Deploy your database schema to production:

```bash
# Set the DATABASE_URL to your production database
export DATABASE_URL="your_production_database_url"

# Run migrations
npx prisma migrate deploy
```

### 2.4 Seed Initial Data

Seed your admin user in the production database:

```bash
# Run the seed script
npm run seed
```

## 3. Deployment Options

### Option 1: Vercel (Recommended)

Vercel is optimized for Next.js applications and offers the simplest deployment experience.

#### 3.1.1 Deploy to Vercel

1. Create an account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI (optional):
   ```bash
   npm i -g vercel
   ```
3. Connect your GitHub repository to Vercel:
   - Go to the Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings

4. Set up environment variables in the Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`

5. Deploy your application:
   - Vercel will automatically build and deploy your application
   - You can also deploy from the CLI:
     ```bash
     vercel
     ```

### Option 2: Netlify

Netlify is another excellent option for hosting Next.js applications.

#### 3.2.1 Deploy to Netlify

1. Create an account at [netlify.com](https://netlify.com)
2. Connect your GitHub repository:
   - Go to the Netlify dashboard
   - Click "New site from Git"
   - Select your repository

3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

4. Set up environment variables in the Netlify dashboard

5. Deploy your application:
   - Netlify will automatically build and deploy your application

### Option 3: Self-Hosting

For more control, you can self-host on a VPS or cloud provider.

#### 3.3.1 DigitalOcean Droplet

1. Create a DigitalOcean account
2. Create a new Droplet (Ubuntu recommended)
3. SSH into your Droplet
4. Install Node.js and PostgreSQL:
   ```bash
   # Update package lists
   sudo apt update

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PostgreSQL
   sudo apt install -y postgresql postgresql-contrib
   ```

5. Clone your repository:
   ```bash
   git clone https://github.com/yourusername/your-portfolio.git
   cd your-portfolio
   ```

6. Set up environment variables:
   ```bash
   nano .env.production
   ```

7. Install dependencies, build and start your application:
   ```bash
   npm install
   npm run build
   npm run start
   ```

8. Set up Nginx as a reverse proxy:
   ```bash
   sudo apt install -y nginx
   sudo nano /etc/nginx/sites-available/portfolio
   ```

   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. Enable the site and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. Set up SSL with Let's Encrypt:
    ```bash
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
    ```

11. Set up PM2 to keep your application running:
    ```bash
    sudo npm install -g pm2
    pm2 start npm --name "portfolio" -- start
    pm2 startup
    pm2 save
    ```

## 4. Continuous Integration/Deployment

### 4.1 GitHub Actions

Create a `.github/workflows/deploy.yml` file for automated deployments:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 4.2 Vercel/Netlify CI/CD

Both Vercel and Netlify automatically set up CI/CD when connected to your repository. They will:

- Build and deploy on every push to the main branch
- Create preview deployments for pull requests
- Allow you to roll back to previous deployments

## 5. Post-Deployment Steps

### 5.1 Set Up Monitoring

1. **Error Tracking with Sentry**:
   - Create an account at [sentry.io](https://sentry.io)
   - Follow their Next.js integration guide

2. **Uptime Monitoring**:
   - Set up [Uptime Robot](https://uptimerobot.com/) to monitor your site
   - Create a free account and add your production URL

### 5.2 Configure Analytics

1. **Google Analytics**:
   - Create an account at [analytics.google.com](https://analytics.google.com)
   - Add the tracking code to your application

2. **Privacy-Focused Alternative**:
   - Consider [Plausible](https://plausible.io/) for privacy-friendly analytics

### 5.3 Backup Strategy

1. **Database Backups**:
   - Set up regular database backups
   - Most managed database providers offer automated backups

2. **Code Backups**:
   - Your code is already backed up in GitHub
   - Consider additional backup solutions for critical data

## 6. Domain and DNS Configuration

### 6.1 Purchase a Domain

Purchase a domain from a registrar:
- [Namecheap](https://www.namecheap.com/)
- [Google Domains](https://domains.google/)
- [GoDaddy](https://www.godaddy.com/)

### 6.2 Configure DNS

1. **Vercel**:
   - Add your domain in the Vercel dashboard
   - Follow Vercel's instructions to update your DNS settings

2. **Netlify**:
   - Add your domain in the Netlify dashboard
   - Follow Netlify's instructions to update your DNS settings

3. **Self-Hosted**:
   - Create A records pointing to your server's IP address
   - Set up www subdomain if desired

## 7. Troubleshooting

### 7.1 Database Connection Issues

If you encounter database connection issues:

1. Verify your `DATABASE_URL` is correct
2. Check if your database server allows connections from your application server
3. Ensure your database user has the correct permissions

### 7.2 Build Errors

If your build fails:

1. Check the build logs for specific errors
2. Verify all dependencies are installed
3. Make sure your environment variables are correctly set

### 7.3 Runtime Errors

If your application crashes in production:

1. Check the server logs
2. Verify all API endpoints are working correctly
3. Test authentication flows

---

For additional help or questions, refer to the documentation for your chosen hosting platform or database provider.
