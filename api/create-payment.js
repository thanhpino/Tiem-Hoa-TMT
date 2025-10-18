const fetch = require('node-fetch');
const crypto = require('crypto');

// Lấy các biến môi trường (bạn sẽ cài đặt chúng trên Vercel sau)
const {
    MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY,
    ZALOPAY_APP_ID, ZALOPAY_KEY1, ZALOPAY_KEY2
} = process.env;

const MOMO_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create";
const REDIRECT_URL = "https://your-website.com/thank-you"; // Thay bằng link trang web của bạn
const IPN_URL = "https://your-website.com/api/payment-ipn"; // Thay bằng link trang web của bạn

// --- HÀM XỬ LÝ CHO MOMO ---
async function createMoMoPayment(orderId, amount, orderInfo) {
    const requestId = orderId;
    const requestType = "captureWallet";
    const extraData = ""; // Có thể để trống hoặc truyền thêm dữ liệu base64 nếu cần

    // Chuỗi để tạo chữ ký
    const rawSignature = `partnerCode=${MOMO_PARTNER_CODE}&accessKey=${MOMO_ACCESS_KEY}&requestId=${requestId}&amount=${amount}&orderId=${orderId}&orderInfo=${orderInfo}&returnUrl=${REDIRECT_URL}&notifyUrl=${IPN_URL}&extraData=${extraData}`;

    // Tạo chữ ký HMAC SHA256
    const signature = crypto.createHmac('sha256', MOMO_SECRET_KEY)
                            .update(rawSignature)
                            .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode: MOMO_PARTNER_CODE,
        accessKey: MOMO_ACCESS_KEY,
        requestId,
        amount,
        orderId,
        orderInfo,
        returnUrl: REDIRECT_URL,
        notifyUrl: IPN_URL,
        extraData,
        requestType,
        signature,
        lang: 'vi'
    });

    const response = await fetch(MOMO_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody
    });

    const data = await response.json();
    return data.payUrl;
}
async function createZaloPayPayment(orderId, amount, orderInfo) {
    // ... Logic tạo thanh toán ZaloPay ở đây ...
    // Bạn sẽ cần tạo chữ ký theo chuẩn của ZaloPay và gọi đến endpoint của họ.
    // Tạm thời trả về link placeholder
    console.log("ZaloPay payment creation needs to be implemented based on their official documentation.");
    return "https://zalopay.vn/"; // Placeholder
}


// --- HÀM CHÍNH XỬ LÝ YÊU CẦU ---
module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { method, cart } = req.body;
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const orderId = `TMT${Date.now()}`; // Tạo một ID đơn hàng duy nhất
        const orderInfo = "Thanh toán đơn hàng hoa tươi tại Tiệm TMT";

        let payUrl = "";

        if (method === 'momo') {
            payUrl = await createMoMoPayment(orderId, total, orderInfo);
        } else if (method === 'zalopay') {
            payUrl = await createZaloPayPayment(orderId, total, orderInfo);
        } else {
            return res.status(400).json({ error: "Phương thức thanh toán không hợp lệ." });
        }

        res.status(200).json({ payUrl });

    } catch (error) {
        console.error("Failed to create payment:", error);
        res.status(500).json({ error: "Không thể tạo thanh toán." });
    }
};