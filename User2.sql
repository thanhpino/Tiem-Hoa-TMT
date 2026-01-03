-- 1. Tạo database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'FlowerShopDB')
BEGIN
    CREATE DATABASE FlowerShopDB;
END
GO
SELECT name, is_disabled
FROM sys.sql_logins
WHERE name = 'sa';
ALTER LOGIN sa ENABLE;
ALTER LOGIN sa WITH PASSWORD = 'Thanhdz123!';
-- -- 2. Tạo SQL Login
-- IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'tiem_hoa_user')
-- BEGIN
--     CREATE LOGIN tiem_hoa_user WITH PASSWORD = 'Thanhdz123!';
-- END
-- GO

-- -- 3. Chuyển sang database
-- USE FlowerShopDB;
-- GO

-- -- 4. Tạo User trong database và cấp quyền
-- IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'tiem_hoa_user')
-- BEGIN
--     CREATE USER tiem_hoa_user FOR LOGIN tiem_hoa_user;
--     ALTER ROLE db_owner ADD MEMBER tiem_hoa_user;
-- END
-- GO

-- -- 5. Kiểm tra xem user đã được tạo chưa
-- SELECT name, type_desc FROM sys.database_principals WHERE name = 'tiem_hoa_user';