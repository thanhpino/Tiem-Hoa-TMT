package com.tmt.tiem_hoa_tuoi.controller;

import com.tmt.tiem_hoa_tuoi.entity.FlowerOrder;
import com.tmt.tiem_hoa_tuoi.entity.User; 
import com.tmt.tiem_hoa_tuoi.repository.OrderRepository;
import com.tmt.tiem_hoa_tuoi.repository.UserRepository;
import com.tmt.tiem_hoa_tuoi.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal; // Để lấy thông tin user đang login
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private EmailService emailService;

    // API nhận đơn hàng
    @PostMapping("/create")
    // Thêm Principal để lấy thông tin user đang login
    public FlowerOrder createOrder(@RequestBody FlowerOrder order, Principal principal) {
        
        // 1. GẮN USER VÀO ĐƠN HÀNG
        if (principal != null) {
            String username = principal.getName(); // Lấy tên đăng nhập
            User user = userRepository.findByUsername(username); // Tìm user trong DB
            order.setUser(user); // Gắn user vào đơn hàng
        }

        // 2. Set thông tin mặc định
        order.setOrderDate(LocalDateTime.now());

        order.setStatus("MOI_TAO"); 
        
        // 3. Lưu vào Database
        FlowerOrder savedOrder = orderRepository.save(order);

        // 4. Gửi email
        if (savedOrder.getEmail() != null && !savedOrder.getEmail().isEmpty()) {
            emailService.sendOrderConfirmation(savedOrder.getEmail(), savedOrder);
        } else {
            emailService.sendOrderConfirmation("tt3145539@gmail.com", savedOrder);
        }

        return savedOrder;
    }

    // API lấy tất cả đơn hàng
    @GetMapping("/all")
    public List<FlowerOrder> getAllOrders() {
        return orderRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
    }

    // Cập nhật trạng thái đơn hàng
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<FlowerOrder> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            FlowerOrder order = orderOptional.get();
            order.setStatus(status); 
            orderRepository.save(order);
            return ResponseEntity.ok().body("{\"message\": \"Cập nhật trạng thái thành công!\"}");
        } else {
            return ResponseEntity.status(404).body("{\"message\": \"Không tìm thấy đơn hàng!\"}");
        }
    }
}