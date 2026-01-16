// Build script to replace social sharing URLs with actual Netlify domain
// This script automatically runs during Netlify build, or can be run manually
// Manual: node build-script.js your-domain.netlify.app

const fs = require('fs');
const path = require('path');

// Get domain from Netlify env var or command line argument
const netlifyUrl = process.env.DEPLOY_PRIME_URL || process.env.URL || process.argv[2];

let domain;
if (netlifyUrl) {
    // Extract domain from URL (e.g., https://site.netlify.app -> site.netlify.app)
    const urlMatch = netlifyUrl.match(/https?:\/\/([^\/]+)/);
    domain = urlMatch ? urlMatch[1] : netlifyUrl.replace(/https?:\/\//, '').split('/')[0];
}

if (!domain) {
    console.warn('⚠️  Warning: No domain provided. Social sharing URLs will still have placeholder.');
    console.log('   To fix manually: Replace YOUR-NETLIFY-DOMAIN in index.html with your actual domain');
    console.log('   Or run: node build-script.js your-domain.netlify.app');
    process.exit(0); // Don't fail build, just warn
}

const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace placeholder with actual domain
const replacements = {
    'YOUR-NETLIFY-DOMAIN': domain
};

let hasReplacements = false;
Object.keys(replacements).forEach(placeholder => {
    if (html.includes(placeholder)) {
        html = html.replace(new RegExp(placeholder, 'g'), replacements[placeholder]);
        hasReplacements = true;
    }
});

if (hasReplacements) {
    fs.writeFileSync(htmlPath, html);
    console.log(`✅ Updated social sharing URLs with domain: ${domain}`);
    console.log(`✅ Logo URL: https://${domain}/npv%20logo.png`);
} else {
    console.log('ℹ️  No placeholders found to replace - URLs may already be set');
}
