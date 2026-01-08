package com.tmt.tiem_hoa_tuoi.controller;

import com.tmt.tiem_hoa_tuoi.entity.FlowerOrder;
import com.tmt.tiem_hoa_tuoi.entity.User; 
import com.tmt.tiem_hoa_tuoi.repository.OrderRepository;
import com.tmt.tiem_hoa_tuoi.repository.UserRepository;
import com.tmt.tiem_hoa_tuoi.service.EmailService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.tmt.tiem_hoa_tuoi.service.CloudinaryService;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import com.tmt.tiem_hoa_tuoi.dto.OrderRequest;
import com.tmt.tiem_hoa_tuoi.entity.OrderDetail;
import com.tmt.tiem_hoa_tuoi.entity.Product;
import com.tmt.tiem_hoa_tuoi.repository.ProductRepository;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;

    // API NHẬN ĐơN HÀNG
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(
            @RequestBody OrderRequest request, 
            HttpSession session,
            Authentication authentication) { 
        
        try {
            // 1. Tạo đơn hàng tổng
            FlowerOrder order = new FlowerOrder();
            order.setCustomerName(request.getCustomerName());
            order.setPhone(request.getPhone());
            order.setAddress(request.getAddress());
            order.setEmail(request.getEmail());
            order.setNote(request.getNote());
            order.setOrderDate(LocalDateTime.now());
            order.setStatus("MOI_TAO");

            // 2. Gắn User nếu có đăng nhập
            if (authentication != null && authentication.isAuthenticated()) {
                String username = authentication.getName();
                User currentUser = userRepository.findByUsername(username);
                
                if (currentUser != null) {
                    order.setUser(currentUser);
                    System.out.println("✅ Đơn hàng đã gắn với User: " + currentUser.getUsername() + " (ID: " + currentUser.getId() + ")");
                } else {
                    System.out.println("⚠️ Không tìm thấy User: " + username);
                }
            } else {
                System.out.println("⚠️ Người dùng chưa đăng nhập - Đơn hàng không gắn User!");
            }

            // 3. Xử lý chi tiết đơn hàng
            List<OrderDetail> details = new ArrayList<>();
            double calculatedTotal = 0;

            if (request.getCart() != null) {
                for (OrderRequest.CartItemDTO item : request.getCart()) {
                    Product product = productRepository.findById(item.getId()).orElse(null);
                    
                    if (product != null) {
                        OrderDetail detail = new OrderDetail();
                        detail.setProduct(product);
                        detail.setQuantity(item.getQuantity());
                        
                        double finalPrice = (product.getSalePrice() != null) 
                            ? product.getSalePrice() 
                            : product.getPrice();
                        detail.setPrice(finalPrice);
                        
                        detail.setFlowerOrder(order);
                        details.add(detail);
                        calculatedTotal += finalPrice * item.getQuantity();
                    }
                }
            }

            order.setOrderDetails(details);
            order.setTotalAmount(calculatedTotal);

            // 5. Lưu vào Database
            FlowerOrder savedOrder = orderRepository.save(order);

            // 6. Gửi email xác nhận
            String emailToSend = (savedOrder.getEmail() != null && !savedOrder.getEmail().isEmpty()) 
                               ? savedOrder.getEmail() 
                               : "tt3145539@gmail.com";
            emailService.sendOrderConfirmation(emailToSend, savedOrder);

            return ResponseEntity.ok(Map.of(
                "message", "Đặt hàng thành công!", 
                "orderId", savedOrder.getId()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi tạo đơn hàng: " + e.getMessage());
        }
    }

    // API lấy tất cả đơn hàng
    @GetMapping("/all")
    public List<FlowerOrder> getAllOrders() {
        return orderRepository.findAll(
            org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.DESC, "id"
            )
        );
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

    // Map chứa danh sách mã giảm giá
    private static final Map<String, Double> VOUCHERS = new HashMap<>();
    static {
        VOUCHERS.put("TMT2024", 0.1);
        VOUCHERS.put("FREESHIP", 30000.0);
        VOUCHERS.put("SV50", 50000.0);
    }

    // API Check mã giảm giá
    @GetMapping("/voucher")
    public ResponseEntity<?> checkVoucher(@RequestParam String code, @RequestParam Double totalAmount) {
        String upperCode = code.toUpperCase();

        if (VOUCHERS.containsKey(upperCode)) {
            double discountValue = VOUCHERS.get(upperCode);
            double discountAmount = 0;

            if (discountValue < 1) {
                discountAmount = totalAmount * discountValue;
            } else {
                discountAmount = discountValue;
            }

            if (discountAmount > totalAmount) {
                discountAmount = totalAmount;
            }

            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("discount", discountAmount);
            response.put("message", "Áp dụng mã " + upperCode + " thành công!");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(
                Map.of("valid", false, "message", "Mã giảm giá không tồn tại!")
            );
        }
    }

    // API GỬI ĐÁNH GIÁ
    @PostMapping("/{id}/review")
    public ResponseEntity<?> submitReview(
            @PathVariable Long id,
            @RequestParam("rating") Integer rating,
            @RequestParam("comment") String comment,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        Optional<FlowerOrder> orderOptional = orderRepository.findById(id);
        
        if (orderOptional.isPresent()) {
            FlowerOrder order = orderOptional.get();

            if (!"HOAN_THANH".equals(order.getStatus())) {
                return ResponseEntity.badRequest().body("Đơn hàng chưa hoàn thành, không thể đánh giá!");
            }

            order.setRating(rating);
            order.setReviewComment(comment);

            if (file != null && !file.isEmpty()) {
                try {
                    String imageUrl = cloudinaryService.uploadImage(file);
                    order.setReviewImage(imageUrl);
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body("Lỗi upload ảnh: " + e.getMessage());
                }
            }

            orderRepository.save(order);
            return ResponseEntity.ok(Map.of("message", "Cảm ơn bạn đã đánh giá!"));
        } else {
            return ResponseEntity.status(404).body("Không tìm thấy đơn hàng!");
        }
    }

    // API lấy chi tiết đơn hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long id) {
        Optional<FlowerOrder> order = orderRepository.findById(id);
        if (order.isPresent()) {
            return ResponseEntity.ok(order.get());
        } else {
            return ResponseEntity.status(404).body("Không tìm thấy đơn hàng");
        }
    }
}