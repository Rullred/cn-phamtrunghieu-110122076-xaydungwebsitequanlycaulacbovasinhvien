const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Lấy tất cả hoạt động (public - không cần đăng nhập)
router.get('/', async (req, res) => {
  try {
    const [activities] = await db.query(
      `SELECT hd.*, clb.ten_clb, clb.mo_ta as clb_mo_ta
       FROM hoat_dong hd
       JOIN cau_lac_bo clb ON hd.cau_lac_bo_id = clb.id
       WHERE hd.trang_thai IN ('sap_dien_ra', 'dang_dien_ra')
       ORDER BY hd.thoi_gian_bat_dau ASC`
    );

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách hoạt động', error: error.message });
  }
});

// Lấy chi tiết hoạt động
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [activities] = await db.query(
      `SELECT hd.*, clb.ten_clb, clb.mo_ta as clb_mo_ta
       FROM hoat_dong hd
       JOIN cau_lac_bo clb ON hd.cau_lac_bo_id = clb.id
       WHERE hd.id = ?`,
      [id]
    );

    if (activities.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy hoạt động' });
    }

    res.json(activities[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy chi tiết', error: error.message });
  }
});

module.exports = router;
