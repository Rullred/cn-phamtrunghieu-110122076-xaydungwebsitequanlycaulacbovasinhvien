-- Thêm hoạt động mẫu để test
USE ql_clb_sv;

-- Hoạt động chờ duyệt 1
INSERT INTO hoat_dong (cau_lac_bo_id, ten_hoat_dong, mo_ta, thoi_gian_bat_dau, thoi_gian_ket_thuc, dia_diem, quy_dinh_trang_phuc, so_luong_toi_da, trang_thai, trang_thai_duyet) 
SELECT id, 
    N'Workshop: Lập trình Web với React', 
    N'Học cách xây dựng ứng dụng web hiện đại với React, Redux và các công nghệ front-end mới nhất. Workshop sẽ bao gồm: React Hooks, State Management, API Integration, và Best Practices.',
    '2025-12-15 14:00:00', 
    '2025-12-15 17:00:00', 
    N'Phòng Lab A201', 
    N'Trang phục thoải mái, mang laptop cá nhân', 
    50, 
    'sap_dien_ra', 
    'cho_duyet' 
FROM cau_lac_bo WHERE ten_clb = N'CLB Lập trình' LIMIT 1;

-- Hoạt động chờ duyệt 2
INSERT INTO hoat_dong (cau_lac_bo_id, ten_hoat_dong, mo_ta, thoi_gian_bat_dau, thoi_gian_ket_thuc, dia_diem, quy_dinh_trang_phuc, so_luong_toi_da, trang_thai, trang_thai_duyet) 
SELECT id, 
    N'Hackathon 2025', 
    N'Cuộc thi lập trình 24h với chủ đề "Xây dựng ứng dụng hỗ trợ học tập". Giải thưởng hấp dẫn cho top 3 đội xuất sắc nhất!',
    '2025-12-20 08:00:00', 
    '2025-12-21 08:00:00', 
    N'Hội trường A - Tòa nhà Hành chính', 
    N'Trang phục tự do, chuẩn bị laptop, sạc dự phòng', 
    100, 
    'sap_dien_ra', 
    'cho_duyet' 
FROM cau_lac_bo WHERE ten_clb = N'CLB Lập trình' LIMIT 1;

-- Hoạt động chờ duyệt 3
INSERT INTO hoat_dong (cau_lac_bo_id, ten_hoat_dong, mo_ta, thoi_gian_bat_dau, thoi_gian_ket_thuc, dia_diem, quy_dinh_trang_phuc, so_luong_toi_da, trang_thai, trang_thai_duyet) 
SELECT id, 
    N'English Speaking Club - Topic: Technology', 
    N'Buổi giao lưu tiếng Anh với chủ đề Công nghệ. Thảo luận về các xu hướng công nghệ mới, AI, và tương lai của ngành IT.',
    '2025-12-18 18:00:00', 
    '2025-12-18 20:00:00', 
    N'Phòng B301', 
    N'Trang phục lịch sự', 
    30, 
    'sap_dien_ra', 
    'cho_duyet' 
FROM cau_lac_bo WHERE ten_clb = N'CLB Tiếng Anh' LIMIT 1;

-- Hoạt động đã được duyệt (để sinh viên thấy)
INSERT INTO hoat_dong (cau_lac_bo_id, ten_hoat_dong, mo_ta, thoi_gian_bat_dau, thoi_gian_ket_thuc, dia_diem, quy_dinh_trang_phuc, so_luong_toi_da, trang_thai, trang_thai_duyet) 
SELECT id, 
    N'IELTS Mock Test - Free', 
    N'Bài thi IELTS thử miễn phí với chấm điểm chi tiết. Đây là cơ hội tốt để các bạn đánh giá trình độ và chuẩn bị cho kỳ thi thật.',
    '2025-12-10 09:00:00', 
    '2025-12-10 12:00:00', 
    N'Hội trường B - Tòa nhà Hành chính', 
    N'Trang phục thoải mái, mang theo bút và giấy nháp', 
    80, 
    'sap_dien_ra', 
    'da_duyet' 
FROM cau_lac_bo WHERE ten_clb = N'CLB Tiếng Anh' LIMIT 1;

SELECT 'Đã thêm hoạt động mẫu thành công!' AS status;
