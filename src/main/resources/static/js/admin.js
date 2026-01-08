/* src/main/resources/static/js/admin.js */

// --- 1. DỮ LIỆU CŨ  ---
const OLD_DATA_BACKUP = [
    { name: 'Hoa Hồng Đỏ', price: 550000, salePrice: 490000, image: 'images/hoahong.jpg', meaning: 'Biểu tượng của tình yêu nồng cháy.' },
    { name: 'Hoa Ly Trắng', price: 480000, image: 'images/hoaly.jpg', meaning: 'Tượng trưng cho sự trong trắng, đức hạnh.' },
    { name: 'Hoa Hướng Dương', price: 450000, image: 'images/hoahuongduong.jpg', meaning: 'Mang ý nghĩa về sự lạc quan, niềm tin.' },
    { name: 'Hoa Cẩm Tú Cầu', price: 620000, image: 'images/camtucau.jpg', meaning: 'Thể hiện lòng biết ơn chân thành.' },
    { name: 'Tulip Hà Lan', price: 750000, image: 'images/tulip.jpg', meaning: 'Tượng trưng cho sự giàu có, nổi tiếng.' },
    { name: 'Hoa Cúc Tana', price: 400000, image: 'images/cuctana.jpg', meaning: 'Nhỏ xinh, mộc mạc, tình yêu thuở ban đầu.' },
    { name: 'Hoa Baby Trắng', price: 380000, salePrice: 290000, image: 'images/hoababy.jpg', meaning: 'Biểu tượng của tình yêu tinh khiết.' },
    { name: 'Lan Hồ Điệp', price: 1200000, salePrice: 1000000, image: 'images/lanhodiep.jpg', meaning: 'Sang trọng và quý phái.' },
    { name: 'Mẫu Đơn Hồng', price: 850000, image: 'images/maudon.jpg', meaning: 'Biểu tượng cho sự thịnh vượng, sắc đẹp.' },
    { name: 'Oải Hương Khô', price: 420000, image: 'images/oaihuong.jpg', meaning: 'Sự tinh khiết, nhẹ nhàng và tận tâm.' },
    { name: 'Cẩm Chướng', price: 390000, salePrice: 290000, image: 'images/camchuong.jpg', meaning: 'Niềm tự hào, sắc đẹp và sự ái mộ.' },
    { name: 'Cúc Họa Mi', price: 350000, image: 'images/cuchoami.jpg', meaning: 'Tình yêu thầm lặng, sự trong trắng.' },
    { name: 'Hoa Sen Trắng', price: 500000, image: 'images/hoasen.jpg', meaning: 'Sự thanh cao, thuần khiết.' },
    { name: 'Cát Tường', price: 460000, image: 'images/cattuong.jpg', meaning: 'May mắn, viên mãn và hạnh phúc.' },
    { name: 'Thạch Thảo Tím', price: 370000, image: 'images/thachthao.jpg', meaning: 'Tình yêu chung thủy, nhớ nhung.' },
    { name: 'Hoa Rum', price: 580000, image: 'images/rum.jpg', meaning: 'Sự thanh lịch, độc đáo.' },
    { name: 'Đồng Tiền', price: 410000, image: 'images/dongtien.jpg', meaning: 'Hạnh phúc, tươi vui và tài lộc.' },
    { name: 'Salem Tím', price: 360000, image: 'images/salem.jpg', meaning: 'Sự trường tồn và nỗi nhớ.' },
    { name: 'Mõm Sói', price: 430000, image: 'images/momsoi.jpg', meaning: 'Sức mạnh, sự duyên dáng.' },
    { name: 'Thủy Tiên Trắng', price: 490000, image: 'images/thuytien.jpg', meaning: 'Sự tái sinh, khởi đầu mới.' }
];

// --- BIẾN TOÀN CỤC ---
let allOrders = [];
let allProducts = []; 
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
    if (isSound) {
        const sound = document.getElementById('notification-sound');
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Chặn âm thanh"));
        }
    }
    const container = document.getElementById('toast-container');
    if (!container) return; 

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
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 4. Tải dữ liệu đơn hàng
async function loadOrders() {
    try {
        let res = await fetch(`/api/orders/all?t=${new Date().getTime()}`);
        if (res.ok) {
            allOrders = await res.json();
            renderOrders(allOrders);
            processCustomerData(allOrders); 
            drawChart(allOrders);
            renderTopProducts(); 
        
            if (allOrders.length > previousOrderCount && previousOrderCount !== 0) {
                let newCount = allOrders.length - previousOrderCount;
                showNotification(`Bạn vừa có ${newCount} đơn hàng mới! 🚀`);
            }
            previousOrderCount = allOrders.length;

            // Tổng quan
            let total = allOrders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
            document.getElementById('totalRevenue').innerText = formatMoney(total);
            document.getElementById('totalOrders').innerText = allOrders.length;
            document.getElementById('lastUpdated').innerText = new Date().toLocaleTimeString('vi-VN');
        }
    } catch (err) { 
        console.error(err); 
    } finally {
        // TỰ GỌI LẠI CHÍNH NÓ SAU 5 GIÂY
        setTimeout(loadOrders, 5000); 
    }
}

function formatDateVN(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
    }); 
}

function renderOrders(orders) {
    let html = '';
    const statusColors = {
        'MOI_TAO': 'badge-primary',
        'DA_THANH_TOAN': 'badge-paid-online',
        'DANG_GIAO': 'badge-warning',
        'HOAN_THANH': 'badge-success',
        'DA_HUY': 'badge-danger'
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
                    <div style="font-size:13px; margin-bottom: 4px;">${order.address}</div>
                    <div style="font-size:12px; color:#64748b; font-style:italic; border-left: 2px solid #cbd5e1; padding-left: 6px;">
                        "${order.note || 'Không có ghi chú'}"
                    </div>
                    ${order.rating ? `
                        <div style="margin-top: 8px; background: #fffbeb; border: 1px solid #fcd34d; border-radius: 6px; padding: 8px;">
                            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 4px;">
                                <span style="color: #d97706; font-weight: bold; font-size: 13px;">${order.rating} ⭐</span>
                                <span style="font-size: 10px; text-transform: uppercase; color: #92400e; font-weight: bold; background: #fde68a; padding: 2px 6px; border-radius: 4px;">Review</span>
                            </div>
                            <div style="font-size: 12px; color: #4b5563; font-style: italic;">"${order.reviewComment || ''}"</div>
                            ${order.reviewImage ? `<div style="margin-top: 5px;"><a href="${order.reviewImage}" target="_blank" style="font-size:11px; color:#2563eb; text-decoration:underline;"><i class="fa-solid fa-image"></i> Xem ảnh feedback</a></div>` : ''}
                        </div>
                    ` : ''}
                </td>
                <td style="color:var(--primary-color); font-weight:700">${formatMoney(order.totalAmount)}</td>
                <td style="font-size:13px; font-weight:600">${timeVN}</td>
                <td>
                    <select class="form-control status-select ${currentColor}" onchange="updateStatus(${order.id}, this)">
                        <option value="MOI_TAO" ${safeStatus === 'MOI_TAO' ? 'selected' : ''}>Mới Tạo</option>
                        <option value="DA_THANH_TOAN" ${safeStatus === 'DA_THANH_TOAN' ? 'selected' : ''}>Đã Thanh Toán</option>
                        <option value="DANG_GIAO" ${safeStatus === 'DANG_GIAO' ? 'selected' : ''}>Đang Giao</option>
                        <option value="HOAN_THANH" ${safeStatus === 'HOAN_THANH' ? 'selected' : ''}>Hoàn Thành</option>
                        <option value="DA_HUY" ${safeStatus === 'DA_HUY' ? 'selected' : ''}>Đã Hủy</option>
                    </select>
                </td>
                <td>
                    <div style="display:flex; gap:5px; align-items:center">
                        <button class="btn" style="background:#e2e8f0; padding:5px 10px;" onclick="printOrder(${order.id})"><i class="fa-solid fa-print"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
    const tableBody = document.getElementById('orderTableBody');
    if (tableBody) tableBody.innerHTML = html || '<tr><td colspan="7" align="center" style="padding:20px; color:gray">Chưa có đơn hàng nào</td></tr>';
}

function updateStatus(orderId, selectElement) {
    const newStatus = selectElement.value;
    selectElement.disabled = true;
    fetch(`/api/orders/${orderId}/status?status=${newStatus}`, { method: 'PUT' })
    .then(response => {
        if (response.ok) {
            showNotification(`Đã cập nhật đơn #${orderId} sang trạng thái: ${newStatus}`, false);
            selectElement.className = 'form-control status-select';
            const statusColors = { 'MOI_TAO': 'badge-primary', 'DANG_GIAO': 'badge-warning', 'HOAN_THANH': 'badge-success', 'DA_HUY': 'badge-danger', 'DA_THANH_TOAN': 'badge-paid-online' };
            selectElement.classList.add(statusColors[newStatus] || 'badge-secondary');
        } else {
            showNotification("Lỗi: Không thể cập nhật trạng thái!");
        }
    })
    .catch(error => { console.error('Error:', error); showNotification("Lỗi kết nối server!"); })
    .finally(() => { selectElement.disabled = false; });
}

// 5. QUẢN LÝ SẢN PHẨM

// HÀM FETCH 
async function fetchProducts() {
    try {
        let res = await fetch('/api/products/all');
        if (res.ok) {
            allProducts = await res.json();
            
            // CHỈ IMPORT 1 LẦN DUY NHẤT
            if (allProducts.length === 0) {
                console.log("Admin: DB trống, đang import dữ liệu mẫu...");
                await importSampleData(); 
                return; // Kết thúc hàm để đợi dữ liệu mới
            }
            
            renderProducts(allProducts);
            renderTopProducts(); 
        }
    } catch (e) {
        console.error("Lỗi tải sản phẩm:", e);
    }
}

// HÀM IMPORT DỮ LIỆU MẪU
async function importSampleData() {
    let count = 0;
    // Show thông báo cho admin biết
    showNotification("Hệ thống đang khởi tạo dữ liệu...", false);
    
    for (const p of OLD_DATA_BACKUP) {
        try {
            await fetch('/api/products/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(p)
            });
            count++;
        } catch (e) {
            console.error("Lỗi import:", p.name);
        }
    }
    showNotification(`Đã khôi phục ${count} sản phẩm!`, false);
    
    // Tải lại trang để hiện dữ liệu
    // setTimeout(() => {
    //     window.location.reload();
    // }, 1500);
    await fetchProducts();
}

function renderProducts(products) {
    let html = '';
    products.forEach((p) => {
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
                    <button class="btn btn-danger" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i> Xóa</button>
                </td>
            </tr>
        `;
    });
    const body = document.getElementById('productTableBody');
    if(body) body.innerHTML = html || '<tr><td colspan="5" align="center">Chưa có sản phẩm nào</td></tr>';
}

async function addProduct() {
    let name = document.getElementById('newProdName').value;
    let price = document.getElementById('newProdPrice').value;
    let meaning = document.getElementById('newProdMeaning').value;
    let fileInput = document.getElementById('newProdImgFile');
    let statusText = document.getElementById('uploadStatus');

    if (!name || !price) {
        alert("Vui lòng nhập tên và giá!");
        return;
    }

    let imageUrl = 'images/hoahong.jpg'; 

    if (fileInput.files.length > 0) {
        statusText.innerText = "Đang upload ảnh lên...";
        let file = fileInput.files[0];
        let formData = new FormData();
        formData.append("file", file);

        try {
            let response = await fetch('/api/products/upload', { method: 'POST', body: formData });
            if (response.ok) {
                let data = await response.json();
                imageUrl = data.url; 
                statusText.innerText = "Upload ảnh thành công!";
            } else {
                alert("Lỗi upload ảnh!");
                return;
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi kết nối server khi upload ảnh!");
            return;
        }
    }

    try {
        let productData = {
            name: name,
            price: parseFloat(price),
            image: imageUrl,
            meaning: meaning
        };

        let createRes = await fetch('/api/products/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        if (createRes.ok) {
            showNotification("Đã lưu sản phẩm!", false);
            fetchProducts(); 
            closeModal();
            document.getElementById('newProdName').value = "";  
            document.getElementById('newProdPrice').value = "";
            document.getElementById('newProdMeaning').value = "";
            document.getElementById('newProdImgFile').value = "";
            statusText.innerText = "";
        } else {
            alert("Lỗi khi lưu sản phẩm!");
        }
    } catch (e) {
        console.error(e);
        alert("Lỗi kết nối server!");
    }
}

async function deleteProduct(id) {
    if(confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
        try {
            let res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                showNotification("Đã xóa sản phẩm thành công!", false);
                fetchProducts(); 
            } else {
                alert("Không thể xóa sản phẩm này.");
            }
        } catch (e) {
            console.error(e);
            alert("Lỗi kết nối!");
        }
    }
}

// --- CÁC HÀM TIỆN ÍCH KHÁC ---
function processCustomerData(orders) {
    let customers = {};
    orders.forEach(order => {
        let phone = order.phone;
        if (!phone) return;
        if (!customers[phone]) {
            customers[phone] = { name: order.customerName, phone: phone, count: 0, totalSpent: 0 };
        }
        customers[phone].count += 1;
        customers[phone].totalSpent += order.totalAmount || 0;
    });
    let sortedCustomers = Object.values(customers).sort((a, b) => b.totalSpent - a.totalSpent);
    let html = '';
    sortedCustomers.forEach(c => {
        let rankBadge = '';
        let total = c.totalSpent;
        if (total >= 10000000) rankBadge = '<span class="rank-badge rank-diamond"><i class="fa-solid fa-gem"></i> Bạch Kim</span>';
        else if (total >= 3000000) rankBadge = '<span class="rank-badge rank-gold"><i class="fa-solid fa-crown"></i> Vàng</span>';
        else if (total >= 1000000) rankBadge = '<span class="rank-badge rank-silver"><i class="fa-solid fa-medal"></i> Bạc</span>';
        else rankBadge = '<span class="rank-badge rank-bronze"><i class="fa-solid fa-shield"></i> Đồng</span>';

        html += `<tr><td>${rankBadge}</td><td><b>${c.name}</b></td><td>${c.phone}</td><td>${c.count} đơn</td><td style="color:#db2777; font-weight:bold">${formatMoney(c.totalSpent)}</td></tr>`;
    });
    document.getElementById('customerTableBody').innerHTML = html || '<tr><td colspan="5" align="center">Chưa có dữ liệu khách hàng</td></tr>';
}

function openModal() { document.getElementById('productModal').style.display = 'flex'; }
function closeModal() { document.getElementById('productModal').style.display = 'none'; }

function filterOrders() {
    let text = document.getElementById('searchInput').value.toLowerCase();
    let filtered = allOrders.filter(o => (o.customerName && o.customerName.toLowerCase().includes(text)) || (o.phone && o.phone.includes(text)));
    renderOrders(filtered);
}

function printOrder(orderId) {
    // Tìm đơn hàng trong mảng đã load
    const order = allOrders.find(o => o.id == orderId);
    
    if (!order) {
        alert("Không tìm thấy thông tin đơn hàng!");
        return;
    }

    // Xử lý danh sách sản phẩm (An toàn hơn)
    let itemsHtml = '';
    if (order.orderDetails && order.orderDetails.length > 0) {
        itemsHtml = order.orderDetails.map(item => {
            // Check xem sản phẩm còn tồn tại không
            let productName = item.product ? item.product.name : "Sản phẩm đã bị xóa";
            let lineTotal = item.price * item.quantity;
            
            return `
                <div class="row">
                    <span style="flex: 1;">${productName} <small>(x${item.quantity})</small></span>
                    <span style="font-weight: bold;">${formatMoney(lineTotal)}</span>
                </div>
            `;
        }).join('');
    } else {
        itemsHtml = '<div class="row" style="color:red; font-style:italic;"><span>(Chi tiết đơn chưa cập nhật)</span><span>-</span></div>';
    }

    // Nội dung hóa đơn
    const invoiceContent = `
        <html>
        <head>
            <title>Hóa Đơn #${orderId}</title>
            <style>
                body { font-family: 'Courier New', Courier, monospace; width: 100%; max-width: 350px; margin: 0 auto; padding: 20px; color: #000; }
                .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 15px; margin-bottom: 15px; }
                .shop-name { font-size: 22px; font-weight: 900; text-transform: uppercase; margin-bottom: 5px; }
                .info-row { display: flex; font-size: 13px; margin-bottom: 4px; }
                .label { width: 70px; font-weight: bold; color: #555; }
                .value { flex: 1; }
                .divider { border-bottom: 1px dashed #999; margin: 15px 0; }
                .row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
                .total { border-top: 2px solid #000; margin-top: 15px; padding-top: 10px; font-weight: 900; font-size: 16px; text-align: right; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; font-style: italic; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="shop-name">Tiệm Hoa TMT</div>
                <div>ĐC: 670/32 Đoàn Văn Bơ, Q.4, TP.HCM</div>
                <div>Hotline: 0932.013.424</div>
            </div>
            
            <div class="info-row"><span class="label">Số HD:</span> <span class="value">#${order.id}</span></div>
            <div class="info-row"><span class="label">Ngày:</span> <span class="value">${new Date().toLocaleString('vi-VN')}</span></div>
            <div class="info-row"><span class="label">Khách:</span> <span class="value">${order.customerName}</span></div>
            <div class="info-row"><span class="label">SĐT:</span> <span class="value">${order.phone}</span></div>
            <div class="info-row"><span class="label">Đ/C:</span> <span class="value">${order.address}</span></div>
            <div class="info-row"><span class="label">Ghi chú:</span> <span class="value" style="font-style:italic;">${order.note || 'Không'}</span></div>
            
            <div class="divider"></div>
            <div class="row" style="font-weight:bold; text-transform:uppercase; font-size:11px; color:#555;">
                <span>Tên Sản Phẩm (SL)</span>
                <span>Thành tiền</span>
            </div>
            <div style="border-bottom: 1px solid #eee; margin-bottom: 10px;"></div>

            ${itemsHtml}
            
            <div class="total">
                TỔNG CỘNG: ${formatMoney(order.totalAmount)}
            </div>

            <div class="footer">
                Cảm ơn quý khách đã ủng hộ!<br>
                Hẹn gặp lại lần sau. ❤️
            </div>
        </body>
        </html>
    `;

    const printWindow = window.open('', '', 'height=700,width=500');
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
    }, 500);
}

// --- 6. VẼ BIỂU ĐỒ ---
let myChart = null; 
function drawChart(orders) {
    const ctx = document.getElementById('revenueChart');
    if(!ctx) return;
    const ctx2d = ctx.getContext('2d');
    let labels = [];
    let dataRevenue = [];
    for (let i = 6; i >= 0; i--) {
        let d = new Date(); d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('vi-VN'));
        dataRevenue.push(0);
    }
    orders.forEach(order => {
        if (order.status === 'DA_THANH_TOAN' || order.status === 'HOAN_THANH') {
            let orderDate = new Date(order.orderDate).toLocaleDateString('vi-VN');
            let index = labels.indexOf(orderDate);
            if (index !== -1) dataRevenue[index] += order.totalAmount;
        }
    });
    if (myChart) myChart.destroy();
    myChart = new Chart(ctx2d, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Doanh Thu (VNĐ)',
                data: dataRevenue,
                borderColor: '#db2777',
                backgroundColor: 'rgba(219, 39, 119, 0.1)',
                borderWidth: 3, tension: 0.4, fill: true,
                pointBackgroundColor: '#fff', pointBorderColor: '#db2777', pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(context) { return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.raw); } } } },
            scales: { y: { beginAtZero: true, grid: { borderDash: [5, 5] } }, x: { grid: { display: false } } }
        }
    });
}

function renderTopProducts() {
    if (allProducts.length === 0) return;
    
    let sortedProducts = [...allProducts]
        .map(p => ({ ...p, sold: Math.floor(Math.random() * 50) + 10 }))
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5);

    let html = '';
    sortedProducts.forEach((p, index) => {
        let color = index === 0 ? '#fbbf24' : (index === 1 ? '#94a3b8' : (index === 2 ? '#b45309' : '#e2e8f0'));
        let badge = index < 3 ? `<i class="fa-solid fa-trophy" style="color:${color}"></i>` : `<span style="font-weight:bold; color:gray">#${index + 1}</span>`;
        html += `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 18px; width: 25px; text-align: center;">${badge}</div>
                <img src="${p.image}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 13px; color: #334155;">${p.name}</div>
                    <div style="font-size: 11px; color: #64748b;">Đã bán: <b>${p.sold}</b> bó</div>
                </div>
                <div style="font-weight: bold; color: #db2777; font-size: 13px;">${formatMoney(p.price)}</div>
            </div>
        `;
    });
    const listContainer = document.getElementById('topProductsList');
    if(listContainer) listContainer.innerHTML = html;
}

// --- KHỞI ĐỘNG ---
fetchProducts(); 
loadOrders();
// setInterval(loadOrders, 3000);
// refreshInterval = setInterval(loadOrders, 30000);
// clearInterval(refreshInterval);