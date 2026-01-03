package com.tmt.tiem_hoa_tuoi.controller;

import com.tmt.tiem_hoa_tuoi.entity.FlowerOrder;
import com.tmt.tiem_hoa_tuoi.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    // API nhận đơn hàng
    @PostMapping("/create")
    public FlowerOrder createOrder(@RequestBody FlowerOrder order) {
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("MOI_TAO");
        return orderRepository.save(order);
    }
    // API lấy tất cả đơn hàng, sắp xếp đơn mới nhất lên đầu
    @GetMapping("/all")
    public List<FlowerOrder> getAllOrders() {
        // Sắp xếp đơn mới nhất lên đầu theo id giảm dần
        return orderRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
    }
}