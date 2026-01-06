    package com.tmt.tiem_hoa_tuoi.controller;

    import com.tmt.tiem_hoa_tuoi.entity.FlowerOrder;
    import com.tmt.tiem_hoa_tuoi.entity.User;
    import com.tmt.tiem_hoa_tuoi.repository.OrderRepository;
    import com.tmt.tiem_hoa_tuoi.repository.UserRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.core.Authentication;
    import org.springframework.stereotype.Controller;
    import org.springframework.ui.Model;
    import org.springframework.web.bind.annotation.GetMapping;

    import java.util.List;

    @Controller
    public class ProfileController {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private OrderRepository orderRepository;

        @GetMapping("/profile")
        public String viewProfile(Model model, Authentication authentication) {
            // 1. Lấy tên người dùng đang đăng nhập
            String username = authentication.getName();
            
            // 2. Tìm User trong DB
            User user = userRepository.findByUsername(username);
            
            // 3. Lấy danh sách đơn hàng của người này
            List<FlowerOrder> myOrders = orderRepository.findByUserOrderByOrderDateDesc(user);
            
            // 4. Gửi dữ liệu sang HTML
            model.addAttribute("user", user);
            model.addAttribute("orders", myOrders);
            
            return "profile"; // Trả về file profile.html
        }
    }