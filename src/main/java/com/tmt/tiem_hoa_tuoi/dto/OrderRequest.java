package com.tmt.tiem_hoa_tuoi.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    // Thông tin khách hàng
    private String customerName;
    private String phone;
    private String address;
    private String email;
    private String note;
    
    // Danh sách giỏ hàng gửi lên
    private List<CartItemDTO> cart;

    @Data
    public static class CartItemDTO {
        private Long id;       // ID sản phẩm
        private Integer quantity; // Số lượng
    }
}