package com.tmt.tiem_hoa_tuoi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor; // Thêm dòng này
import lombok.NoArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

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
    private String note;         // Ghi chú
    private Double totalAmount;  // Tổng tiền
    private String status;       // Trạng thái đơn

    private LocalDateTime orderDate; // Ngày đặt
}