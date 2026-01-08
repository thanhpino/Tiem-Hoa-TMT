package com.tmt.tiem_hoa_tuoi.service;

import com.tmt.tiem_hoa_tuoi.entity.FlowerOrder;
import com.tmt.tiem_hoa_tuoi.entity.OrderDetail;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendOrderConfirmation(String to, FlowerOrder order) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("🌸 Xác nhận đơn hàng #" + order.getId() + " - Tiệm Hoa TMT");

            String htmlContent = generateInvoiceHtml(order);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ Đã gửi email HTML thành công cho: " + to);

        } catch (Exception e) {
            System.err.println("❌ LỖI GỬI EMAIL: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String generateInvoiceHtml(FlowerOrder order) {
        try {
            NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy");
            
            String orderDate = (order.getOrderDate() != null) ? order.getOrderDate().format(dateFormatter) : "Vừa xong";
            
            // Xây dựng các dòng sản phẩm
            StringBuilder productRows = new StringBuilder();
            if (order.getOrderDetails() != null && !order.getOrderDetails().isEmpty()) {
                for (OrderDetail item : order.getOrderDetails()) {
                    String productName = (item.getProduct() != null) ? item.getProduct().getName() : "Sản phẩm đã xóa";
                    double price = (item.getPrice() != null) ? item.getPrice() : 0;
                    int qty = (item.getQuantity() != null) ? item.getQuantity() : 0;
                    String lineTotal = currencyFormatter.format(price * qty).replace("₫", "đ");

                    productRows.append("<tr>")
                        .append("<td style='padding:8px; border-bottom:1px solid #eee; color:#333'>")
                            .append(productName)
                            .append(" <span style='color:#777; font-size:12px'>(x").append(qty).append(")</span>")
                        .append("</td>")
                        .append("<td style='padding:8px; border-bottom:1px solid #eee; text-align:right; font-weight:bold; color:#333'>")
                            .append(lineTotal)
                        .append("</td>")
                    .append("</tr>");
                }
            } else {
                productRows.append("<tr><td colspan='2' style='padding:10px; color:red; text-align:center'>Chi tiết đơn hàng đang cập nhật...</td></tr>");
            }

            // Trả về toàn bộ HTML
            return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Hóa Đơn</title>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f9f9f9; padding: 20px; margin: 0;">
                    <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 15px rgba(0,0,0,0.1);">
                        
                        <div style="background-color: #db2777; padding: 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px;">TIỆM HOA TMT 🌸</h1>
                            <p style="margin: 5px 0 0; opacity: 0.9;">Trao gửi yêu thương</p>
                        </div>

                        <div style="padding: 20px;">
                            <p>Xin chào <strong>%s</strong>,</p>
                            <p>Đơn hàng <strong>#%s</strong> của bạn đã được xác nhận!</p>

                            <div style="background: #fdf2f8; padding: 15px; border-radius: 8px; border-left: 4px solid #db2777; margin: 20px 0; font-size: 14px; color: #333;">
                                <div>📅 <strong>Ngày đặt:</strong> %s</div>
                                <div>👤 <strong>Người nhận:</strong> %s - %s</div>
                                <div>📍 <strong>Địa chỉ:</strong> %s</div>
                                <div>📝 <strong>Ghi chú:</strong> %s</div>
                            </div>

                            <h3 style="color: #db2777; border-bottom: 1px solid #eee; padding-bottom: 5px;">Chi tiết đơn hàng</h3>
                            
                            <table style="width: 100%%; border-collapse: collapse; margin-bottom: 20px;">
                                <thead>
                                    <tr style="background: #f3f4f6; color: #555;">
                                        <th style="padding: 10px; text-align: left;">Sản phẩm</th>
                                        <th style="padding: 10px; text-align: right;">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    %s
                                </tbody>
                            </table>

                            <div style="text-align: right; margin-top: 10px;">
                                <span style="font-size: 16px; color: #555;">Tổng thanh toán:</span><br>
                                <span style="font-size: 22px; font-weight: bold; color: #db2777;">%s</span>
                            </div>
                        </div>

                        <div style="background: #333; color: #aaa; padding: 15px; text-align: center; font-size: 12px;">
                            <p style="margin: 5px 0;">Hotline hỗ trợ: <strong>0932.013.424</strong></p>
                            <p style="margin: 0;">670/32 Đoàn Văn Bơ, Q.4, TP.HCM</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                    order.getCustomerName(),
                    order.getId(),
                    orderDate,
                    order.getCustomerName(), order.getPhone(),
                    order.getAddress(),
                    (order.getNote() != null && !order.getNote().isEmpty()) ? order.getNote() : "Không có",
                    productRows.toString(),
                    currencyFormatter.format(order.getTotalAmount()).replace("₫", "đ")
                );

        } catch (Exception e) {
            e.printStackTrace();
            return "Đơn hàng #" + order.getId() + " đã ghi nhận. (Lỗi HTML: " + e.getMessage() + ")";
        }
    }
}