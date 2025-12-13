#!/bin/bash

# Script to create GitHub repository and push code
# Usage: ./create-and-push.sh YOUR_GITHUB_USERNAME

set -e

GITHUB_USERNAME=$1

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GitHub username required"
    echo "Usage: ./create-and-push.sh YOUR_GITHUB_USERNAME"
    exit 1
fi

REPO_NAME="techinical-recuiters"
REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo "🚀 Setting up GitHub repository..."
echo "Repository: ${REPO_URL}"
echo ""

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote 'origin' already exists. Removing it..."
    git remote remove origin
fi

# Add remote
echo "📡 Adding remote repository..."
git remote add origin "${REPO_URL}"

# Set branch to main
echo "🌿 Setting branch to main..."
git branch -M main

echo ""
echo "✅ Local setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Go to: https://github.com/new"
echo "2. Repository name: ${REPO_NAME}"
echo "3. Make it Public (or Private)"
echo "4. DO NOT initialize with README, .gitignore, or license"
echo "5. Click 'Create repository'"
echo ""
echo "Then run:"
echo "  git push -u origin main"
echo ""
echo "Or if you want to try pushing now (will fail if repo doesn't exist yet):"
read -p "Try to push now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Attempting to push..."
    git push -u origin main || {
        echo ""
        echo "⚠️  Push failed. This is normal if the repository doesn't exist yet."
        echo "Please create the repository on GitHub first, then run:"
        echo "  git push -u origin main"
    }
fi

