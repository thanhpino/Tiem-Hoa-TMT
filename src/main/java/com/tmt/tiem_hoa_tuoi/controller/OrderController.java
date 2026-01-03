package com.tmt.tiem_hoa_tuoi.controller;

import com.tmt.tiem_hoa_tuoi.entity.FlowerOrder;
import com.tmt.tiem_hoa_tuoi.repository.OrderRepository;
import com.tmt.tiem_hoa_tuoi.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private EmailService emailService;

    // API nhận đơn hàng
    @PostMapping("/create")
    public FlowerOrder createOrder(@RequestBody FlowerOrder order) {
        // 1. Set thông tin mặc định
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("MOI_TAO");
        
        // 2. Lưu vào Database trước
        FlowerOrder savedOrder = orderRepository.save(order);

        if (savedOrder.getEmail() != null && !savedOrder.getEmail().isEmpty()) {
        // Gửi về email khách hàng
        emailService.sendOrderConfirmation(savedOrder.getEmail(), savedOrder);
        } else {
            // Gửi về email Admin để báo có đơn
            emailService.sendOrderConfirmation("tt3145539@gmail.com", savedOrder);
        }

        return savedOrder;
    }
    // API lấy tất cả đơn hàng, sắp xếp đơn mới nhất lên đầu
    @GetMapping("/all")
    public List<FlowerOrder> getAllOrders() {
        // Sắp xếp đơn mới nhất lên đầu theo id giảm dần
        return orderRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
    }
    // URL gọi sẽ là: PUT /api/orders/1/status?status=DANG_GIAO
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        // 1. Tìm đơn hàng theo ID
        Optional<FlowerOrder> orderOptional = orderRepository.findById(id);
        if (orderOptional.isPresent()) {
            // 2. Nếu tìm thấy thì cập nhật
            FlowerOrder order = orderOptional.get();
            order.setStatus(status); // Cập nhật trạng thái mới
            orderRepository.save(order); // Lưu lại vào DB

            // 3. Trả về thông báo thành công
            return ResponseEntity.ok().body("{\"message\": \"Cập nhật trạng thái thành công!\"}");
        } else {
            // 4. Nếu không tìm thấy ID thì báo lỗi 404
            return ResponseEntity.status(404).body("{\"message\": \"Không tìm thấy đơn hàng!\"}");
        }
    }
}