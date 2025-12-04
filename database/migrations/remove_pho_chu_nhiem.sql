-- Migration: Remove pho_chu_nhiem role from database
-- Date: 2025-12-03
-- Description: Remove pho_chu_nhiem role and simplify to 3 user roles (admin, chu_nhiem, sinh_vien)

USE ql_clb_sv;

-- Step 1: Update any existing pho_chu_nhiem users to chu_nhiem
UPDATE nguoi_dung 
SET loai_nguoi_dung = 'chu_nhiem' 
WHERE loai_nguoi_dung = 'pho_chu_nhiem';

-- Step 2: Remove pho_chu_nhiem_id column from cau_lac_bo table
-- First, check and drop foreign key constraint
SET @constraint_name = (
    SELECT CONSTRAINT_NAME 
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
    WHERE TABLE_SCHEMA = 'ql_clb_sv' 
    AND TABLE_NAME = 'cau_lac_bo' 
    AND COLUMN_NAME = 'pho_chu_nhiem_id'
    AND CONSTRAINT_NAME != 'PRIMARY'
    LIMIT 1
);

SET @sql = IF(@constraint_name IS NOT NULL, 
    CONCAT('ALTER TABLE cau_lac_bo DROP FOREIGN KEY ', @constraint_name), 
    'SELECT "No foreign key to drop" AS status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop the column (check if exists first)
SET @col_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'ql_clb_sv' 
    AND TABLE_NAME = 'cau_lac_bo' 
    AND COLUMN_NAME = 'pho_chu_nhiem_id'
);

SET @sql = IF(@col_exists > 0, 
    'ALTER TABLE cau_lac_bo DROP COLUMN pho_chu_nhiem_id', 
    'SELECT "Column does not exist" AS status');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 3: Modify loai_nguoi_dung ENUM to remove pho_chu_nhiem
ALTER TABLE nguoi_dung 
MODIFY loai_nguoi_dung ENUM('admin', 'sinh_vien', 'chu_nhiem') NOT NULL;

-- Step 4: Verify changes
SELECT 'Migration completed successfully!' AS status;
SELECT COUNT(*) AS total_users, loai_nguoi_dung 
FROM nguoi_dung 
GROUP BY loai_nguoi_dung;
