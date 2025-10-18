const fetch = require('node-fetch');

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

// Hàm tạo access token
async function generateAccessToken() {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: { Authorization: `Basic ${auth}` },
    });
    const data = await response.json();
    return data.access_token;
}

// Hàm main
module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { orderID } = req.body;
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderID}/capture`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Failed to capture order:", error);
        res.status(500).json({ error: "Failed to capture order." });
    }
};