package com.tmt.tiem_hoa_tuoi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.tmt.tiem_hoa_tuoi.entity.FlowerOrder;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOrderConfirmation(String toEmail, FlowerOrder order) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("Tiem Hoa TMT <tt3145539@gmail.com>");
            message.setTo(toEmail);
            message.setSubject("🌸 Xác nhận đơn hàng #" + order.getId() + " - Tiệm Hoa TMT");
            
            // Nội dung email
            String content = "Xin chào " + order.getCustomerName() + ",\n\n"
                    + "Cảm ơn bạn đã đặt hoa tại Tiệm Hoa TMT! Đơn hàng của bạn đã được ghi nhận.\n"
                    + "------------------------------------------------\n"
                    + "Mã đơn hàng: #" + order.getId() + "\n"
                    + "Tổng tiền: " + String.format("%,.0f", order.getTotalAmount()) + " đ\n"
                    + "Địa chỉ giao: " + order.getAddress() + "\n"
                    + "Ghi chú: " + (order.getNote() != null ? order.getNote() : "Không có") + "\n"
                    + "------------------------------------------------\n\n"
                    + "Chúng tôi sẽ sớm liên hệ để giao hoa cho bạn.\n"
                    + "Hotline: 0932.013.424";

            message.setText(content);

            mailSender.send(message);
            System.out.println("Đã gửi email xác nhận cho: " + toEmail);

        } catch (Exception e) {
            System.err.println("Lỗi gửi email: " + e.getMessage());
            // Không ném lỗi ra ngoài để tránh làm hỏng luồng đặt hàng chính
        }
    }
}