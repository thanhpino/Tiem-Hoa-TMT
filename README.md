# 🌸 Tiệm Hoa TMT - Hệ Thống Thương Mại Điện Tử Hoa Tươi

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## 📖 Giới Thiệu

**Tiệm Hoa TMT** là giải pháp E-commerce trọn gói được xây dựng với kiến trúc Monolithic hiện đại. Dự án không chỉ là website bán hàng mà là một hệ thống quản lý vận hành khép kín từ khâu đặt hàng, thanh toán quốc tế, chăm sóc khách hàng tự động (AI Chatbot) đến quản lý kho và logistic.

> **Điểm nhấn:** Hệ thống tập trung vào trải nghiệm người dùng Real-time và tính năng tương tác cao (Đánh giá, Chatbot, Email Marketing).

---

## 📸 Giao Diện & Tính Năng

### 1. Phân Hệ Khách Hàng (Storefront)

| Trang Chủ & AI Chatbot | Chi Tiết Đơn Hàng (Modal) |
| :---: | :---: |
| ![Home](src/main/resources/static/images/H1.png) | ![Order Detail](src/main/resources/static/images/H2.png) |
| *Bot tư vấn theo ngữ cảnh, gợi ý sản phẩm* | *Xem lại lịch sử, chi tiết từng món hàng* |

| Đánh Giá & Review | Thanh Toán & Checkout |
| :---: | :---: |
| ![Review](src/main/resources/static/images/H5.png) | ![Checkout](src/main/resources/static/images/H3.png) |
| *Rating 5 sao, upload ảnh thực tế* | *Tích hợp PayPal, QR Code, COD* |

### 2. Phân Hệ Quản Trị (Admin Dashboard)

| Tổng Quan & Real-time | Quản Lý Đơn & In Hóa Đơn |
| :---: | :---: |
| ![Dashboard](src/main/resources/static/images/H6.png) | ![Invoice](src/main/resources/static/images/H7.png) |
| *Biểu đồ doanh thu, cập nhật đơn mới 3s/lần* | *Xuất hóa đơn bán lẻ chuyên nghiệp* |

---

## 🚀 (Feature List)

### 👤 1. Dành Cho Khách Hàng (Customer)
* **🔐 Authentication:** Đăng ký/Đăng nhập bảo mật, mã hóa mật khẩu BCrypt.
* **🛒 Giỏ Hàng Thông Minh:** Lưu trữ LocalStorage, tự động tính tổng tiền, thêm/sửa/xóa mượt mà.
* **💳 Thanh Toán Đa Kênh:**
    * **PayPal:** Tích hợp cổng thanh toán quốc tế.
    * **Chuyển khoản:** Quét mã QR tự động điền nội dung.
    * **COD:** Thanh toán khi nhận hàng.
* **👤 Quản Lý Cá Nhân (User Profile):**
    * Chỉnh sửa thông tin cá nhân (Tên, SĐT, Địa chỉ).
    * **Lịch sử đơn hàng:** Xem danh sách đơn đã đặt, trạng thái đơn (Mới tạo, Đang giao...).
    * **Xem chi tiết:** Modal hiển thị rõ ràng từng sản phẩm trong đơn hàng cũ.
* **⭐ Hệ Thống Đánh Giá (Review System):**
    * Cho phép đánh giá sao (1-5) cho đơn hàng đã hoàn thành.
    * Viết bình luận và **Upload ảnh thực tế** lên Cloudinary.
* **🤖 Trợ Lý Ảo AI:** Chatbot tư vấn chọn hoa theo dịp (Sinh nhật, Tỏ tình) và ngân sách.

### 🛡️ 2. Dành Cho Quản Trị Viên (Admin)
* **📊 Dashboard Real-time:**
    * Tự động đổ chuông thông báo khi có đơn hàng mới (không cần F5).
    * Biểu đồ doanh thu trực quan.
* **📦 Quản Lý Sản Phẩm:**
    * Thêm/Sửa/Xóa hoa tươi.
    * Upload ảnh sản phẩm trực tiếp lên Cloudinary.
* **📝 Quản Lý Đơn Hàng:**
    * Cập nhật trạng thái đơn hàng (Đồng bộ ngay lập tức sang phía khách).
    * **In hóa đơn:** Tạo phiếu in hóa đơn chi tiết chỉ với 1 click.
    * Xem phản hồi/đánh giá từ khách hàng.

### 📧 3. Hệ Thống Tự Động (Automation)
* **Email Marketing:** Gửi Email xác nhận đơn hàng chuẩn HTML (kèm danh sách sản phẩm, tổng tiền) ngay khi đặt hàng thành công.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Backend
* **Core:** Java 21, Spring Boot 3.x
* **Security:** Spring Security (Phân quyền User/Admin).
* **Database:** MySQL (Production trên Aiven Cloud), JPA/Hibernate.
* **Services:** * `JavaMailSender` .
    * `Cloudinary SDK` .
    * `PayPal SDK`.

### Frontend
* **Template Engine:** Thymeleaf.
* **Styling:** TailwindCSS, FontAwesome, Google Fonts.
* **Logic:** Vanilla JavaScript.
* **Icons:** Lucide Icons.

### DevOps & Deployment
* **Docker:** Đóng gói ứng dụng (Dockerfile).
* **Render:** Nền tảng Deploy ứng dụng.
* **Maven:** Quản lý phụ thuộc.

---

## ⚙️ Hướng Dẫn Cài Đặt (Setup Guide)

### 1. Yêu Cầu
* JDK 21+
* Maven
* MySQL Workbench

### 2. Cấu Hình Biến Môi Trường
Tạo file `.env` hoặc cấu hình trong IDE với các thông số sau:

```properties
# Database
DB_URL=jdbc:mysql://localhost:3306/FlowerShopDB
DB_USER=root
DB_PASSWORD=your_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret

# Clone dự án
git clone [https://github.com/thanhpino/tiem-hoa-tmt.git](https://github.com/thanhpino/tiem-hoa-tmt.git)

# Build dự án
mvn clean install

# Chạy
mvn spring-boot:run

👨‍💻 Tác Giả
Trương Minh Thành

Sinh viên Kỹ Thuật Phần Mềm - TDTU(2)

Đam mê: DevOps, Full-stack Java.
Email: tt3145539@gmail.com
GitHub: thanhpino
Project made with ❤️, lots of coffee and bugs fixing. ☕🐛