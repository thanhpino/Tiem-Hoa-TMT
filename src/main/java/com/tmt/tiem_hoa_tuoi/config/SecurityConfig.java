package com.tmt.tiem_hoa_tuoi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Tắt CSRF để test API cho dễ
            .authorizeHttpRequests((requests) -> requests
                .requestMatchers("/", "/index.html", "/css/**", "/js/**", "/images/**", "/api/orders/create").permitAll() 
                .requestMatchers("/admin.html", "/api/orders/all").authenticated() // Trang Admin và API xem đơn
            )
            .formLogin((form) -> form
                .permitAll() 
                .defaultSuccessUrl("/admin.html", true) // Đăng nhập xong thì bay vào trang admin
            )
            .logout((logout) -> logout.permitAll());

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // Tạo tài khoản Admin
        UserDetails admin = User.builder()
            .username("Thanh")
            .password("{noop}Thanhdz123") // <--- Đổi mật khẩu
            .roles("ADMIN")
            .build();

        return new InMemoryUserDetailsManager(admin);
    }
}