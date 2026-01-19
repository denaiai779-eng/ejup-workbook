# EJUP Workbook - Netlify Deployment

AI-powered homeschool workbook with immediate feedback and M-STEP standards tracking.

## Features

- Interactive digital workbook
- AI tutor (Claude) provides immediate feedback
- M-STEP standards alignment with proficiency tracking
- Parent PIN signoff system
- Photo upload for print work verification
- Progress dashboard with gradebook

## Quick Deploy to Netlify

### Option 1: Netlify CLI (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from this folder
cd /Users/denaikelly/EJUP/06_Tools/Generators/netlify_ejup
netlify deploy --prod
```

### Option 2: Netlify Web Interface

1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag the `netlify_ejup` folder onto the page
3. Get your URL

## Enable AI Tutoring

After deploying, add your Anthropic API key:

1. Go to Netlify Dashboard > Your Site > Site Settings > Environment Variables
2. Add: `ANTHROPIC_API_KEY` = your key from [console.anthropic.com](https://console.anthropic.com)
3. Redeploy

Then update the workbook to use your API:
1. Open the deployed site
2. Open browser console (F12)
3. Run: `localStorage.setItem('ejupApiUrl', 'https://your-site.netlify.app/api')`
4. Refresh

## File Structure

```
netlify_ejup/
├── netlify.toml          # Netlify config
├── package.json          # Dependencies
├── public/
│   └── index.html        # The workbook
└── functions/
    └── evaluate.js       # AI evaluation endpoint
```

## Local Testing

```bash
# Install dependencies
npm install

# Run locally with Netlify Dev
netlify dev
```

## Costs

- **Netlify**: Free tier (100GB bandwidth, 125k function calls/month)
- **Claude API**: ~$0.003 per evaluation (very cheap)
  - Estimated: $1-2/month for heavy use

## M-STEP Standards Tracked

| Code | Description |
|------|-------------|
| 4.NBT.6 | Division of multi-digit numbers |
| 4.PS3.A | Energy transfer |
| 4.PS3.B | Forces and friction |
| 4-H3.0.2 | Michigan Indigenous peoples |
| 4-H3.0.3 | Path to statehood |
| 4-H3.0.5 | European exploration |
| 4-H3.0.6 | Treaties and government |

## Proficiency Levels

| Level | Score | Description |
|-------|-------|-------------|
| ADVANCED | 3.5-4.0 | Exceeds grade-level expectations |
| PROFICIENT | 2.5-3.4 | Meets grade-level expectations |
| DEVELOPING | 1.5-2.4 | Approaching expectations |
| NOT PROFICIENT | 1.0-1.4 | Below expectations |
