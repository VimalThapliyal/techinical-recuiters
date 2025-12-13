# Deployment Guide - Vercel

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Recruiter Directory"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Configure Environment Variables** (if needed)
   - Go to Project Settings → Environment Variables
   - Add any required variables

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Custom Domain Setup (Free on Vercel)

### Step 1: Get a Domain Name

**Free Domain Options:**
- [Freenom](https://www.freenom.com) - Free .tk, .ml, .ga domains
- [Namecheap](https://www.namecheap.com) - Affordable domains ($1-10/year)
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) - At-cost pricing

**Suggested Domain Names:**
- `techrecruiters.com`
- `recruiterhub.io`
- `findtechrecruiters.com`
- `techrecruiterdirectory.com`
- `recruitersearch.io`

### Step 2: Add Domain to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain name (e.g., `techrecruiters.com`)
5. Follow the DNS configuration instructions

### Step 3: Configure DNS Records

**For Root Domain (techrecruiters.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain (www.techrecruiters.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Country Subdomains (us.techrecruiters.com, uk.techrecruiters.com, etc.):**
```
Type: CNAME
Name: us
Value: cname.vercel-dns.com

Type: CNAME
Name: uk
Value: cname.vercel-dns.com

Type: CNAME
Name: ca
Value: cname.vercel-dns.com

Type: CNAME
Name: au
Value: cname.vercel-dns.com

Type: CNAME
Name: in
Value: cname.vercel-dns.com
```

### Step 4: SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt. Your site will be HTTPS-enabled automatically once DNS propagates (usually 5-60 minutes).

## Vercel Configuration

The project includes `vercel.json` with:
- Security headers
- Subdomain routing support
- Optimized build settings

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test subdomain routing (us.yourdomain.com, uk.yourdomain.com, etc.)
- [ ] Check mobile responsiveness
- [ ] Verify all links work
- [ ] Test search and filtering
- [ ] Check analytics (optional: add Vercel Analytics)
- [ ] Set up custom 404 page (optional)
- [ ] Configure redirects if needed

## Environment Variables

Currently, the app doesn't require environment variables. If you add features later that need them:

1. Go to Project Settings → Environment Variables
2. Add variables for:
   - Production
   - Preview
   - Development

## Performance Optimization

Vercel automatically:
- ✅ Optimizes images
- ✅ Enables edge caching
- ✅ Provides CDN distribution
- ✅ Auto-scales based on traffic

## Monitoring

- **Vercel Analytics** (Free tier available)
- **Vercel Speed Insights** (Free)
- **Error Tracking** (Built-in)

## Troubleshooting

### Subdomain Routing Not Working
- Ensure DNS records are properly configured
- Check `vercel.json` middleware configuration
- Verify subdomain wildcard is set up

### Build Errors
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Domain Not Resolving
- Wait for DNS propagation (up to 48 hours, usually faster)
- Check DNS records with `dig` or online DNS checker
- Verify domain is properly added in Vercel

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

