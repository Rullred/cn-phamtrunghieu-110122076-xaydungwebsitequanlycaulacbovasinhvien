-- Migration: Thêm cột khoa_hoc vào bảng sinh_vien
-- Chạy lệnh này nếu database cũ chưa có cột khoa_hoc

USE ql_clb_sv;

-- Kiểm tra và thêm cột khoa_hoc nếu chưa tồn tại
SET @dbname = 'ql_clb_sv';
SET @tablename = 'sinh_vien';
SET @columnname = 'khoa_hoc';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = @columnname
  ) > 0,
  'SELECT "Column khoa_hoc already exists"',
  'ALTER TABLE sinh_vien ADD COLUMN khoa_hoc VARCHAR(10) AFTER khoa'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Hoặc chạy trực tiếp nếu chắc chắn cột chưa tồn tại:
-- ALTER TABLE sinh_vien ADD COLUMN khoa_hoc VARCHAR(10) AFTER khoa;
