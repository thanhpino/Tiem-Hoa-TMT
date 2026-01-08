package com.tmt.tiem_hoa_tuoi.controller;

import com.tmt.tiem_hoa_tuoi.entity.User;
import com.tmt.tiem_hoa_tuoi.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> data, HttpSession session) {
        // 1. Lấy user từ session hiện tại
        User currentUser = (User) session.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Vui lòng đăng nhập!");
        }

        // 2. Lấy user mới nhất từ DB
        User userInDb = userRepository.findById(currentUser.getId()).orElse(null);
        if (userInDb == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy người dùng!");
        }

        // 3. Cập nhật thông tin mới
        if (data.containsKey("fullName")) userInDb.setFullName(data.get("fullName"));
        if (data.containsKey("phoneNumber")) userInDb.setPhoneNumber(data.get("phone"));
        if (data.containsKey("address")) userInDb.setAddress(data.get("address"));

        // 4. Lưu xuống Database
        User updatedUser = userRepository.save(userInDb);

        // 5. CẬP NHẬT LẠI SESSION
        session.setAttribute("user", updatedUser);

        return ResponseEntity.ok("Cập nhật thành công!");
    }
}