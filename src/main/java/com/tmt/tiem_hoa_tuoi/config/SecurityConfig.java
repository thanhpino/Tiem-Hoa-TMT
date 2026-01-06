package com.tmt.tiem_hoa_tuoi.config;

import com.tmt.tiem_hoa_tuoi.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        // Sử dụng Constructor rỗng và Setters để tránh lỗi phiên bản
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        
        return provider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) 
            .authorizeHttpRequests(auth -> auth
                // 1. Cho phép tài nguyên tĩnh (CSS, JS, Ảnh...)
                .requestMatchers("/css/**", "/js/**", "/images/**", "/asset/**", "/api/**").permitAll()
                
                // 2. Cho phép Trang chủ 
                .requestMatchers("/", "/index", "/thanhtoan").permitAll()
                
                // 3. Cho phép Login/Register
                .requestMatchers("/login", "/register", "/generate-password").permitAll()
                
                // 4. Trang Admin
                .requestMatchers("/admin").hasRole("ADMIN")
                
                // 5. Các trang cá nhân bắt buộc đăng nhập
                .requestMatchers("/profile").authenticated()
                
                // 6. Còn lại chặn hết
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login") 
                .loginProcessingUrl("/perform_login")
                
                .defaultSuccessUrl("/index", true) 
                
                .failureUrl("/login?error=true")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                // Đăng xuất xong về trang chủ "/"
                .logoutSuccessUrl("/index")
                .permitAll()
            );

        return http.build();
    }
}