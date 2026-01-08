package com.tmt.tiem_hoa_tuoi.controller;

import com.tmt.tiem_hoa_tuoi.entity.Product;
import com.tmt.tiem_hoa_tuoi.repository.ProductRepository;
import com.tmt.tiem_hoa_tuoi.service.CloudinaryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") 
public class ProductController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private ProductRepository productRepository;

    // 1. LẤY TẤT CẢ SẢN PHẨM
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "id"));
    }

    // 2. THÊM SẢN PHẨM MỚI
    @PostMapping("/create")
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    // 3. XÓA SẢN PHẨM
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Xóa thành công"));
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy sản phẩm"));
        }
    }

    // 4. API UPLOAD ẢNH SẢN PHẨM
    @PostMapping("/upload")
    public ResponseEntity<?> uploadProductImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = cloudinaryService.uploadImage(file);
            return ResponseEntity.ok().body("{\"url\": \"" + imageUrl + "\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload thất bại: " + e.getMessage());
        }
    }
}