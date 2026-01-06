package com.tmt.tiem_hoa_tuoi.repository;

import com.tmt.tiem_hoa_tuoi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Tìm user bằng tên đăng nhập (dùng khi login)
    User findByUsername(String username);
    
    // Kiểm tra xem email đã tồn tại chưa (dùng khi đăng ký)
    boolean existsByEmail(String email);
    
    // Kiểm tra username tồn tại chưa
    boolean existsByUsername(String username);
}