/* src/main/resources/static/js/thanhtoan.js */
const formatCurrency = (number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number).replace('₫', 'đ');
    // Hàm kiểm tra form có hợp lệ không
    function validateForm() {
        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const address = document.getElementById('deliveryAddress').value.trim();

        if (!name) {
            alert("Vui lòng nhập họ tên người nhận!");
            document.getElementById('customerName').focus();
            return false;
        }
        if (!phone) {
            alert("Vui lòng nhập số điện thoại để shipper liên hệ!");
            document.getElementById('customerPhone').focus();
            return false;
        }
        // Validate sđt
        const phoneRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (!phoneRegex.test(phone)) {
             alert("Số điện thoại không hợp lệ!");
             document.getElementById('customerPhone').focus();
             return false;
        }

        if (!address) {
            alert("Vui lòng nhập địa chỉ giao hàng!");
            document.getElementById('deliveryAddress').focus();
            return false;
        }
        return true;
    }

    // Hàm gửi đơn hàng về Backend
    async function guiDonHangVeBackend(paymentMethod, totalAmount) {
        // Lấy dữ liệu thật từ form
        const name = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const address = document.getElementById('deliveryAddress').value.trim();
        const email = document.getElementById('email').value.trim();
        const userNote = document.getElementById('orderNote').value.trim();

        // Ghép ghi chú của khách với phương thức thanh toán
        const finalNote = `${userNote ? userNote + " | " : ""}Thanh toán: ${paymentMethod.toUpperCase()}`;

        const orderData = {
            customerName: name,
            phone: phone,
            address: address,
            email: email,
            note: finalNote,
            totalAmount: totalAmount,
            status: "MOI_TAO" // Trạng thái mặc định
        };

        try {
            const response = await fetch('/api/orders/create', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Gửi kèm cookie để xác thực session
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                console.log("✅ Đã lưu đơn hàng thành công!");
                return true; // Trả về true để báo thành công
            } else {
                console.error("❌ Lỗi khi lưu đơn hàng");
                alert("Hệ thống đang bận, vui lòng thử lại sau!");
                return false;
            }
        } catch (error) {
            console.error("❌ Lỗi kết nối Server:", error);
            alert("Không thể kết nối đến máy chủ!");
            return false;
        }
    }
    document.addEventListener('DOMContentLoaded', () => {
        // --- A. CẤU HÌNH BACKGROUND ---
        const checkoutBackgrounds = [
            'https://images.pexels.com/photos/2253832/pexels-photo-2253832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            'https://images.pexels.com/photos/15239/flower-roses-red-roses-bloom.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            'https://www.toptal.com/designers/subtlepatterns/uploads/fancy-cushion.png'
            ];
        const randomBg = checkoutBackgrounds[Math.floor(Math.random() * checkoutBackgrounds.length)];
        document.body.style.backgroundImage = `url('${randomBg}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        // --- B. LOGIC THANH TOÁN ---
        const orderItemsContainer = document.getElementById('order-items');
        const totalPriceElement = document.getElementById('total-price');
        const checkoutContent = document.getElementById('checkout-content');
        const thankYouMessage = document.getElementById('thank-you-message');
        const finalMessage = document.getElementById('final-message');
        const paymentMethods = document.querySelectorAll('.payment-method');
        const confirmButton = document.getElementById('confirm-payment-button');
        const paypalContainer = document.getElementById('paypal-button-container');
        const paymentSimulationModal = document.getElementById('payment-simulation-modal');
        let selectedPaymentMethod = null;
        let total = 0;

        const cartData = localStorage.getItem('shoppingCart');
        const cart = cartData ? JSON.parse(cartData) : [];
        
        if (cart.length === 0){
            checkoutContent.innerHTML = '<p class="text-center text-slate-500">Giỏ hoa của bạn đang trống. <a href="/index" class="text-pink-500 hover:underline">Quay lại chọn hoa</a></p>';
            return;
        }

        cart.forEach(item => {
            orderItemsContainer.innerHTML += `
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-semibold">${item.name} <span class="text-slate-500 font-normal">x${item.quantity}</span></p>
                        <p class="text-sm text-slate-500">${formatCurrency(item.price)}</p>
                    </div>
                    <p class="font-semibold">${formatCurrency(item.price * item.quantity)}</p>
                </div>
            `;
            total += item.price * item.quantity;
        });
        totalPriceElement.textContent = formatCurrency(total);

        const showThankYouScreen = (paymentMethodName, transactionId = null) => {
            const modal = document.getElementById('payment-simulation-modal');
            modal.classList.add('hidden'); 
            modal.style.display = 'none';
            checkoutContent.classList.add('hidden');
            thankYouMessage.classList.remove('hidden');
            let message = `Đơn hàng của bạn đã được xác nhận! TMT Florist sẽ chuẩn bị và giao hoa sớm nhất.`;
            if (transactionId) {
                message = `Thanh toán thành công qua ${paymentMethodName}! Cảm ơn bạn đã tin tưởng Tiệm Hoa Tươi TMT.<br>Mã giao dịch của bạn là: ${transactionId}`;
            } else if (paymentMethodName === 'COD') {
                message = `Đơn hoa của bạn đã được xác nhận! Mình sẽ chuẩn bị và giao hoa sớm nhất.<br>Vui lòng chuẩn bị <strong>${formatCurrency(total)}</strong> để thanh toán khi nhận hàng.`;
            }
            finalMessage.innerHTML = message;
            localStorage.removeItem('shoppingCart');
        };

        const openSimulationModal = (method, amount) => {
            paymentSimulationModal.classList.remove('hidden');
            lucide.createIcons();
            let countdown = 5;
            const timerEl = document.getElementById('countdown-timer');
            timerEl.textContent = countdown;
            const interval = setInterval(() => {
                countdown--;
                timerEl.textContent = countdown;
                if (countdown <= 0) {
                    clearInterval(interval);
                    paymentSimulationModal.classList.add('hidden');
                    showThankYouScreen(method === 'momo' ? 'Ví MoMo' : 'ZaloPay');
                }
            }, 1000);
        };

        paymentMethods.forEach(button => {
            button.addEventListener('click', () => {
                selectedPaymentMethod = button.dataset.method;
                paymentMethods.forEach(btn => {
                    btn.classList.remove('selected-payment');
                    btn.querySelector('[data-lucide="check-circle-2"]').classList.add('hidden');
                });
                button.classList.add('selected-payment');
                button.querySelector('[data-lucide="check-circle-2"]').classList.remove('hidden');
                confirmButton.disabled = false;
                if (selectedPaymentMethod === 'paypal') {
                    confirmButton.classList.add('hidden');
                    paypalContainer.classList.remove('hidden');
                } else {
                    paypalContainer.classList.add('hidden');
                    confirmButton.classList.remove('hidden');
                }
            });
        });

        
        confirmButton.addEventListener('click', async () => {
            if (!selectedPaymentMethod) return;

            // 1. Kiểm tra nhập liệu trước
            if (!validateForm()) return; 

            // 2. Disable nút để tránh bấm nhiều lần
            const originalText = confirmButton.innerText;
            confirmButton.disabled = true;
            confirmButton.innerText = "Đang xử lý...";

            // 3. Gửi về Backend
            const success = await guiDonHangVeBackend(selectedPaymentMethod, total);

            if (!success) {
                confirmButton.disabled = false;
                confirmButton.innerText = originalText;
                return;
            }

            // 4. Xử lý hiển thị sau khi thành công
            if (selectedPaymentMethod === 'cod') {
                showThankYouScreen('COD');
                return;
            }

            if (selectedPaymentMethod === 'momo' || selectedPaymentMethod === 'zalopay') {
                const orderId = `TMT${Date.now()}`; 
                
                // Hiển thị giao diện QR Code
                document.getElementById('checkout-content').innerHTML = `
                    <div class="bg-white p-8 rounded-2xl shadow-lg text-center">
                        <h1 class="text-3xl font-bold text-pink-600 mb-4">Quét Mã VietQR Để Thanh Toán</h1>
                        <p class="text-slate-600 mb-6">Vui lòng sử dụng ứng dụng <strong>Ngân hàng</strong>, <strong>MoMo</strong>, hoặc <strong>ZaloPay</strong> để quét mã.</p>
                        
                        <img 
                            src="https://img.vietqr.io/image/VCB-1040868320-compact2.jpg?amount=${total}&addInfo=${orderId}&accountName=TRUONG MINH THANH" 
                            alt="Mã QR Chuyển Khoản" 
                            class="w-56 h-56 mx-auto border-4 border-pink-200 rounded-lg p-1"
                        >
                        
                        <div class="text-left bg-rose-50 p-4 rounded-lg my-6 space-y-3 border border-red-200">
                            <p>
                                <span class="font-semibold">Số tiền cần chuyển:</span><br>  
                                <span class="text-2xl font-bold text-red-600">${formatCurrency(total)}</span>
                            </p>
                            <p>
                                <span class="font-semibold">Nội dung chuyển khoản (BẮT BUỘC):</span><br>
                                <span class="text-2xl font-bold text-red-600">${orderId}</span>
                            </p>
                            <p class="text-sm text-slate-500 mt-2">
                                <i>‼️ Vui lòng <strong>sao chép và dán chính xác</strong> nội dung chuyển khoản trên để đơn hàng của bạn được xác nhận nhanh nhất!</i>
                            </p>
                        </div>

                        <a href="/" class="bg-pink-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-600 transition-colors">
                            Quay về trang chủ
                        </a>
                    </div>
                `;
                localStorage.removeItem('shoppingCart');
            }
        });


        paypal.Buttons({
            createOrder: async function() {
                if (!validateForm()) {
                    alert("Vui lòng điền đầy đủ thông tin giao hàng trước khi thanh toán qua PayPal!");
                    return;
                }
                try {
                    // Gọi API Java
                    const response = await fetch("/api/create-paypal-order", { 
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ total: total }), 
                    });
                    const order = await response.json();
                    return order.id;
                } catch (err) {
                    console.error("Lỗi tạo đơn:", err);
                    alert("Lỗi kết nối PayPal");
                }
            },
            onApprove: async function(data, actions) {
                try {
                    // 1. Lấy email từ form
                    const customerEmail = document.getElementById("email").value;
                    const customerName = document.getElementById("customerName").value || "Khách hàng";

                    const customerAddress = document.getElementById("deliveryAddress").value || "Không có địa chỉ";
                    const customerPhone = document.getElementById("customerPhone").value || "Không có SĐT";

                    
                    if (!customerEmail || !customerEmail.includes('@')) {
                        alert("Vui lòng nhập Email hợp lệ để nhận hóa đơn!");
                        return; // Dừng lại, không gọi backend
                    }

                    // 2. Gọi API Java để capture và gửi Email
                    const response = await fetch("/api/capture-paypal-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            orderID: data.orderID,
                            email: customerEmail, // Gửi email về đây
                            customerName: customerName,
                            total: total,
                            address: customerAddress,
                            phone: customerPhone
                        }),
                });

                const details = await response.json();
                
                if (details.status === 'COMPLETED') {
                    // Thành công
                    //alert("Thanh toán thành công! Hóa đơn đã được gửi tới email: " + customerEmail);
                    showThankYouScreen('PayPal', details.id);   
                }
            } catch (err) {
                console.error("Lỗi capture:", err);
                alert("Thanh toán thất bại");
            }
        }
    }).render('#paypal-button-container');
    lucide.createIcons();
});