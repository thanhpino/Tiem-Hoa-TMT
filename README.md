# 🌸 Tiệm Hoa TMT - Nền Tảng Thương Mại Điện Tử Hoa Tươi

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

> **Live Demo:** [https://tiem-hoa-tmt.onrender.com](https://tiem-hoa-tmt.onrender.com)  
> **Admin Dashboard:** [https://tiem-hoa-tmt.onrender.com/admin.html](https://tiem-hoa-tmt.onrender.com/admin.html)

---

## 📖 Giới Thiệu

**Tiệm Hoa TMT** là một dự án Full-stack Web Application chuyên cung cấp giải pháp đặt mua hoa tươi trực tuyến. Dự án tập trung vào trải nghiệm người dùng mượt mà, tích hợp thanh toán điện tử hiện đại và hệ thống quản trị (Admin Dashboard) thông minh với khả năng phân tích dữ liệu khách hàng.

Dự án được xây dựng theo kiến trúc **RESTful API**, sử dụng **Spring Boot** làm lõi, deployed trên nền tảng Cloud sử dụng **Docker Container**.

---

## 🚀 Tính Năng Nổi Bật (Key Features)

### 🛒 Dành Cho Khách Hàng (Storefront)
* **Catalog Sản Phẩm:** Duyệt danh sách các loại hoa tươi với hình ảnh trực quan, thông tin ý nghĩa từng loại hoa.
* **Giỏ Hàng Thông Minh:** Thêm/sửa/xóa sản phẩm, tự động tính tổng tiền.
* **Thanh Toán Đa Dạng:**
    * 💵 **COD:** Thanh toán khi nhận hàng.
    * 💳 **PayPal:** Tích hợp cổng thanh toán quốc tế (Sandbox mode).
    * 📱 **MoMo/ZaloPay:** Mô phỏng thanh toán qua QR Code.

### 🛡️ Dành Cho Quản Trị Viên (Admin Dashboard)
* **Real-time Analytics:** Thống kê tổng đơn hàng, doanh thu dự kiến và thời gian cập nhật theo thời gian thực (Auto-refresh mỗi 10s).
* **Quản Lý Đơn Hàng:** Xem chi tiết đơn hàng, trạng thái xử lý, tìm kiếm đơn hàng theo tên hoặc số điện thoại.
* **Quản Lý Kho (Demo):** Giao diện thêm/xóa sản phẩm trực quan ngay trên trình duyệt.
* **🥇 Hệ Thống Loyalty (VIP):** Thuật toán tự động phân hạng khách hàng dựa trên tổng chi tiêu:
    * 🥉 **Đồng:** < 1.000.000đ
    * 🥈 **Bạc:** 1.000.000đ - 3.000.000đ
    * 🥇 **Vàng:** 3.000.000đ - 10.000.000đ
    * 💎 **Bạch Kim:** > 10.000.000đ

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Lĩnh Vực | Công Nghệ |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.x, Spring Data JPA, Spring Security |
| **Database** | MySQL 8.0 (Hosted on Aiven Cloud) |
| **Frontend** | HTML5, CSS3 (Custom & FontAwesome), JavaScript (ES6+, Fetch API) |
| **DevOps** | Docker, Docker Compose, Maven |
| **Deployment** | Render Cloud (Web Service), GitHub Actions (CI/CD) |
| **Payment** | PayPal REST SDK |

---

## 📂 Cấu Trúc Dự Án

TIEM-HOA-TUOI
├── src/main/java/com/tmt/tiem_hoa_tuoi
│   ├── config       # Cấu hình bảo mật (SecurityConfig), CORS
│   ├── controller   # REST APIs (OrderController, PayPalController)
│   ├── entity       # JPA Entities (FlowerOrder mapping với DB)
│   ├── repository   # Giao tiếp Database (OrderRepository)
│   └── service      # Logic nghiệp vụ
├── src/main/resources
│   ├── static       # Frontend (HTML, CSS, JS, Images)
│   │   ├── admin.html      # Trang quản trị
│   │   ├── index.html      # Trang chủ
│   │   └── thanhtoan.html  # Trang thanh toán
│   └── application.properties # Cấu hình Server & Database
├── Dockerfile       # Cấu hình đóng gói Container
├── compose.yaml     # Cấu hình Docker Compose
└── pom.xml          # Quản lý thư viện Maven