package com.tmt.tiem_hoa_tuoi.controller;

import com.tmt.tiem_hoa_tuoi.service.PayPalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class PayPalController {

    @Autowired
    private PayPalService payPalService;

    // API tạo đơn PayPal
    @PostMapping("/create-paypal-order")
    public ResponseEntity<?> createPayPalOrder(@RequestBody Map<String, Object> data) {
        try {
            // Lấy tổng tiền từ frontend gửi lên 
            double amount = 100000; // Mặc định 100k
            
            String orderId = payPalService.createOrder(amount);
            return ResponseEntity.ok(Map.of("id", orderId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi tạo đơn PayPal");
        }
    }

    // API xác nhận thanh toán thành công
    @PostMapping("/capture-paypal-order")
    public ResponseEntity<?> capturePayPalOrder(@RequestBody Map<String, String> data) {
        try {
            String orderId = data.get("orderID");
            boolean completed = payPalService.captureOrder(orderId);
            if (completed) {
                return ResponseEntity.ok(Map.of("status", "COMPLETED", "id", orderId));
            } else {
                return ResponseEntity.badRequest().body("Thanh toán thất bại");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi xử lý thanh toán");
        }
    }
}