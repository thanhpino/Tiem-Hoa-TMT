/* src/main/resources/static/js/admin.js */
// --- DỮ LIỆU KHỞI TẠO ---
let hoaTuoi = [
    { id: 1, name: 'Hoa Hồng Đỏ', price: 550000, salePrice: 490000, image: 'images/hoahong.jpg' },
    { id: 2, name: 'Hoa Ly Trắng', price: 480000, image: 'images/hoaly.jpg' },
    { id: 3, name: 'Hoa Hướng Dương', price: 450000, image: 'images/hoahuongduong.jpg' },
    { id: 4, name: 'Hoa Cẩm Tú Cầu', price: 620000, image: 'images/camtucau.jpg' },
    { id: 5, name: 'Tulip Hà Lan', price: 750000, image: 'images/tulip.jpg' },
    { id: 6, name: 'Hoa Cúc Tana', price: 400000, image: 'images/cuctana.jpg' },
    { id: 7, name: 'Hoa Baby Trắng', price: 380000, salePrice: 290000, image: 'images/hoababy.jpg' },
    { id: 8, name: 'Lan Hồ Điệp', price: 1200000, salePrice: 1000000, image: 'images/lanhodiep.jpg' },
    { id: 9, name: 'Mẫu Đơn Hồng', price: 850000, image: 'images/maudon.jpg' },
    { id: 10, name: 'Oải Hương Khô', price: 420000, image: 'images/oaihuong.jpg' },
    { id: 11, name: 'Cẩm Chướng', price: 390000, salePrice: 290000, image: 'images/camchuong.jpg' },
    { id: 12, name: 'Cúc Họa Mi', price: 350000, image: 'images/cuchoami.jpg' },
    { id: 13, name: 'Hoa Sen Trắng', price: 500000, image: 'images/hoasen.jpg' },
    { id: 14, name: 'Cát Tường', price: 460000, image: 'images/cattuong.jpg' },
    { id: 15, name: 'Thạch Thảo Tím', price: 370000, image: 'images/thachthao.jpg' },
    { id: 16, name: 'Hoa Rum', price: 580000, image: 'images/rum.jpg' },
    { id: 17, name: 'Đồng Tiền', price: 410000, image: 'images/dongtien.jpg' },
    { id: 18, name: 'Salem Tím', price: 360000, image: 'images/salem.jpg' },
    { id: 19, name: 'Mõm Sói', price: 430000, image: 'images/momsoi.jpg' },
    { id: 20, name: 'Thủy Tiên Trắng', price: 490000, image: 'images/thuytien.jpg' }
];

let allOrders = [];
let previousOrderCount = 0;

// 1. Chuyển Tab
function switchTab(tabId, element) {
    document.querySelectorAll('.tab-section').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if(element) {
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        element.classList.add('active');
    }
}

// 2. Format tiền
const formatMoney = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);


// 3. Hàm hiển thị thông báo
function showNotification(message, isSound = true) {
    // Phát âm thanh
    if (isSound) {
        const sound = document.getElementById('notification-sound');
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Chặn âm thanh: ", e));
            sound.play().catch(e => console.log("Trình duyệt chặn tự phát âm thanh: ", e));
        }
    }

    // --- PHẦN 2: HIỂN THỊ TOAST ---
    const container = document.getElementById('toast-container');
    
    if (!container) {
        console.error("Lỗi: Không tìm thấy <div id='toast-container'>!");
        return; 
    }

    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.innerHTML = `
        <div class="toast-icon"><i class="fa-solid fa-bell"></i></div>
        <div class="toast-content">
            <h4>Thông báo mới</h4>
            <p>${message}</p>
        </div>
    `;
    
    container.appendChild(toast);

    // Tự tắt sau 3 giây
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 4. Tải đơn hàng
async function loadOrders() {
    try {
        let res = await fetch('/api/orders/all');
        if (res.ok) {
            allOrders = await res.json();
            renderOrders(allOrders);
            processCustomerData(allOrders); 
        
            // Nếu số lượng đơn mới > số lượng đơn cũ VÀ không phải lần tải đầu tiên
            if (allOrders.length > previousOrderCount && previousOrderCount !== 0) {
                let newCount = allOrders.length - previousOrderCount;
                showNotification(`Bạn vừa có ${newCount} đơn hàng mới! 🚀`);
            }
            
            // Cập nhật lại số lượng đơn cũ
            previousOrderCount = allOrders.length;

            // Tổng quan
            let total = allOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
            document.getElementById('totalRevenue').innerText = formatMoney(total);
            document.getElementById('totalOrders').innerText = allOrders.length;
            document.getElementById('lastUpdated').innerText = new Date().toLocaleTimeString('vi-VN');
        }
    } catch (err) { console.error(err); }
}

// Hàm định dạng ngày giờ theo múi giờ Việt Nam
function formatDateVN(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    return date.toLocaleString('vi-VN', {
        hour: '2-digit', 
        minute: '2-digit',
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric'
    }); 
}

// 4. Vẽ bảng đơn hàng
function renderOrders(orders) {
    let html = '';
    const statusColors = {
        'MOI_TAO': 'badge-primary',   // Xanh dương
        'DA_THANH_TOAN': 'badge-paid-online', // Xanh dương nhạt
        'DANG_GIAO': 'badge-warning', // Vàng
        'HOAN_THANH': 'badge-success',// Xanh lá
        'DA_HUY': 'badge-danger'      // Đỏ
    };

    orders.forEach(order => {
        
        let timeVN = formatDateVN(order.orderDate);

        let safeStatus = order.status || 'MOI_TAO';

        let currentColor = statusColors[safeStatus] || 'badge-primary';

        html += `
            <tr>
                <td style="font-weight:bold; color:#64748b">#${order.id}</td>
                <td>
                    <div style="font-weight:bold; color:#334155">${order.customerName}</div>
                    <div style="font-size:12px; color:#94a3b8">${order.phone}</div>
                </td>
                <td>
                    <div style="font-size:13px">${order.address}</div>
                    <div style="font-size:12px; color:#64748b; font-style:italic">"${order.note || ''}"</div>
                </td>
                <td style="color:var(--primary-color); font-weight:700">${formatMoney(order.totalAmount)}</td>
                
                <td style="font-size:13px; font-weight:600">${timeVN}</td>
                
                <td>
                    <select 
                        class="form-control status-select ${currentColor}" 
                        onchange="updateStatus(${order.id}, this)"
                    >
                        <option value="MOI_TAO" ${safeStatus === 'MOI_TAO' ? 'selected' : ''}>Mới Tạo</option>
                        <option value="DA_THANH_TOAN" ${safeStatus === 'DA_THANH_TOAN' ? 'selected' : ''}>Đã Thanh Toán</option>
                        <option value="DANG_GIAO" ${safeStatus === 'DANG_GIAO' ? 'selected' : ''}>Đang Giao</option>
                        <option value="HOAN_THANH" ${safeStatus === 'HOAN_THANH' ? 'selected' : ''}>Hoàn Thành</option>
                        <option value="DA_HUY" ${safeStatus === 'DA_HUY' ? 'selected' : ''}>Đã Hủy</option>
                    </select>
                </td>
                <td>
                    <div style="display:flex; gap:5px; align-items:center">
                        
                        <button class="btn" style="background:#e2e8f0; padding:5px 10px;" onclick="printOrder(${order.id})">
                            <i class="fa-solid fa-print"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    const tableBody = document.getElementById('orderTableBody');
    if (tableBody) {
        tableBody.innerHTML = html || '<tr><td colspan="7" align="center" style="padding:20px; color:gray">Chưa có đơn hàng nào</td></tr>';
    }
}

// 4. LOGIC XẾP HẠNG KHÁCH HÀNG
function processCustomerData(orders) {
    let customers = {};

    // Gom nhóm theo số điện thoại
    orders.forEach(order => {
        let phone = order.phone;
        if (!phone) return;

        if (!customers[phone]) {
            customers[phone] = { 
                name: order.customerName, 
                phone: phone, 
                count: 0, 
                totalSpent: 0 
            };
        }
        customers[phone].count += 1;
        customers[phone].totalSpent += order.totalAmount || 0;
    });

    // Chuyển object thành mảng & sắp xếp theo tổng tiền giảm dần
    let sortedCustomers = Object.values(customers).sort((a, b) => b.totalSpent - a.totalSpent);

    // Render ra bảng
    let html = '';
    sortedCustomers.forEach(c => {
        let rankBadge = '';
        let total = c.totalSpent;

        // Thuật toán xếp hạng
        if (total >= 10000000) {
            rankBadge = '<span class="rank-badge rank-diamond"><i class="fa-solid fa-gem"></i> Bạch Kim</span>';
        } else if (total >= 3000000) {
            rankBadge = '<span class="rank-badge rank-gold"><i class="fa-solid fa-crown"></i> Vàng</span>';
        } else if (total >= 1000000) {
            rankBadge = '<span class="rank-badge rank-silver"><i class="fa-solid fa-medal"></i> Bạc</span>';
        } else {
            rankBadge = '<span class="rank-badge rank-bronze"><i class="fa-solid fa-shield"></i> Đồng</span>';
        }

        html += `
            <tr>
                <td>${rankBadge}</td>
                <td><b>${c.name}</b></td>
                <td>${c.phone}</td>
                <td>${c.count} đơn</td>
                <td style="color:#db2777; font-weight:bold">${formatMoney(c.totalSpent)}</td>
            </tr>
        `;
    });
    document.getElementById('customerTableBody').innerHTML = html || '<tr><td colspan="5" align="center">Chưa có dữ liệu khách hàng</td></tr>';
}

// 5. QUẢN LÝ SẢN PHẨM
function renderProducts() {
    let html = '';
    hoaTuoi.forEach((p, index) => {
        // Ưu tiên hiện giá khuyến mãi
        let displayPrice = p.salePrice ? 
            `<span style="text-decoration:line-through; color:gray; font-size:12px">${formatMoney(p.price)}</span> <br> ${formatMoney(p.salePrice)}` : 
            formatMoney(p.price);

        html += `
            <tr>
                <td><img src="${p.image}" width="50" style="border-radius:5px"></td>
                <td><b>${p.name}</b></td>
                <td>${formatMoney(p.price)}</td>
                <td style="color:#db2777; font-weight:bold">${displayPrice}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteProduct(${index})"><i class="fa-solid fa-trash"></i> Xóa</button>
                </td>
            </tr>
        `;
    });
    document.getElementById('productTableBody').innerHTML = html;
}

async function addProduct() {
    let name = document.getElementById('newProdName').value;
    let price = document.getElementById('newProdPrice').value;
    let fileInput = document.getElementById('newProdImgFile');
    let statusText = document.getElementById('uploadStatus');

    if (!name || !price) {
        alert("Vui lòng nhập tên và giá!");
        return;
    }

    let imageUrl = 'images/hoahong.jpg';

    // 1. Kiểm tra xem có file ảnh không
    if (fileInput.files.length > 0) {
        statusText.innerText = "Đang upload ảnh lên Cloud... Vui lòng đợi...";
        let file = fileInput.files[0];
        let formData = new FormData();
        formData.append("file", file);

        try {
            // 2. Gửi file lên Server Java
            let response = await fetch('/api/products/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                let data = await response.json();
                imageUrl = data.url; // 3. Lấy link ảnh từ Cloudinary
                statusText.innerText = "Upload thành công!";
            } else {
                alert("Lỗi upload ảnh!");
                statusText.innerText = "";
                return;
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi kết nối server!");
            return;
        }
    }

    // 4. Lưu sản phẩm vào mảng
    hoaTuoi.unshift({
        id: Date.now(),
        name: name,
        price: parseInt(price),
        image: imageUrl 
    });
    
    renderProducts();
    closeModal();
    
    // Reset form
    document.getElementById('newProdName').value = "";
    document.getElementById('newProdPrice').value = "";
    document.getElementById('newProdImgFile').value = "";
    statusText.innerText = "";
    
    showNotification("Đã thêm sản phẩm mới thành công!", false);
}

function deleteProduct(index) {
    if(confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
        hoaTuoi.splice(index, 1); // Xóa khỏi mảng
        renderProducts(); // Vẽ lại bảng
    }
}
function updateStatus(orderId, selectElement) {
    const newStatus = selectElement.value;
    
    // Hiệu ứng loading nhẹ
    selectElement.disabled = true;

    fetch(`/api/orders/${orderId}/status?status=${newStatus}`, {
        method: 'PUT'
    })
    .then(response => {
        if (response.ok) {
            // 1. Thông báo thành công
            showNotification(`Đã cập nhật đơn #${orderId} sang trạng thái: ${newStatus}`, false);
            
            // 2. Cập nhật màu sắc cái ô select ngay lập tức cho đẹp
            selectElement.className = 'form-control status-select'; // Reset class
            
            // Map màu lại
            const statusColors = {
                'MOI_TAO': 'badge-primary',
                'DANG_GIAO': 'badge-warning',
                'HOAN_THANH': 'badge-success',
                'DA_HUY': 'badge-danger'
            };
            selectElement.classList.add(statusColors[newStatus] || 'badge-secondary');

        } else {
            showNotification("Lỗi: Không thể cập nhật trạng thái!");
            // Nếu lỗi, reset lại giá trị cũ
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification("Lỗi kết nối server!");
    })
    .finally(() => {
        selectElement.disabled = false; // Mở lại cho chọn tiếp
    });
}

// Modal Logic
function openModal() { document.getElementById('productModal').style.display = 'flex'; }
function closeModal() { document.getElementById('productModal').style.display = 'none'; }

function filterOrders() {
    let text = document.getElementById('searchInput').value.toLowerCase();
    let filtered = allOrders.filter(o => (o.customerName && o.customerName.toLowerCase().includes(text)) || (o.phone && o.phone.includes(text)));
    renderOrders(filtered);
}

function printOrder(orderId) {
    // 1. Tìm thông tin đơn hàng trong mảng allOrders
    // Lưu ý: orderId từ nút bấm là số, nên so sánh == hoặc ép kiểu
    const order = allOrders.find(o => o.id == orderId);
    
    if (!order) {
        alert("Không tìm thấy thông tin đơn hàng!");
        return;
    }

    // 2. Tạo nội dung hóa đơn
    const invoiceContent = `
        <html>
        <head>
            <title>Hóa Đơn #${orderId}</title>
            <style>
                body { font-family: 'Courier New', Courier, monospace; width: 300px; margin: 0 auto; padding: 10px; color: #000; }
                .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
                .shop-name { font-size: 18px; font-weight: bold; text-transform: uppercase; }
                .info { font-size: 12px; margin-bottom: 5px; }
                .row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px; }
                .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 14px; text-align: right; }
                .footer { text-align: center; margin-top: 20px; font-size: 11px; font-style: italic; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="shop-name">Tiệm Hoa TMT</div>
                <div>ĐC: 670/32 Đoàn Văn Bơ Phường 16 Quận 4 TP.HCM</div>
                <div>Hotline: 0932.013.424</div>
            </div>
            
            <div class="info">Số HD: <strong>#${order.id}</strong></div>
            <div class="info">Ngày: ${new Date().toLocaleString('vi-VN')}</div>
            <div class="info">Khách: ${order.customerName}</div>
            <div class="info">SĐT: ${order.phone}</div>
            <div class="info">Đ/C: ${order.address}</div>
            
            <div style="border-bottom: 1px dashed #000; margin: 10px 0;"></div>
            
            <div class="row">
                <span>Nội dung</span>
                <span>Thành tiền</span>
            </div>
            <div class="row" style="font-weight:bold">
                <span>Đơn hàng hoa tươi</span>
                <span>${formatMoney(order.totalAmount)}</span>
            </div>
            
            <div style="font-size:11px; font-style:italic; margin-top:5px">
                Ghi chú: "${order.note || 'Không có'}"
            </div>

            <div class="total">
                TỔNG CỘNG: ${formatMoney(order.totalAmount)}
            </div>

            <div class="footer">
                Cảm ơn quý khách đã ủng hộ!<br>
                Hẹn gặp lại lần sau.
            </div>
        </body>
        </html>
    `;

    // 3. Mở cửa sổ in
    const printWindow = window.open('', '', 'height=600,width=400');
    
    // 4. Ghi nội dung vào cửa sổ đó
    printWindow.document.write(invoiceContent);
    printWindow.document.close(); // Đóng luồng ghi dữ liệu
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        //printWindow.close();
    }, 500);
}

// --- KHỞI ĐỘNG ---
loadOrders();
renderProducts(); 
setInterval(loadOrders, 3000); // Cập nhật đơn mỗi 3s