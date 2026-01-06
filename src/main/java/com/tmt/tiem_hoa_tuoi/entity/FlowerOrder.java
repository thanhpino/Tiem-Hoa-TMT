package com.tmt.tiem_hoa_tuoi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor; // Thêm dòng này
import lombok.NoArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor  
@AllArgsConstructor
@Table(name = "Flower_Orders")
public class FlowerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", columnDefinition = "nvarchar(255)")
    private String customerName; // Tên khách hàng
    
    private String phone;        // SĐT

    @Column(columnDefinition = "nvarchar(255)")
    private String address;      // Địa chỉ

    @Column(columnDefinition = "nvarchar(255)")
    private String email;      // Địa chỉ Email

    @Column(columnDefinition = "nvarchar(255)")
    private String note;         // Ghi chú
    private Double totalAmount;  // Tổng tiền
    private String status;       // Trạng thái đơn

    private LocalDateTime orderDate; // Ngày đặt

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore // Tạo cột khóa ngoại user_id trong bảng Flower_Orders
    private User user;
}