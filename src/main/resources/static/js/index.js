/* src/main/resources/static/js/index.js */

// --- 1. DỮ LIỆU CŨ ---
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

// --- 2. BIẾN TOÀN CỤC ---
let hoaTuoi = []; // Mảng này chứa dữ liệu tải từ Database
const bodyBackgrounds = [
    'https://www.toptal.com/designers/subtlepatterns/uploads/watercolor.png', 
    'https://images.pexels.com/photos/2079438/pexels-photo-2079438.jpeg?auto=compress&cs=tinysrgb&w=1920', 
    'https://images.pexels.com/photos/39517/rose-flower-blossom-bloom-39517.jpeg?auto=compress&cs=tinysrgb&w=1920' 
];
const bannerBackgrounds = [
    'https://images.unsplash.com/photo-1490750967868-53cbaa379091?q=80&w=2000', 
    'https://images.pexels.com/photos/1166869/pexels-photo-1166869.jpeg?auto=compress&cs=tinysrgb&w=1920', 
    'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=1920', 
    'https://images.pexels.com/photos/796620/pexels-photo-796620.jpeg?auto=compress&cs=tinysrgb&w=1920' 
];

let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
const saveCart = () => localStorage.setItem('shoppingCart', JSON.stringify(cart));
const formatCurrency = (number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number).replace('₫', 'đ');

// --- 3. CÁC HÀM XỬ LÝ ---

const setRandomBackgrounds = () => {
    const randomBodyBg = bodyBackgrounds[Math.floor(Math.random() * bodyBackgrounds.length)];
    document.body.style.backgroundImage = `url('${randomBodyBg}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed'; 

    const heroImg = document.getElementById('hero-image');
    if (heroImg) {
        const randomBannerBg = bannerBackgrounds[Math.floor(Math.random() * bannerBackgrounds.length)];
        heroImg.src = randomBannerBg; 
    }
};

// Load sản phẩm từ Database
async function fetchProducts() {
    try {
        const response = await fetch('/api/products/all');
        if (response.ok) {
            hoaTuoi = await response.json();
            
            // Nếu DB trống gợi ý Import
            if (hoaTuoi.length === 0) {
                console.log("Database đang trống. Đang tự động import dữ liệu mẫu...");
                await importSampleData(); // Tự động import
            } else {
                renderProducts(); // Vẽ giao diện
            }
        }
    } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
    }
}

// Tự động nhập 20 sản phẩm mẫu vào DB
async function importSampleData() {
    let count = 0;
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
    console.log(`Đã import thành công ${count} sản phẩm!`);
    window.location.reload();
}

const renderProducts = () => {
    const productGrid = document.getElementById('product-grid');
    if(!productGrid) return;

    if (hoaTuoi.length === 0) {
        productGrid.innerHTML = '<p class="text-center w-full text-gray-500">Đang tải sản phẩm...</p>';
        return;
    }

    productGrid.innerHTML = hoaTuoi.map(product => {
        const priceHTML = product.salePrice
            ? `<div>
                    <span class="text-lg font-bold text-red-500">${formatCurrency(product.salePrice)}</span>
                    <span class="text-sm text-gray-400 line-through ml-2">${formatCurrency(product.price)}</span>
                </div>`
            : `<span class="text-lg font-bold text-gray-800">${formatCurrency(product.price)}</span>`;
        
        return `
        <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div class="overflow-hidden relative h-64">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover product-image-zoom">
                <div class="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all"></div>
                <button onclick="addToCart(${product.id})" class="absolute bottom-4 right-4 bg-white text-pink-600 p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-pink-600 hover:text-white">
                    <i data-lucide="shopping-bag" class="w-5 h-5"></i>
                </button>
            </div>
            <div class="p-5">
                <h3 class="text-lg font-bold text-gray-800 mb-1 group-hover:text-pink-600 transition-colors">${product.name}</h3>
                <p class="text-gray-500 text-sm mb-3 line-clamp-1">${product.meaning || 'Loài hoa xinh đẹp'}</p>
                <div class="flex justify-between items-end">
                    ${priceHTML}
                </div>
            </div>
        </div>`;
    }).join('');
    lucide.createIcons();
};

const renderCart = () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');

    if(!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        if(emptyCartMessage) emptyCartMessage.style.display = 'block';
        if(checkoutButton) {
            checkoutButton.disabled = true;
            checkoutButton.classList.add('bg-gray-400', 'cursor-not-allowed');
            checkoutButton.classList.remove('bg-gray-800', 'hover:bg-gray-900');
        }
    } else {
        if(emptyCartMessage) emptyCartMessage.style.display = 'none';
        if(checkoutButton) {
            checkoutButton.disabled = false;
            checkoutButton.classList.remove('bg-gray-400', 'cursor-not-allowed');
            checkoutButton.classList.add('bg-gray-800', 'hover:bg-gray-900');
        }
        
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex items-center gap-3 bg-gray-50 p-2 rounded-xl animate-fade-up" style="animation-duration: 0.3s">
                <img src="${item.image}" class="w-12 h-12 object-cover rounded-lg">
                <div class="flex-1">
                    <p class="font-bold text-sm text-gray-800 line-clamp-1">${item.name}</p>
                    <p class="text-xs text-pink-600 font-bold">${formatCurrency(item.price)}</p>
                </div>
                <div class="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                    <button onclick="updateQuantity(${item.cartId}, -1)" class="w-6 h-6 hover:bg-gray-100 rounded text-gray-600 flex items-center justify-center">-</button>
                    <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.cartId}, 1)" class="w-6 h-6 hover:bg-gray-100 rounded text-gray-600 flex items-center justify-center">+</button>
                </div>
            </div>`).join('');
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if(totalPriceElement) totalPriceElement.textContent = formatCurrency(total);
};

// Gán vào window để HTML gọi được
window.updateQuantity = (cartId, change) => {
    const cartItem = cart.find(item => item.cartId === cartId);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.cartId !== cartId);
        }
    }
    saveCart();
    renderCart();
};

window.addToCart = (productId, customName = null) => {
    // Tìm sản phẩm trong mảng hoaTuoi
    const product = hoaTuoi.find(p => p.id === productId);
    
    if (!product) {
        console.error("Không tìm thấy sản phẩm ID:", productId);
        return;
    }

    const priceToAdd = product.salePrice || product.price;
    const finalName = customName || product.name;

    const cartItem = customName ? null : cart.find(item => item.id === productId && !item.customName);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ 
            ...product, 
            price: priceToAdd, 
            quantity: 1, 
            name: finalName,
            customName: !!customName, 
            cartId: Date.now() 
        });
    }
    saveCart();
    renderCart();
    
    // Hiệu ứng rung nhẹ giỏ hàng
    const cartIcon = document.querySelector('.lucide-shopping-cart');
    if(cartIcon) {
        cartIcon.parentElement.classList.add('animate-bounce');
        setTimeout(() => cartIcon.parentElement.classList.remove('animate-bounce'), 1000);
    }
};

// --- MAIN: CHẠY KHI DOM LOAD XONG ---
document.addEventListener('DOMContentLoaded', () => {
    setRandomBackgrounds();
    
    // Gọi fetchProducts
    fetchProducts(); 
    
    renderCart();
    
    const checkoutBtn = document.getElementById('checkout-button');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                localStorage.setItem('shoppingCart', JSON.stringify(cart));
                window.location.href = '/thanhtoan';
            }
        });
    }
});