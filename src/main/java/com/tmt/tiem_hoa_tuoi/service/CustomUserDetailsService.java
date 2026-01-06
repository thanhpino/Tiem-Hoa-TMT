package com.tmt.tiem_hoa_tuoi.service;

import com.tmt.tiem_hoa_tuoi.entity.User;
import com.tmt.tiem_hoa_tuoi.repository.UserRepository;

import org.jspecify.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsPasswordService;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService, UserDetailsPasswordService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Tìm user trong Database
        User user = userRepository.findByUsername(username);
        
        if (user == null) {
            throw new UsernameNotFoundException("Không tìm thấy user: " + username);
        }

        // 2. Chuyển đổi từ Entity User (của mình) sang UserDetails (của Spring Security)
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(), // `password` đã được mã hóa
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole())) // Lấy quyền
        );
    }

    @Override
    public UserDetails updatePassword(UserDetails arg0, @Nullable String arg1) {
        throw new UnsupportedOperationException("Unimplemented method 'updatePassword'");
    }
}