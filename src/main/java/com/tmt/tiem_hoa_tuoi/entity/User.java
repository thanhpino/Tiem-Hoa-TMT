    package com.tmt.tiem_hoa_tuoi.entity;

    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import java.util.List;

    @Entity
    @Data // Lombok
    @NoArgsConstructor
    @AllArgsConstructor
    @Table(name = "users")
    public class User {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(unique = true, nullable = false)
        private String username; // Tên đăng nhập

        @Column(nullable = false)
        private String password; // Mật khẩu

        @Column(unique = true, nullable = false)
        private String email;    // Email

        private String fullName;
        private String phoneNumber;
        private String address;

        private String role; // Lưu quyền: "ROLE_USER" hoặc "ROLE_ADMIN"

        // Mối quan hệ: Một User có thể có nhiều đơn hàng (FlowerOrder)
        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
        private List<FlowerOrder> orders;
    }

