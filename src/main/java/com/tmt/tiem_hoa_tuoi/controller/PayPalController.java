package com.tmt.tiem_hoa_tuoi.controller;

import com.tmt.tiem_hoa_tuoi.entity.FlowerOrder;
import com.tmt.tiem_hoa_tuoi.entity.User;
import com.tmt.tiem_hoa_tuoi.repository.OrderRepository;
import com.tmt.tiem_hoa_tuoi.repository.UserRepository;
import com.tmt.tiem_hoa_tuoi.service.EmailService;
import com.tmt.tiem_hoa_tuoi.service.PayPalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PayPalController {

    @Autowired
    private PayPalService payPalService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;

    // API tạo đơn PayPal
    @PostMapping("/create-paypal-order")
    public ResponseEntity<?> createPayPalOrder(@RequestBody Map<String, Object> data) {
        try {
            Double amount = Double.valueOf(data.get("total").toString());
            String orderId = payPalService.createOrder(amount);
            return ResponseEntity.ok(Map.of("id", orderId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi tạo đơn PayPal");
        }
    }

    // API xác nhận thanh toán & Gửi Email
    @PostMapping("/capture-paypal-order")
    public ResponseEntity<?> capturePayPalOrder(@RequestBody Map<String, Object> data, Principal principal) {
        try {
            String orderId = (String) data.get("orderID");
            String emailKhachHang = (String) data.get("email");
            String tenKhachHang = (String) data.get("customerName");
            Double amount = Double.valueOf(data.get("total").toString());
            String diaChi = (String) data.get("address");
            String sdt = (String) data.get("phone");
            
            // NHẬN GHI CHÚ TỪ JS GỬI LÊN
            String noteFromFrontend = (String) data.get("note"); 

            boolean completed = payPalService.captureOrder(orderId);
            
            if (completed) {
                // --- BƯỚC 1: TẠO ĐƠN HÀNG ---
                FlowerOrder order = new FlowerOrder();
                
                if (principal != null) {
                    String username = principal.getName();
                    User user = userRepository.findByUsername(username);
                    if (user != null) {
                        order.setUser(user); 
                    }
                }

                order.setCustomerName(tenKhachHang);
                order.setPhone(sdt);        
                order.setAddress(diaChi);
                order.setTotalAmount(amount); // Lưu giá thực 
                order.setOrderDate(LocalDateTime.now());
                order.setStatus("DA_THANH_TOAN"); 
                
                // Lưu ghi chú kèm mã giao dịch
                String finalNote = (noteFromFrontend != null ? noteFromFrontend : "") + " (Mã GD PayPal: " + orderId + ")";
                order.setNote(finalNote);
                
                order.setEmail(emailKhachHang); 

                FlowerOrder savedOrder = orderRepository.save(order);

                // --- BƯỚC 2: GỬI EMAIL XÁC NHẬN ---
                if (emailKhachHang != null && !emailKhachHang.isEmpty()) {
                    emailService.sendOrderConfirmation(emailKhachHang, savedOrder);
                } else {
                    emailService.sendOrderConfirmation("tt3145539@gmail.com", savedOrder);
                }

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