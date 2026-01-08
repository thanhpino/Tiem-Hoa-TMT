/* src/main/resources/static/js/chatbot.js */
document.addEventListener('DOMContentLoaded', () => {
    // --- KHAI BÁO BIẾN ---
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatWidget = document.getElementById('chat-widget');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const messagesBox = document.getElementById('chat-messages');
    const suggestionsBox = document.getElementById('chat-suggestions');

    // Dữ liệu Gợi ý
    const suggestionTags = [
        "🌸 Tặng sinh nhật", "❤️ Tặng người yêu", "💰 Dưới 500k", 
        "🍀 Hoa may mắn", "🏆 Hoa nào đẹp?", "🚛 Phí ship bao nhiêu?"
    ];

    // --- LOGIC CHỨC NĂNG ---
    // 1. Toggle Chat & Render Gợi ý
    const toggleChat = () => {
        const isHidden = chatWidget.classList.contains('hidden');
        if (isHidden) {
            chatWidget.classList.remove('hidden');
            setTimeout(() => chatWidget.classList.remove('scale-95', 'opacity-0'), 10);
            chatInput.focus();
            renderSuggestions();
        } else {
            chatWidget.classList.add('scale-95', 'opacity-0');
            setTimeout(() => chatWidget.classList.add('hidden'), 300);
        }
    };

    // 2. Hàm vẽ các nút gợi ý
    const renderSuggestions = () => {
        if(suggestionsBox) {
            suggestionsBox.innerHTML = suggestionTags.map(tag => `
                <button onclick="handleSuggestionClick('${tag}')" 
                    class="inline-block px-3 py-1 bg-white border border-pink-200 text-pink-600 text-xs rounded-full hover:bg-pink-500 hover:text-white transition-colors shadow-sm">
                    ${tag}
                </button>
            `).join('');
        }
    };
    // 3. Xử lý khi bấm nút gợi ý
    window.handleSuggestionClick = (text) => {
        chatInput.value = text;
        handleUserChat();
    };
    // 4. Hàm hiển thị tin nhắn
    const addMessage = (text, sender, product = null) => {
        const div = document.createElement('div');
        div.className = `flex gap-3 ${sender === 'user' ? 'flex-row-reverse' : ''} items-start animate-fade-up`;
        div.style.animationDuration = "0.3s";

        let avatar = sender === 'bot' 
            ? `<div class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 flex-shrink-0"><i data-lucide="bot" class="w-5 h-5"></i></div>`
            : `<div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0"><i data-lucide="user" class="w-5 h-5"></i></div>`;
            
        let bubbleClass = sender === 'bot' 
            ? 'bg-white text-gray-700 rounded-tl-none border border-gray-100' 
            : 'bg-pink-500 text-white rounded-tr-none';

        let contentHtml = `<div class="flex flex-col gap-2 max-w-[85%]">
            <div class="${bubbleClass} p-3 rounded-2xl shadow-sm text-sm">
                <p>${text}</p>
            </div>`;

        if (product) {
            // Lấy hàm từ scope toàn cục
            const price = product.salePrice || product.price;
            contentHtml += `
            <div class="bg-white border border-pink-100 rounded-xl overflow-hidden shadow-md group cursor-pointer hover:shadow-lg transition-all w-full" onclick="addToCart(${product.id})">
                <div class="h-24 overflow-hidden relative">
                    <img src="${product.image}" class="w-full h-full object-cover">
                </div>
                <div class="p-2">
                    <p class="font-bold text-xs text-gray-800 truncate">${product.name}</p>
                    <p class="text-gray-500 text-[10px] line-clamp-2 mb-1 h-8 overflow-hidden">${product.meaning}</p>
                    <div class="flex justify-between items-center">
                        <p class="text-pink-600 font-bold text-xs">${formatCurrency(price)}</p>
                        <span class="bg-pink-50 text-pink-600 text-[10px] px-2 py-1 rounded font-semibold hover:bg-pink-100">Mua ngay</span>
                    </div>
                </div>
            </div>`;
        }

        contentHtml += `</div>`;
        div.innerHTML = sender === 'user' ? (contentHtml + avatar) : (avatar + contentHtml);
        messagesBox.appendChild(div);
        messagesBox.scrollTop = messagesBox.scrollHeight;
        
        if(typeof lucide !== 'undefined') lucide.createIcons();
    };

    // 5. BỘ NÃO AI
    const analyzeIntentAndRespond = (inputText) => {
        const text = inputText.toLowerCase();

        // A. Câu hỏi thường gặp
        if (text.includes('chào') || text.includes('hello') || text.includes('hi ')) {
            return { text: "Chào bạn! TMT Florist đây ạ. Bạn cần tư vấn hoa cho dịp nào? (Sinh nhật, Khai trương, hay tặng Người thương?)" };
        }
        if (text.includes('ship') || text.includes('giao hàng') || text.includes('vận chuyển')) {
            return { text: "Bên mình Freeship nội thành cho đơn từ 500k nhé! Giao hàng siêu tốc trong 2h ạ. 🚀" };
        }
        if (text.includes('liên hệ') || text.includes('địa chỉ') || text.includes('sđt')) {
            return { text: "Hotline: 0932.013.424 📞. Shop ở 670/32 Đoàn Văn Bơ Phường 16 Quận 4 TP.HCM bạn nhé!" };
        }

        // B. Phân tích Ngân sách
        const numbers = text.match(/\d+/g);
        let budget = null;
        if (numbers) {
            let rawNum = parseInt(numbers.sort((a,b) => b.length - a.length)[0]); 
            budget = rawNum < 10000 ? rawNum * 1000 : rawNum; 
        }

        // C. Thuật toán Quét & Chấm điểm
        let bestMatch = null;
        let maxScore = 0;

        // Lưu ý: hoaTuoi là biến toàn cục được nạp từ server
        if (typeof hoaTuoi !== 'undefined') {
            hoaTuoi.forEach(p => {
                let score = 0;
                // Ghép tên và ý nghĩa để tìm kiếm
                const content = (p.name + " " + p.meaning).toLowerCase();

                // 1. Chấm điểm theo từ khóa
                if (text.includes('hi')) score += 1;
                
                // Dịp: Sinh nhật
                if (text.includes('sinh nhật') && (content.includes('hồng') || content.includes('hướng dương') || content.includes('cẩm chướng') || content.includes('baby'))) score += 3;
                
                // Dịp: Tình yêu / Tỏ tình / Valentine
                if ((text.includes('yêu') || text.includes('tỏ tình') || text.includes('valentine')) && (content.includes('hồng') || content.includes('đỏ') || content.includes('tình yêu'))) score += 7;
                
                // Đối tượng: Mẹ
                if (text.includes('mẹ') && (content.includes('ly') || content.includes('cẩm tú') || content.includes('sen') || content.includes('biết ơn'))) score += 5;
                
                // Dịp: Khai trương / Tài lộc
                if (text.includes('khai trương') && (content.includes('hướng dương') || content.includes('đồng tiền') || content.includes('lan'))) score += 5;
                if ((text.includes('lộc') || text.includes('phát') || text.includes('tài')) && (content.includes('đồng tiền') || content.includes('may mắn') || content.includes('thịnh vượng'))) score += 4;

                // Dịp: Chia buồn
                if (text.includes('buồn') || text.includes('chia buồn')) score += (content.includes('trắng') || content.includes('cúc')) ? 5 : -5;
                
                // Chủ đề: May mắn / Cảm ơn
                if (text.includes('may mắn')) score += (content.includes('cát tường') || content.includes('đồng tiền') || content.includes('tài lộc')) ? 5 : 0;
                if (text.includes('cảm ơn')) score += (content.includes('cẩm tú cầu') || content.includes('biết ơn')) ? 5 : 0;
                
                // Dịp: Giáng sinh
                if (text.includes('giáng sinh') && (content.includes('hồng') || content.includes('tulip') || content.includes('lan'))) score += 4;

                // Mức giá & Loại hoa
                if (text.includes('sang trọng') && (content.includes('lan') || content.includes('hồ điệp') || content.includes('tulip'))) score += 5;
                if (text.includes('best seller') || text.includes('bán chạy')) score += 3;
                if (text.includes('giá rẻ') || text.includes('bình dân')) score += 2;

                // --- LOGIC QUAN HỆ CỤ THỂ
                // Tặng Mẹ
                if ((text.includes('tặng mẹ') || text.includes('sinh nhật mẹ')) && (content.includes('ly') || content.includes('cẩm tú cầu') || content.includes('sen'))) score += 7;
                
                // Tặng Bạn Bè / Đồng Nghiệp
                if ((text.includes('bạn bè') || text.includes('đồng nghiệp')) && (content.includes('cúc') || content.includes('baby') || content.includes('cẩm chướng'))) score += 5;
                
                // Tặng Sếp
                if (text.includes('sếp') && (content.includes('lan') || content.includes('hồ điệp') || content.includes('tulip'))) score += 6;
                
                // Tặng Thầy Cô
                if (text.includes('thầy') || text.includes('cô') || text.includes('giáo viên')) score += (content.includes('cẩm tú cầu') || content.includes('cúc')) ? 6 : 0;
                
                // Tặng Người Yêu / Vợ / Bạn Gái
                if ((text.includes('bạn gái') || text.includes('vợ') || text.includes('người yêu')) && (content.includes('hồng') || content.includes('ly') || content.includes('tình yêu'))) score += 9;
                
                // Tặng Chồng / Bạn Trai / Con Trai
                if ((text.includes('bạn trai') || text.includes('chồng') || text.includes('con trai')) && (content.includes('hướng dương') || content.includes('đồng tiền') || content.includes('cát tường'))) score += 7;

                // Tặng Con Gái
                if (text.includes('con gái') && (content.includes('hồng') || content.includes('baby'))) score += 5;

                // Tặng Sếp Nữ
                if ((text.includes('sếp nữ') || text.includes('nữ sếp')) && (content.includes('lan') || content.includes('hồ điệp') || content.includes('cẩm tú cầu'))) score += 7;

                // Tặng Sếp Nam
                if ((text.includes('sếp nam') || text.includes('nam sếp')) && (content.includes('hướng dương') || content.includes('đồng tiền') || content.includes('cát tường'))) score += 6;

                // Tặng Bạn Thân
                if (text.includes('bạn thân') && (content.includes('baby') || content.includes('cẩm chướng') || content.includes('cúc'))) score += 6;
                
                
                // 2. Chấm điểm nếu tên hoa trùng khớp trực tiếp
                if (text.includes(p.name.toLowerCase())) score += 10; 

                // 3. Lọc theo giá
                if (budget) {
                    const price = p.salePrice || p.price;
                    if (price <= budget) score += 3; // Cộng điểm nếu trong tầm giá
                    else score -= 100; // Trừ nặng nếu vượt ngân sách
                }

                // Lưu sản phẩm có điểm cao nhất
                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = p;
                }
            });
        }

        // D. Trả kết quả
        if (bestMatch && maxScore > 0) {
            const templates = [
                `Mình tìm thấy bó <strong>${bestMatch.name}</strong> này cực hợp với ý bạn nè!`,
                `Theo nhu cầu của bạn thì mẫu này là "Best Choice":`,
                `Mẫu này đang được yêu thích lắm, ý nghĩa lại rất phù hợp:`,
            ];
            const randomIntro = templates[Math.floor(Math.random() * templates.length)];
            return { text: randomIntro, product: bestMatch };
        }

        // E. Fallback
        if (budget && typeof hoaTuoi !== 'undefined') {
            // Tìm sản phẩm rẻ nhất trong tầm giá
            const cheapProduct = hoaTuoi.find(p => (p.salePrice || p.price) <= budget);
            if (cheapProduct) return { text: `Với ngân sách ${formatCurrency(budget)} mình có mẫu này xinh lắm:`, product: cheapProduct };
        }

        const fallbackProduct = (typeof hoaTuoi !== 'undefined') ? hoaTuoi[Math.floor(Math.random() * hoaTuoi.length)] : null;
        return { 
            text: "Câu này khó với mình quá 😅. Nhưng bạn có muốn xem thử mẫu hoa 'Best Seller' của tiệm không?", 
            product: fallbackProduct 
        };
    };

    // 6. Xử lý sự kiện gửi tin
    const handleUserChat = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatInput.value = '';
        
        // Hiệu ứng đang nhập...
        const loadingId = 'typing-' + Date.now();
        const loadingHtml = `<div id="${loadingId}" class="flex gap-3"><div class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-500"><i data-lucide="bot" class="w-5 h-5"></i></div><div class="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 text-sm text-gray-400 italic">Đang suy nghĩ...</div></div>`;
        messagesBox.insertAdjacentHTML('beforeend', loadingHtml);
        messagesBox.scrollTop = messagesBox.scrollHeight;
        if(typeof lucide !== 'undefined') lucide.createIcons();

        // Trả lời sau 2s
        setTimeout(() => {
            const loadingEl = document.getElementById(loadingId);
            if(loadingEl) loadingEl.remove();
            
            const response = analyzeIntentAndRespond(text);
            addMessage(response.text, 'bot', response.product);
        }, 2000);
    };

    // --- INIT EVENTS ---
    if(chatToggleBtn) chatToggleBtn.addEventListener('click', toggleChat);
    if(closeChatBtn) closeChatBtn.addEventListener('click', toggleChat);
    if(chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleUserChat(); });
    if(sendBtn) sendBtn.addEventListener('click', handleUserChat);
});