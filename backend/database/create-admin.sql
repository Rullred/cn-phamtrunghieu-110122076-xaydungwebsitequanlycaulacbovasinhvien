-- Script tạo tài khoản Admin mặc định
-- Chạy sau khi đã import schema.sql

-- Mật khẩu: admin123
-- Hash này là của bcrypt với salt 10
UPDATE NguoiDung 
SET mat_khau = '$2a$10$YourActualBcryptHashHere'
WHERE email = 'admin@tvu.edu.vn';

-- Hoặc insert nếu chưa có
INSERT INTO NguoiDung (email, mat_khau, loai_nguoi_dung, trang_thai) 
VALUES (
  'admin@tvu.edu.vn', 
  '$2a$10$YourActualBcryptHashHere', 
  'admin', 
  'da_duyet'
) ON DUPLICATE KEY UPDATE mat_khau = mat_khau;

-- Lưu ý: Bạn cần tạo hash thật bằng cách chạy script Node.js:
-- const bcrypt = require('bcryptjs');
-- const hash = bcrypt.hashSync('admin123', 10);
-- console.log(hash);
