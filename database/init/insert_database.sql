USE ql_clb_sv;

-- Thêm dữ liệu mẫu cho người dùng (mật khẩu: admin123)
INSERT INTO nguoi_dung (email, mat_khau, loai_nguoi_dung, trang_thai) VALUES
(N'admin@tvu.edu.vn', N'$2a$10$vpdmkfE8tSqbjnV6DaJzoO.xiPo4ey8PAJIIlSfdFkVQyQY.wnzHW', N'admin', N'da_duyet'),
(N'clb.laptrinh@tvu.edu.vn', N'$2a$10$vpdmkfE8tSqbjnV6DaJzoO.xiPo4ey8PAJIIlSfdFkVQyQY.wnzHW', N'chu_nhiem', N'da_duyet'),
(N'clb.tienganh@tvu.edu.vn', N'$2a$10$vpdmkfE8tSqbjnV6DaJzoO.xiPo4ey8PAJIIlSfdFkVQyQY.wnzHW', N'chu_nhiem', N'da_duyet');

-- Thêm hồ sơ sinh viên mẫu (để test)
INSERT INTO sinh_vien (nguoi_dung_id, ho_ten, ma_sinh_vien, lop, khoa, nam_sinh) 
SELECT id, N'Nguyễn Văn A', N'SV001', N'CNTT1', N'Công nghệ thông tin', 2003 
FROM nguoi_dung WHERE email = N'sv001@st.tvu.edu.vn' LIMIT 1;

-- Thêm dữ liệu mẫu cho câu lạc bộ
INSERT INTO cau_lac_bo (ten_clb, mo_ta, chu_nhiem_id, trang_thai) 
SELECT N'CLB Lập trình', N'Câu lạc bộ dành cho những người yêu thích lập trình', id, N'hoat_dong'
FROM nguoi_dung WHERE email = N'clb.laptrinh@tvu.edu.vn' LIMIT 1;

INSERT INTO cau_lac_bo (ten_clb, mo_ta, chu_nhiem_id, trang_thai) 
SELECT N'CLB Tiếng Anh', N'Câu lạc bộ học và thực hành tiếng Anh', id, N'hoat_dong'
FROM nguoi_dung WHERE email = N'clb.tienganh@tvu.edu.vn' LIMIT 1;

-- Dữ liệu mẫu đã được thêm
-- Bạn có thể thêm thêm câu lạc bộ, hoạt động và thành viên sau khi hệ thống chạy