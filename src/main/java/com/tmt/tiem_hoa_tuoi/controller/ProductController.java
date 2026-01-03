package com.tmt.tiem_hoa_tuoi.controller;

import com.tmt.tiem_hoa_tuoi.service.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") 
public class ProductController {

    @Autowired
    private CloudinaryService cloudinaryService;

    // API Upload ảnh sản phẩm
    @PostMapping("/upload")
    public ResponseEntity<?> uploadProductImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = cloudinaryService.uploadImage(file);
            // Trả về JSON chứa link ảnh
            return ResponseEntity.ok().body("{\"url\": \"" + imageUrl + "\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload thất bại: " + e.getMessage());
        }
    }
}