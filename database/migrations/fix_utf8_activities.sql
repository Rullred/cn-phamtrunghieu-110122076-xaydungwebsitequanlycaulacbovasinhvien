-- Insert hoạt động mẫu với encoding UTF-8 đúng
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Hoạt động chờ duyệt 1
INSERT INTO hoat_dong (cau_lac_bo_id, ten_hoat_dong, mo_ta, thoi_gian_bat_dau, thoi_gian_ket_thuc, dia_diem, so_luong_toi_da, trang_thai, trang_thai_duyet) 
VALUES (1, 'Workshop React cơ bản', 'Học lập trình React từ cơ bản đến nâng cao, xây dựng ứng dụng web hiện đại', '2025-12-15 14:00:00', '2025-12-15 17:00:00', 'Phòng Lab A201', 50, 'sap_dien_ra', 'cho_duyet');

-- Hoạt động chờ duyệt 2
INSERT INTO hoat_dong (cau_lac_bo_id, ten_hoat_dong, mo_ta, thoi_gian_bat_dau, thoi_gian_ket_thuc, dia_diem, so_luong_toi_da, trang_thai, trang_thai_duyet) 
VALUES (1, 'Hackathon 2025', 'Cuộc thi lập trình 24 giờ - Xây dựng ứng dụng hỗ trợ học tập', '2025-12-20 08:00:00', '2025-12-21 08:00:00', 'Hội trường A', 100, 'sap_dien_ra', 'cho_duyet');

-- Hoạt động chờ duyệt 3
INSERT INTO hoat_dong (cau_lac_bo_id, ten_hoat_dong, mo_ta, thoi_gian_bat_dau, thoi_gian_ket_thuc, dia_diem, so_luong_toi_da, trang_thai, trang_thai_duyet) 
VALUES (2, 'English Club - Technology', 'Giao lưu tiếng Anh chủ đề Công nghệ', '2025-12-18 18:00:00', '2025-12-18 20:00:00', 'Phòng B301', 30, 'sap_dien_ra', 'cho_duyet');

-- Hoạt động đã được duyệt (để sinh viên thấy)
INSERT INTO hoat_dong (cau_lac_bo_id, ten_hoat_dong, mo_ta, thoi_gian_bat_dau, thoi_gian_ket_thuc, dia_diem, so_luong_toi_da, trang_thai, trang_thai_duyet) 
VALUES (2, 'IELTS Mock Test miễn phí', 'Bài thi IELTS thử với chấm điểm chi tiết', '2025-12-10 09:00:00', '2025-12-10 12:00:00', 'Hội trường B', 80, 'sap_dien_ra', 'da_duyet');

SELECT 'Đã thêm hoạt động thành công' AS status;
