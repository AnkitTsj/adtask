require('dotenv').config();
const { GoogleAdsApi } = require('google-ads-api');

async function main() {
  // Initialize the client with your credentials
  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  });

  // Create a customer instance using your customer_id and refresh token
  const customer = client.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  });

  try {
    // Define the campaign object you want to create
    const campaign = {
      name: `Test Campaign - Dummy Script - ${Date.now()}`,
      campaignBudget: {
        resourceName: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/campaignBudgets/YOUR_BUDGET_ID_HERE`,
      },
      advertisingChannelType: 'SEARCH',
      status: 'PAUSED',
      manualCpc: { enhancedCpcEnabled: false },
      networkSettings: {
        targetGoogleSearch: true,
        targetSearchNetwork: true,
        targetContentNetwork: false,
      },
    };

    // Call mutateCampaigns to create the campaign
    const response = await customer.mutateCampaigns({
      customerId: process.env.GOOGLE_ADS_CUSTOMER_ID,
      mutateOperations: [{
        create: campaign,
      }],
    });

    console.log("Google Ads API Campaign Creation Response:", response);
    console.log("Campaign created successfully. Check your Google Ads account.");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
