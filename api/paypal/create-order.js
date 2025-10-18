const fetch = require('node-fetch');

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

// Hàm tạo Access Token
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

// Hàm chính xử lý yêu cầu
module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { cart } = req.body;
        const accessToken = await generateAccessToken();

        // Tính tổng tiền từ giỏ hàng
        let totalVND = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let totalUSD = (totalVND / 25000).toFixed(2); // Quy đổi USD

        const url = `${base}/v2/checkout/orders`;
        const payload = {
            intent: "CAPTURE",
            purchase_units: [{
                amount: {
                    currency_code: "USD",
                    value: totalUSD,
                },
            }],
        };
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        res.status(200).json({ id: data.id });
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ error: "Failed to create order." });
    }
};