require('dotenv').config(); // Load environment variables from .env file
const { google } = require('googleapis');

// --- Google Ads API OAuth 2.0 Setup ---
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ADS_CLIENT_ID,
    process.env.GOOGLE_ADS_CLIENT_SECRET,
    process.env.GOOGLE_ADS_REDIRECT_URI
);

const scopes = [
    'https://www.googleapis.com/auth/adwords' // Google Ads API scope (full access)
];

// --- Generate Authorization URL ---
const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'offline' to get refresh token
    scope: scopes,
    // Optional 'state' parameter can be added later for security
});

// --- Output the Authorization URL to the console ---
console.log('Authorization URL:');
console.log(authorizationUrl);
console.log('\n--- Open this URL in your browser to authorize ---');