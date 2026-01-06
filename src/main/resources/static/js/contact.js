/* src/main/resources/static/js/contact.js */
document.addEventListener('DOMContentLoaded', () => {
    const contactModal = document.getElementById('contact-modal');
    const contactBtn = document.getElementById('contact-button');

    // 1. Hàm đóng modal
    window.closeContactModal = () => {
        if (contactModal) {
            contactModal.classList.add('hidden');
        }
    };

    // 2. Hàm mở modal
    const openContactModal = () => {
        if (contactModal) {
            contactModal.classList.remove('hidden');
        }
    };

    // 3. Gắn sự kiện click cho nút tròn xanh
    if (contactBtn) {
        contactBtn.addEventListener('click', openContactModal);
    }

    // 4. Click ra vùng đen bên ngoài thì tự đóng
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                window.closeContactModal();
            }
        });
    }
});