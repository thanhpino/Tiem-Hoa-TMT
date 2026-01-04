package com.tmt.tiem_hoa_tuoi.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;           

@Service
public class CloudinaryService {

    // Thay 3 thông số này bằng của bro vừa lấy ở Bước 1
    private final Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
        "cloud_name", "djaz70prr",
        "api_key", "226862455392144",
        "api_secret", "btbnOiJ9WncCVMTNJVRffvsn7k4"
    ));

    public String uploadImage(MultipartFile file) {
        try {
            // Upload file lên Cloudinary
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            
            // Trả về đường link ảnh online
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Lỗi upload ảnh: " + e.getMessage());
        }
    }
}