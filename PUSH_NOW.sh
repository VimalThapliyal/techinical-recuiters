#!/bin/bash

# Quick push script - Run this after creating the GitHub repo
# Usage: ./PUSH_NOW.sh YOUR_GITHUB_USERNAME

GITHUB_USERNAME=${1:-"vimalthapliyal"}  # Default guess based on email

echo "🚀 Setting up and pushing to GitHub..."
echo "Repository: https://github.com/${GITHUB_USERNAME}/techinical-recuiters"
echo ""

# Remove existing remote if any
git remote remove origin 2>/dev/null || true

# Add remote
git remote add origin "https://github.com/${GITHUB_USERNAME}/techinical-recuiters.git"

# Ensure we're on main branch
git branch -M main 2>/dev/null || true

echo "✅ Remote configured!"
echo ""
echo "📤 Pushing to GitHub..."
echo ""

# Try to push
if git push -u origin main 2>&1; then
    echo ""
    echo "🎉 SUCCESS! Your code is now on GitHub!"
    echo "📍 Repository: https://github.com/${GITHUB_USERNAME}/techinical-recuiters"
    echo ""
    echo "Next: Deploy to Vercel at https://vercel.com"
else
    echo ""
    echo "⚠️  Push failed. This usually means:"
    echo "   1. Repository doesn't exist yet on GitHub"
    echo "   2. Wrong username (current: ${GITHUB_USERNAME})"
    echo ""
    echo "📝 To fix:"
    echo "   1. Create repo at: https://github.com/new"
    echo "   2. Name it: techinical-recuiters"
    echo "   3. Then run this script again with your username:"
    echo "      ./PUSH_NOW.sh YOUR_GITHUB_USERNAME"
    echo ""
    echo "Or if username is wrong, run:"
    echo "   ./PUSH_NOW.sh YOUR_ACTUAL_USERNAME"
fi

