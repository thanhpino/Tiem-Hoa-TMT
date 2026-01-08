package com.tmt.tiem_hoa_tuoi.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Products") // Lưu vào bảng Products
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "nvarchar(255)")
    private String name; // Tên hoa

    private Double price; // Giá gốc
    
    private Double salePrice; // Giá khuyến mãi

    @Column(columnDefinition = "text")
    private String image; // Link ảnh
    
    @Column(columnDefinition = "nvarchar(500)") 
    private String meaning; // Ý nghĩa hoa
}