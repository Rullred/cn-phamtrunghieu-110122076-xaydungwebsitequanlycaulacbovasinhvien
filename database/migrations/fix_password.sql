-- Fix password hash cho 2 tài khoản CLB
UPDATE nguoi_dung 
SET mat_khau = '$2a$10$vpdmkfE8tSqbjnV6DaJzoO.xiPo4ey8PAJIIlSfdFkVQyQY.wnzHW' 
WHERE email IN ('clb.laptrinh@tvu.edu.vn', 'clb.tienganh@tvu.edu.vn');

SELECT 'Password đã được cập nhật' AS status;
SELECT id, email, LENGTH(mat_khau) as password_length FROM nguoi_dung WHERE email IN ('admin@tvu.edu.vn', 'clb.laptrinh@tvu.edu.vn', 'clb.tienganh@tvu.edu.vn');
