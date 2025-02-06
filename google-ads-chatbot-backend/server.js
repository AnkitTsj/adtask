

const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());
const { GoogleAdsClient } = require('google-ads-api');
// const ads = googleAdsApi({ version: 'v15', auth: oauth2Client });

// --- Gemini API Setup ---
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // **Replace with your actual Gemini API Key in .env file!**
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // **Using "gemini-pro" model - Corrected**
const { google } = require('googleapis');
// const googleAdsApi = google.ads_googleads; // Correctly imported



// --- Google Ads API OAuth 2.0 Setup ---
// const { google } = require('googleapis');
// const googleAdsApi = google.ads_googleads; // **Correct Google Ads API service import**

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ADS_CLIENT_ID, // **Make sure GOOGLE_ADS_CLIENT_ID is in .env and correct!**
    process.env.GOOGLE_ADS_CLIENT_SECRET, // **Make sure GOOGLE_ADS_CLIENT_SECRET is in .env and correct!**
    process.env.GOOGLE_ADS_REDIRECT_URI  // **Make sure GOOGLE_ADS_REDIRECT_URI is in .env and correct!**
);

// const ads = googleAdsApi({ version: 'v15', auth: oauth2Client });
// const ads = googleAdsApi({ version: 'v15', auth: oauth2Client });
const client = new GoogleAdsClient({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

const scopes = [
    'https://www.googleapis.com/auth/adwords'
];
// --- Route to Generate Google Ads API Authorization URL ---


// --- Route to Generate Google Ads API Authorization URL ---
app.get('/api/auth/google-ads-url', (req, res) => {
    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    res.json({ authUrl: authorizationUrl });
});

// --- OAuth 2.0 Callback Route Handler ---
app.get('/oauth2callback', async (req, res) => {
    const code = req.query.code;

    if (code) {
        try {
            const tokenResponse = await oauth2Client.getToken(code);
            const tokens = tokenResponse.tokens;

            oauth2Client.setCredentials(tokens);

            console.log('--- OAuth 2.0 Tokens Received and Set ---');
            console.log('Access Token:', tokens.access_token);
            console.log('Refresh Token:', tokens.refresh_token);

            res.redirect('http://localhost:3000/oauthsuccess');

        } catch (error) {
            console.error('Error exchanging authorization code for tokens:', error);
            res.status(500).send('Error during OAuth 2.0 token exchange.');
        }
    } else {
        res.status(400).send('Authorization code not found in callback request.');
    }
});

// ... (in server.js) ...

app.get('/api/get-campaign-budgets', async (req, res) => {
    try {
        const ads = google.ads({ version: 'v15', auth: oauth2Client });

        const query = `SELECT campaign_budget.resource_name, campaign_budget.name FROM campaign_budget WHERE campaign_budget.name = 'Test Chatbot Budget' LIMIT 1`; // **Adjust query to match your Budget Name**

        const searchRequest = {
            customerId: process.env.GOOGLE_ADS_CUSTOMER_ID,
            query: query,
        };

        const response = await ads.customerService.search(searchRequest); // Use customerService.search to run GAQL queries

        if (response.results && response.results.length > 0) {
            const budgetResourceName = response.results[0].campaignBudget.resourceName;
            console.log("Campaign Budget Resource Name found:", budgetResourceName);
            res.json({ budgetResourceName: budgetResourceName }); // Send resourceName to frontend
        } else {
            res.status(404).json({ error: "Campaign Budget not found (check Budget Name in query)." });
        }


    } catch (error) {
        console.error("Error fetching Campaign Budgets from Google Ads API:", error);
        res.status(500).json({ error: "Error fetching Campaign Budgets.", apiError: error.message });
    }
});



// --- OAuth 2.0 Callback Route Handler ---


// --- API Endpoint to Test Google Ads API Campaign Creation ---
// app.get('/api/test-google-ads-api', async (req, res) => {
//     try {
//         // **Correct Google Ads API Client Initialization - Using googleAdsApi.GoogleAdsService**
//         const adsService = new googleAdsApi.GoogleAdsService({ version: 'v15', auth: oauth2Client }); 

//         const campaign = {
//             name: `Test Campaign - ${Date.now()}`,
//             campaignBudget: {
//                 resourceName: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/campaignBudgets/7814583334`, // **REPLACE with your Budget Resource Name in .env file!**
//             },
//             advertisingChannelType: 'SEARCH',
//             status: 'PAUSED',
//             manualCpc: { bidStrategyType: 'MANUAL_CPC' },
//             networkSettings: {
//                 targetGoogleSearch: true,
//                 targetSearchNetworkPartners: false,
//                 targetContentNetwork: false,
//             },
//         };

//         // **Correct Method Call - Using adsService.mutateCampaigns**
//         const response = await adsService.mutateCampaigns({ 
//             customerId: process.env.GOOGLE_ADS_CUSTOMER_ID, // **Make sure GOOGLE_ADS_CUSTOMER_ID is in .env and correct!**
//             mutateOperations: [{
//                 create: campaign
//             }]
//         });

//         console.log("Google Ads API Campaign Creation Response:", response.data);
//         res.json({ message: "Google Ads API Campaign Creation Test Initiated. Check backend console for response and Google Ads account for campaign.", apiResponse: response.data });

//     } catch (error) {
//         console.error("Error calling Google Ads API for campaign creation:", error);
//         res.status(500).json({ error: "Error testing Google Ads API Campaign Creation.", apiError: error.message });
//     }
// });

app.get('/api/test-google-ads-api', async (req, res) => {
    try {
        // Initialize the Ads client using the correct function
        // const ads = googleAdsApi({ version: 'v15', auth: oauth2Client });
        const client = new GoogleAdsClient({
            client_id: process.env.GOOGLE_ADS_CLIENT_ID,
            client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
            developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
            refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
        });
        
        // Define the campaign object. Ensure that campaignBudget.resourceName is valid.
        const campaign = {
            name: `Test Campaign - ${Date.now()}`,
            campaignBudget: {
                resourceName: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/campaignBudgets/7814583334`,
            },
            advertisingChannelType: 'SEARCH',
            status: 'PAUSED',
            manualCpc: { bidStrategyType: 'MANUAL_CPC' },
            networkSettings: {
                targetGoogleSearch: true,
                targetSearchNetworkPartners: false,
                targetContentNetwork: false,
            },
        };

        // Call the mutate endpoint using the customers resource
        // const response = await ads.customers.campaigns.mutate({
        //     customerId: process.env.GOOGLE_ADS_CUSTOMER_ID,
        //     mutateOperations: [{
        //         create: campaign
        //     }]
        // });
        const response = await client.search({
            customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
            query: query,
        });
        

        console.log("Google Ads API Campaign Creation Response:", response.data);
        res.json({
            message: "Google Ads API Campaign Creation Test Initiated. Check backend console for response and your Google Ads account for the new campaign.",
            apiResponse: response.data
        });
    } catch (error) {
        console.error("Error calling Google Ads API for campaign creation:", error);
        res.status(500).json({
            error: "Error testing Google Ads API Campaign Creation.",
            apiError: error.message
        });
    }
});


// --- Chatbot API Endpoint ---
app.post('/api/chatbot', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Message text is required." });
    }

    try {
        let promptText = `You are AdBot, a highly efficient AI assistant for Google Ads campaign creation.
        Your goal is to quickly understand a business owner's niche and marketing goals with minimal questions.
        Focus on extracting key information needed to set up a Google Ads campaign. Be direct and concise. Avoid unnecessary chat.

        **Confirmation Questions:** When you are confirming information provided by the user, always frame your confirmation as a **clear Yes/No question** so the user can easily confirm or deny. For example: "So, if I understand correctly, you sell [business niche]. **Is that correct, yes or no?**" or "You want to focus on [marketing goal]. **Is that right, yes or no?**"

        **Initial Question (if conversation is new):** "What type of business do you run? Please be specific (e.g., 'Italian restaurant', 'online shoe store', 'plumbing services')."

        **Subsequent Questions:** Ask very brief, targeted questions to clarify their niche and marketing goals. Use option-based questions whenever possible to guide the user and get structured answers.
        Conversation History:\n`;
        conversationHistory.forEach(turn => { promptText += `${turn.sender}: ${turn.text}\n`; });
        promptText += `User message: "${userMessage}"\n\nAdBot response (be concise, targeted, and use Yes/No confirmations):`;

        const result = await model.generateContent(promptText);
        const botResponse = result.response.text();

        conversationHistory.push({ sender: 'user', text: userMessage });
        conversationHistory.push({ sender: 'bot', text: botResponse });
        conversationTurnCount++;

        if (conversationHistory.length > 10) {
            conversationHistory.shift();
            conversationHistory.shift();
        }

        if (conversationTurnCount >= 5) {
            let campaignDataPrompt = `Based on the following conversation history, you need to generate data for a Google Ads campaign. Be very specific and output in a structured way.

                Conversation History:\n`;
            conversationHistory.forEach(turn => { campaignDataPrompt += `${turn.sender}: ${turn.text}\n`; });

            campaignDataPrompt += `\n\n**Campaign Data Requirements:**

                * **Keywords:**
                    * Suggest 5-7 highly relevant keywords.
                * **Ad Headlines:**
                    * Generate 3-5 compelling ad headlines.
                * **Ad Descriptions:**
                    * Write 2-3 short ad descriptions.

                **Output Format:** Return in structured format:

                Campaign Data Output:
                Keywords: (comma-separated keywords)
                Headlines: (each on new line)
                Descriptions: (each on new line)
                `;


            const campaignDataResult = await model.generateContent(campaignDataPrompt);
            const campaignDataText = campaignDataResult.response.text();

            const parsedCampaignData = parseCampaignData(campaignDataText);

            const reviewResponse = {
                response: "Okay, campaign preview:",
                campaignData: parsedCampaignData,
                isReview: true
            };
            return res.json(reviewResponse);
        }

        res.json({ response: botResponse, isReview: false });

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Error getting response from AI" });
    }

});

function parseCampaignData(textResponse) {
    const data = { keywords: [], headlines: [], descriptions: [] };
    const sections = textResponse.split(/(Keywords:|Headlines:|Descriptions:)/).filter(Boolean);

    let currentSection = "";
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i].trim();
        if (section === "Keywords:") {
            currentSection = "keywords";
        } else if (section === "Headlines:") {
            currentSection = "headlines";
        } else if (section === "Descriptions:") {
            currentSection = "descriptions";
        } else {
            if (currentSection === "keywords") {
                data.keywords = section.split(',').map(keyword => keyword.trim()).filter(Boolean);
            } else if (currentSection === "headlines") {
                data.headlines = section.split('\n').map(line => line.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
            } else if (currentSection === "descriptions") {
                data.descriptions = section.split('\n').map(line => line.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
            }
        }
    }
    return data;
}


// --- Keep these existing routes for testing ---
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Start with a Greeting!' });
});

app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
});



// --- API Endpoint to Test Google Ads API Campaign Creation ---

