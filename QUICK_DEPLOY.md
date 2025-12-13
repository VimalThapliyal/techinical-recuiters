# 🚀 Quick Deploy to Vercel - Step by Step

## Prerequisites
- ✅ Git repository initialized (already done)
- ✅ Vercel account (free) - [Sign up here](https://vercel.com/signup)

## Step 1: Push to GitHub (if not already done)

```bash
# Check current status
git status

# Add all files
git add .

# Commit changes
git commit -m "Ready for deployment - Recruiter Directory"

# If you haven't set up remote yet:
# git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
# git branch -M main
# git push -u origin main

# Or if remote exists:
git push
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest) ⭐

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. Click **"Add New Project"**
3. **Import your GitHub repository**
   - If not connected, connect your GitHub account
   - Select your repository: `techinical-recuiters`
4. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)
5. Click **"Deploy"**
6. Wait 2-3 minutes for deployment to complete
7. 🎉 Your app is live at `your-project.vercel.app`

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time - will ask questions)
vercel

# Deploy to production
vercel --prod
```

## Step 3: Add Custom Domain (Free!)

### Get a Domain Name

**Recommended Domain Registrars:**
- **Namecheap** - $1-10/year for .com domains
- **Cloudflare Registrar** - At-cost pricing (cheapest)
- **Google Domains** - Simple interface
- **Freenom** - Free .tk, .ml domains (less professional)

**Domain Name Suggestions:**
- `techrecruiters.com`
- `recruiterhub.io`
- `findtechrecruiters.com`
- `techrecruiterdirectory.com`
- `recruitersearch.io`
- `techrecruiters.net`

### Add Domain in Vercel

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain (e.g., `techrecruiters.com`)
5. Click **Add**

### Configure DNS Records

**For your domain registrar, add these DNS records:**

#### Root Domain (techrecruiters.com):
```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto (or 3600)
```

#### WWW Subdomain (www.techrecruiters.com):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto (or 3600)
```

#### Country Subdomains (us.techrecruiters.com, uk.techrecruiters.com, etc.):
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

**Or use Wildcard (easier):**
```
Type: CNAME
Name: *
Value: cname.vercel-dns.com
```
This covers all subdomains automatically!

### Wait for DNS Propagation

- DNS changes take **5-60 minutes** (usually faster)
- Vercel will automatically provision SSL certificate
- Your site will be HTTPS-enabled automatically

## Step 4: Verify Deployment

✅ Test these URLs:
- `https://yourdomain.com` - Landing page
- `https://us.yourdomain.com` - US recruiters
- `https://uk.yourdomain.com` - UK recruiters
- `https://in.yourdomain.com` - India recruiters
- `https://yourdomain.com/profile` - Profile page

## Step 5: Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Subdomain routing works (us, uk, ca, au, in)
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Mobile responsive design works
- [ ] LinkedIn links open correctly
- [ ] Share/Copy link works
- [ ] Profile creation works
- [ ] Statistics dashboard displays

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (should be 18+)

### Subdomains Not Working
- Verify DNS CNAME records are set correctly
- Wait for DNS propagation
- Check Vercel domain configuration

### Domain Not Resolving
- Use [DNS Checker](https://dnschecker.org) to verify DNS propagation
- Wait up to 48 hours (usually much faster)
- Double-check DNS records match Vercel's requirements

## Vercel Free Tier Limits

✅ **What's Free:**
- Unlimited deployments
- 100GB bandwidth/month
- Automatic SSL certificates
- Custom domains
- Edge network (CDN)
- Preview deployments for every PR

## Next Steps After Deployment

1. **Add Analytics** (optional)
   - Vercel Analytics (free tier available)
   - Google Analytics
   - Plausible Analytics

2. **Set up Monitoring**
   - Vercel Speed Insights (free)
   - Error tracking

3. **SEO Optimization**
   - Add meta tags
   - Submit sitemap to Google Search Console

4. **Performance**
   - Already optimized by Vercel!
   - Images are auto-optimized
   - Edge caching enabled

## Support

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

**🎉 Congratulations! Your Recruiter Directory is now live!**

