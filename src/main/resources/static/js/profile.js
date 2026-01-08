/* src/main/resources/static/js/profile.js */
// Định dạng tiền tệ VNĐ
const formatCurrency = (number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number).replace('₫', 'đ');

let hoaTuoi = []; // Biến toàn cục để lưu dữ liệu hoa tươi

// --- 0. NẠP DỮ LIỆU CHO CHATBOT ---
async function loadChatbotData() {
    try {
        const response = await fetch('/api/products/all');
        if (response.ok) {
            hoaTuoi = await response.json(); 
            console.log("Chatbot đã học được:", hoaTuoi.length, "sản phẩm");
        }
    } catch (error) {
        console.error("Lỗi dạy Chatbot học:", error);
    }
}
// Khởi tạo Icon
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    loadChatbotData();
});
// --- 1. LOGIC SỬA HỒ SƠ ---
function openEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    modal.classList.remove('hidden');
    lucide.createIcons();
}

function closeEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    modal.classList.add('hidden');
}

async function submitEditProfile(e) {
    e.preventDefault();
    const btn = document.getElementById('save-profile-btn');
    btn.disabled = true;
    btn.innerHTML = '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Đang lưu...';
    lucide.createIcons();

    const data = {
        fullName: document.getElementById('edit-fullname').value,
        phoneNumber: document.getElementById('edit-phoneNumber').value,
        address: document.getElementById('edit-address').value
    };

    try {
        const response = await fetch('/api/user/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Cập nhật thành công! 🎉");
            window.location.reload();
        } else if (response.status === 401) {
            alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
            window.location.href = "/login";
        } else {
            const msg = await response.text();
            alert("Lỗi: " + msg);
        }
    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối Server");
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Lưu Thay Đổi';
        lucide.createIcons();
    }
}

// --- 2. LOGIC ĐÁNH GIÁ SẢN PHẨM ---
function openReviewModal(orderId) {
    document.getElementById('review-order-id').value = orderId;
    document.getElementById('review-modal').classList.remove('hidden');
    selectStar(5);
    lucide.createIcons();
}

function closeReviewModal() {
    document.getElementById('review-modal').classList.add('hidden');
}

function selectStar(star) {
    document.getElementById('selected-rating').value = star;
    const stars = document.querySelectorAll('.star-icon');
    stars.forEach((s, index) => {
        if (index < star) {
            s.classList.remove('text-gray-300');
            s.classList.add('text-yellow-400', 'fill-yellow-400');
        } else {
            s.classList.add('text-gray-300');
            s.classList.remove('text-yellow-400', 'fill-yellow-400');
        }
    });
}

async function submitReview(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-review-btn');
    btn.disabled = true;
    btn.innerText = "Đang gửi...";

    const orderId = document.getElementById('review-order-id').value;
    const rating = document.getElementById('selected-rating').value;
    const comment = document.getElementById('review-comment').value;
    const fileInput = document.getElementById('review-image');

    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('comment', comment);
    if (fileInput.files[0]) {
        formData.append('file', fileInput.files[0]);
    }

    try {
        const response = await fetch(`/api/orders/${orderId}/review`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert("Cảm ơn bạn đã đánh giá! ❤️");
            closeReviewModal();
            window.location.reload();
        } else {
            alert("Lỗi gửi đánh giá. Vui lòng thử lại.");
        }
    } catch (err) {
        console.error(err);
        alert("Lỗi kết nối Server");
    } finally {
        btn.disabled = false;
        btn.innerText = "Gửi Đánh Giá";
    }
}
async function openOrderDetailModal(orderId) {
    // 1. Hiện Modal & Loading
    const modal = document.getElementById('order-detail-modal');
    modal.classList.remove('hidden');
    
    // Reset nội dung cũ và hiện loading
    document.getElementById('detail-items-list').innerHTML = 
        '<p class="text-center text-gray-400 py-4"><i data-lucide="loader" class="w-6 h-6 animate-spin mx-auto mb-2"></i>Đang tải dữ liệu...</p>';
    lucide.createIcons();

    try {
        // 2. Gọi API lấy chi tiết đơn
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) throw new Error("Lỗi tải đơn hàng");
        
        const order = await response.json();

        // 3. Điền thông tin chung vào Modal
        document.getElementById('detail-order-id').textContent = order.id;
        document.getElementById('detail-date').textContent = new Date(order.orderDate).toLocaleString('vi-VN');
        document.getElementById('detail-name').textContent = order.customerName;
        document.getElementById('detail-phone').textContent = order.phone;
        document.getElementById('detail-address').textContent = order.address;
        document.getElementById('detail-note').textContent = order.note || "Không có";
        document.getElementById('detail-total').textContent = formatCurrency(order.totalAmount);

        // 4. Render danh sách sản phẩm
        const listContainer = document.getElementById('detail-items-list');
        listContainer.innerHTML = ''; 

        if (order.orderDetails && order.orderDetails.length > 0) {
            order.orderDetails.forEach(item => {
                // Check null để tránh lỗi nếu sản phẩm bị xóa
                const productName = item.product ? item.product.name : "Sản phẩm đã xóa";
                const productImage = item.product ? item.product.image : "images/default.jpg";
                const itemTotal = item.price * item.quantity;

                // Tạo HTML cho từng món
                const itemHtml = `
                    <div class="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                        <img src="${productImage}" class="w-12 h-12 rounded object-cover border border-gray-200" onerror="this.src='images/hoahong.jpg'">
                        <div class="flex-1">
                            <p class="font-bold text-gray-800 text-sm">${productName}</p>
                            <p class="text-xs text-gray-500">
                                ${formatCurrency(item.price)} x <span class="font-bold text-gray-700">${item.quantity}</span>
                            </p>
                        </div>
                        <div class="font-bold text-pink-600 text-sm">
                            ${formatCurrency(itemTotal)}
                        </div>
                    </div>
                `;
                listContainer.insertAdjacentHTML('beforeend', itemHtml);
            });
        } else {
            listContainer.innerHTML = '<p class="text-center text-red-400 italic">Chi tiết đơn hàng đang cập nhật...</p>';
        }

    } catch (err) {
        console.error(err);
        alert("Không thể tải chi tiết đơn hàng!");
        closeOrderDetailModal();
    }
}

function closeOrderDetailModal() {
    document.getElementById('order-detail-modal').classList.add('hidden');
}