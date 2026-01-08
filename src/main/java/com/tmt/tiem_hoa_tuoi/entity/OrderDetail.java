package com.tmt.tiem_hoa_tuoi.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Order_Details")
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity; // Số lượng mua
    private Double price;     // Giá tại thời điểm mua

    // Liên kết với Sản phẩm
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // Liên kết với Đơn hàng
    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore // Ngăn chặn vòng lặp vô tận khi chuyển sang JSON
    private FlowerOrder flowerOrder;
}