const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// Lấy danh sách thông báo của người dùng
router.get('/', async (req, res) => {
  try {
    const [notifications] = await db.query(
      `SELECT * FROM thong_bao 
       WHERE nguoi_nhan_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.user.id]
    );

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy thông báo', error: error.message });
  }
});

// Đánh dấu đã đọc một thông báo
router.put('/read/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'UPDATE thong_bao SET da_doc = TRUE WHERE id = ? AND nguoi_nhan_id = ?',
      [id, req.user.id]
    );

    res.json({ message: 'Đã đánh dấu đọc' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật', error: error.message });
  }
});

// Đánh dấu đã đọc tất cả
router.put('/read-all', async (req, res) => {
  try {
    await db.query(
      'UPDATE thong_bao SET da_doc = TRUE WHERE nguoi_nhan_id = ?',
      [req.user.id]
    );

    res.json({ message: 'Đã đánh dấu đọc tất cả' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật', error: error.message });
  }
});

// Xóa thông báo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'DELETE FROM thong_bao WHERE id = ? AND nguoi_nhan_id = ?',
      [id, req.user.id]
    );

    res.json({ message: 'Xóa thông báo thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa thông báo', error: error.message });
  }
});

// Lấy số lượng thông báo chưa đọc
router.get('/unread-count', async (req, res) => {
  try {
    const [result] = await db.query(
      'SELECT COUNT(*) as count FROM thong_bao WHERE nguoi_nhan_id = ? AND da_doc = FALSE',
      [req.user.id]
    );

    res.json({ count: result[0].count });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đếm thông báo', error: error.message });
  }
});

module.exports = router;
