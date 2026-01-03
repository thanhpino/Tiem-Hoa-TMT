
package com.tmt.tiem_hoa_tuoi;
import java.sql.Connection;
import java.sql.DriverManager;

public class TestConnection {
    public static void main(String[] args) {
        String url = "jdbc:sqlserver://localhost:1433;databaseName=TiemHoaTuoiDB;encrypt=true;trustServerCertificate=true";
        String user = "sa";
        String pass = "YourStrongPassword123!";
        
        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            System.out.println("✅ Kết nối thành công!");
        } catch (Exception e) {
            System.out.println("❌ Lỗi: " + e.getMessage());
        }
    }
}