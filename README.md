# 🌸 Tiệm Hoa TMT - Nền Tảng Thương Mại Điện Tử Hoa Tươi

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

## 📖 Giới Thiệu

**Tiệm Hoa TMT** là một dự án Full-stack Web Application chuyên cung cấp giải pháp đặt mua hoa tươi trực tuyến. Dự án tập trung vào trải nghiệm người dùng mượt mà, tích hợp thanh toán điện tử hiện đại và hệ thống quản trị (Admin Dashboard) thông minh với khả năng phân tích dữ liệu khách hàng.

Dự án được xây dựng theo kiến trúc **RESTful API**, sử dụng **Spring Boot** làm lõi, deployed trên nền tảng Cloud sử dụng **Docker Container**.

> **Customer Main Page :** [https://tiem-hoa-tmt.onrender.com](/src/main/resources/static/images/H1.png)


> **Customer Main Payment :** [https://tiem-hoa-tmt.onrender.com/thanhtoan.html](/src/main/resources/static/images/H2.png)


> **Security Admin Web:** [Username and Password required](/src/main/resources/static/images/H3.png)  


> **Admin Dashboard:** [https://tiem-hoa-tmt.onrender.com/admin.html](/src/main/resources/static/images/H4.png)


> **Add and delete product** [Add and delete here](/src/main/resources/static/images/H5.png)



---

## 🚀 Key Features

### 🤖 1. AI Florist Assistant
* **Tư vấn ngữ nghĩa:** Bot phân tích ý định khách hàng (Tặng mẹ, sinh nhật, ngân sách 500k...) để gợi ý sản phẩm phù hợp nhất.
* **Scoring Algorithm:** Thuật toán chấm điểm sản phẩm dựa trên độ khớp của từ khóa và ý nghĩa loài hoa.
* **Smart Suggestions:** Gợi ý nhanh các mẫu câu hỏi phổ biến.

### 🛒 2. Trải Nghiệm Khách Hàng
* **Giao diện Glassmorphism:** Thiết kế hiện đại, hiệu ứng kính mờ, tương thích mọi thiết bị.
* **Thanh Toán Đa Kênh:** Tích hợp thanh toán **PayPal**, **VietQR**, và COD.
* **Email Automation:** Tự động gửi Email xác nhận đơn hàng chuyên nghiệp ngay sau khi đặt.

### 🛡️ 3. Hệ Thống Quản Trị
* **Quản Lý Kho Cloud:** Upload ảnh sản phẩm trực tiếp từ máy tính lên **Cloudinary**, không lo mất ảnh khi restart server.
* **Xử Lý Đơn Hàng:** Cập nhật trạng thái Real-time, **In hóa đơn** trực tiếp trên trình duyệt.
* **Thống Kê Trực Quan:** Biểu đồ doanh thu, số lượng đơn hàng cập nhật liên tục.
* **🥇 Hệ Thống Loyalty:** Tự động xếp hạng khách hàng (Đồng, Bạc, Vàng, Bạch Kim) dựa trên tổng chi tiêu.

### ⚙️ 4. DevOps & Hạ Tầng
* **Containerization:** Đóng gói ứng dụng bằng **Docker**.
* **CI/CD Pipeline:** Sử dụng **GitHub Actions** để tự động chạy test, build Docker Image và đẩy lên Docker Hub mỗi khi có code mới.
* **Auto Deploy:** Tích hợp Webhook để tự động Deploy phiên bản mới nhất lên **Render Cloud**.

---

## 🛠️ Tech Stack Chi Tiết

| Lĩnh Vực | Công Nghệ |
| :--- | :--- |
| **Backend Core** | Java 21, Spring Boot 3.x, Spring Security |
| **Database** | MySQL (Local Dev) / PostgreSQL (Production on Render/Aiven) |
| **ORM** | Spring Data JPA, Hibernate |
| **Frontend** | HTML5, TailwindCSS, Vanilla JS (No Framework), Lucide Icons |
| **Cloud Storage** | Cloudinary API (Lưu trữ ảnh) |
| **Mail Service** | JavaMailSender (SMTP Gmail) |
| **DevOps** | Docker, Docker Compose, GitHub Actions, Render |

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

## 🗺️ Roadmap & Hướng Phát Triển

* [x] **Giai đoạn 1:** Hoàn thiện Core E-commerce & Admin.

* [x] **Giai đoạn 2:** Tích hợp AI Chatbot & Cloud Storage.

* [x] **Giai đoạn 3:** Thiết lập CI/CD & Deploy Cloud.

* [ ] **Giai đoạn 4 (Next):**
    * Chuyển đổi sang kiến trúc **Microservices**.
    * Viết lại Frontend bằng **ReactJS/NextJS**.
    * Tích hợp Login bằng Google/Facebook (OAuth2).

---


👨‍💻 Tác Giả
Trương Minh Thành * Sinh viên Kỹ Thuật Phần Mềm - Năm 2

Đam mê: Cloud Engineering, DevOps, Java Backend.

GitHub: [github.com/thanhpino](https://github.com/thanhpino)

Email: tt3145539@gmail.com