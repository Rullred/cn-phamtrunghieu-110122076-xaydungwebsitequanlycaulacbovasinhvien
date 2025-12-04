-- Migration: Thêm trường trang_thai_duyet vào bảng hoat_dong
USE ql_clb_sv;

-- Kiểm tra và thêm cột trang_thai_duyet nếu chưa có
ALTER TABLE hoat_dong 
ADD COLUMN IF NOT EXISTS trang_thai_duyet ENUM('cho_duyet', 'da_duyet', 'tu_choi') DEFAULT 'cho_duyet' AFTER trang_thai;

-- Thêm index cho trang_thai_duyet
ALTER TABLE hoat_dong 
ADD INDEX IF NOT EXISTS idx_trang_thai_duyet (trang_thai_duyet);

-- Cập nhật các hoạt động hiện tại thành đã duyệt (để tương thích ngược)
UPDATE hoat_dong SET trang_thai_duyet = 'da_duyet' WHERE trang_thai_duyet IS NULL;

-- Thêm các trường bổ sung cho hoạt động (nếu chưa có)
ALTER TABLE hoat_dong 
ADD COLUMN IF NOT EXISTS ngay_to_chuc DATE AFTER mo_ta,
ADD COLUMN IF NOT EXISTS gio_bat_dau TIME AFTER ngay_to_chuc,
ADD COLUMN IF NOT EXISTS gio_ket_thuc TIME AFTER gio_bat_dau,
ADD COLUMN IF NOT EXISTS loai_hoat_dong VARCHAR(100) AFTER gio_ket_thuc,
ADD COLUMN IF NOT EXISTS hinh_anh VARCHAR(255) AFTER loai_hoat_dong;

SELECT 'Migration completed successfully!' as status;
