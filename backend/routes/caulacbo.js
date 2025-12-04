const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isChuNhiemCLB } = require('../middleware/auth');

// Tất cả routes yêu cầu là Chủ nhiệm/Phó chủ nhiệm CLB
router.use(authenticateToken);
router.use(isChuNhiemCLB);

// Lấy thông tin CLB của Chủ nhiệm
router.get('/my-club', async (req, res) => {
  try {
    const [clubs] = await db.query(
      `SELECT * FROM cau_lac_bo 
       WHERE chu_nhiem_id = ?`,
      [req.user.id]
    );

    if (clubs.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy CLB' });
    }

    res.json(clubs[0]);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy thông tin CLB', error: error.message });
  }
});

// Tạo hoạt động mới
router.post('/create-activity', async (req, res) => {
  try {
    const { 
      ten_hoat_dong, 
      mo_ta, 
      thoi_gian_bat_dau, 
      thoi_gian_ket_thuc, 
      dia_diem, 
      quy_dinh_trang_phuc, 
      so_luong_toi_da 
    } = req.body;

    // Lấy CLB của Chủ nhiệm
    const [clubs] = await db.query(
      `SELECT id FROM cau_lac_bo 
       WHERE chu_nhiem_id = ?`,
      [req.user.id]
    );

    if (clubs.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy CLB' });
    }

    const cau_lac_bo_id = clubs[0].id;

    // Tạo hoạt động với trạng thái chờ duyệt
    const [result] = await db.query(
      `INSERT INTO hoat_dong (
        cau_lac_bo_id, ten_hoat_dong, mo_ta, thoi_gian_bat_dau, thoi_gian_ket_thuc,
        dia_diem, quy_dinh_trang_phuc, so_luong_toi_da, trang_thai, trang_thai_duyet
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sap_dien_ra', 'cho_duyet')`,
      [cau_lac_bo_id, ten_hoat_dong, mo_ta, thoi_gian_bat_dau, thoi_gian_ket_thuc, 
       dia_diem, quy_dinh_trang_phuc, so_luong_toi_da || 0]
    );

    // Gửi thông báo cho admin để phê duyệt
    const [admins] = await db.query(
      `SELECT id FROM nguoi_dung WHERE loai_nguoi_dung = 'admin'`
    );

    const io = req.app.get('io');
    for (const admin of admins) {
      await db.query(
        `INSERT INTO thong_bao (nguoi_nhan_id, loai_thong_bao, tieu_de, noi_dung, lien_ket)
         VALUES (?, 'duyet_hoat_dong', 'Hoạt động mới cần duyệt', ?, ?)`,
        [admin.id, `Hoạt động "${ten_hoat_dong}" đang chờ phê duyệt`, `/admin/pheduyet-hoatdong`]
      );
    }

    res.json({ 
      message: 'Tạo hoạt động thành công',
      hoat_dong_id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo hoạt động', error: error.message });
  }
});

// Lấy danh sách hoạt động của CLB
router.get('/activities', async (req, res) => {
  try {
    const [clubs] = await db.query(
      `SELECT id FROM cau_lac_bo 
       WHERE chu_nhiem_id = ?`,
      [req.user.id]
    );

    if (clubs.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy CLB' });
    }

    const [activities] = await db.query(
      `SELECT * FROM hoat_dong 
       WHERE cau_lac_bo_id = ?
       ORDER BY thoi_gian_bat_dau DESC`,
      [clubs[0].id]
    );

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách hoạt động', error: error.message });
  }
});

// Lấy danh sách đăng ký của một hoạt động
router.get('/activity-registrations/:hoat_dong_id', async (req, res) => {
  try {
    const { hoat_dong_id } = req.params;

    const [registrations] = await db.query(
      `SELECT dk.*, sv.ho_ten, sv.ma_sinh_vien, sv.lop, sv.khoa, sv.anh_dai_dien
       FROM dang_ky_hoat_dong dk
       JOIN sinh_vien sv ON dk.sinh_vien_id = sv.id
       WHERE dk.hoat_dong_id = ?
       ORDER BY dk.ngay_dang_ky DESC`,
      [hoat_dong_id]
    );

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách đăng ký', error: error.message });
  }
});

// Phê duyệt đăng ký hoạt động
router.post('/approve-registration/:id', async (req, res) => {
  try {
    const { id } = req.params; // DangKyHoatDong id

    // Cập nhật trạng thái
    await db.query(
      'UPDATE dang_ky_hoat_dong SET trang_thai = "da_duyet", ngay_duyet = NOW() WHERE id = ?',
      [id]
    );

    // Lấy thông tin để gửi thông báo
    const [info] = await db.query(
      `SELECT sv.nguoi_dung_id, sv.ho_ten, hd.ten_hoat_dong
       FROM dang_ky_hoat_dong dk
       JOIN sinh_vien sv ON dk.sinh_vien_id = sv.id
       JOIN hoat_dong hd ON dk.hoat_dong_id = hd.id
       WHERE dk.id = ?`,
      [id]
    );

    if (info.length > 0) {
      const { nguoi_dung_id, ten_hoat_dong } = info[0];

      // Gửi thông báo
      await db.query(
        `INSERT INTO thong_bao (nguoi_nhan_id, loai_thong_bao, tieu_de, noi_dung)
         VALUES (?, 'duyet_hoat_dong', 'Đăng ký hoạt động được duyệt', ?)`,
        [nguoi_dung_id, `Bạn đã được phê duyệt tham gia hoạt động "${ten_hoat_dong}"`]
      );

      // Real-time notification
      const io = req.app.get('io');
      const userSockets = req.app.get('userSockets');
      const socketId = userSockets.get(nguoi_dung_id);
      
      if (socketId) {
        io.to(socketId).emit('notification', {
          type: 'duyet_hoat_dong',
          message: `Bạn đã được duyệt tham gia "${ten_hoat_dong}"`
        });
      }
    }

    res.json({ message: 'Phê duyệt thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi phê duyệt', error: error.message });
  }
});

// Từ chối đăng ký hoạt động
router.post('/reject-registration/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ly_do } = req.body;

    await db.query(
      'UPDATE dang_ky_hoat_dong SET trang_thai = "tu_choi", ngay_duyet = NOW() WHERE id = ?',
      [id]
    );

    // Lấy thông tin để gửi thông báo
    const [info] = await db.query(
      `SELECT sv.nguoi_dung_id, hd.ten_hoat_dong
       FROM dang_ky_hoat_dong dk
       JOIN sinh_vien sv ON dk.sinh_vien_id = sv.id
       JOIN hoat_dong hd ON dk.hoat_dong_id = hd.id
       WHERE dk.id = ?`,
      [id]
    );

    if (info.length > 0) {
      const { nguoi_dung_id, ten_hoat_dong } = info[0];

      await db.query(
        `INSERT INTO thong_bao (nguoi_nhan_id, loai_thong_bao, tieu_de, noi_dung)
         VALUES (?, 'tu_choi_hoat_dong', 'Đăng ký hoạt động không được duyệt', ?)`,
        [nguoi_dung_id, `Đăng ký tham gia "${ten_hoat_dong}" không được duyệt. Lý do: ${ly_do || 'Không rõ'}`]
      );
    }

    res.json({ message: 'Từ chối thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi từ chối', error: error.message });
  }
});

// Lấy danh sách yêu cầu tham gia CLB
router.get('/member-requests', async (req, res) => {
  try {
    const [clubs] = await db.query(
      `SELECT id FROM cau_lac_bo 
       WHERE chu_nhiem_id = ?`,
      [req.user.id]
    );

    if (clubs.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy CLB' });
    }

    const [requests] = await db.query(
      `SELECT tv.*, sv.ho_ten, sv.ma_sinh_vien, sv.lop, sv.khoa, sv.anh_dai_dien
       FROM thanh_vien_clb tv
       JOIN sinh_vien sv ON tv.sinh_vien_id = sv.id
       WHERE tv.cau_lac_bo_id = ? AND tv.trang_thai = 'cho_duyet'
       ORDER BY tv.ngay_tham_gia DESC`,
      [clubs[0].id]
    );

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách', error: error.message });
  }
});

// Phê duyệt thành viên CLB
router.post('/approve-member/:id', async (req, res) => {
  try {
    const { id } = req.params; // ThanhVienCLB id

    await db.query(
      'UPDATE thanh_vien_clb SET trang_thai = "da_duyet", ngay_duyet = NOW() WHERE id = ?',
      [id]
    );

    // Gửi thông báo
    const [info] = await db.query(
      `SELECT sv.nguoi_dung_id, sv.ho_ten, clb.ten_clb
       FROM thanh_vien_clb tv
       JOIN sinh_vien sv ON tv.sinh_vien_id = sv.id
       JOIN cau_lac_bo clb ON tv.cau_lac_bo_id = clb.id
       WHERE tv.id = ?`,
      [id]
    );

    if (info.length > 0) {
      const { nguoi_dung_id, ten_clb } = info[0];

      await db.query(
        `INSERT INTO thong_bao (nguoi_nhan_id, loai_thong_bao, tieu_de, noi_dung)
         VALUES (?, 'duyet_thanh_vien_clb', 'Được duyệt tham gia CLB', ?)`,
        [nguoi_dung_id, `Chúc mừng! Bạn đã được duyệt tham gia ${ten_clb}`]
      );

      // Real-time
      const io = req.app.get('io');
      const userSockets = req.app.get('userSockets');
      const socketId = userSockets.get(nguoi_dung_id);
      
      if (socketId) {
        io.to(socketId).emit('notification', {
          type: 'duyet_thanh_vien_clb',
          message: `Bạn đã được duyệt tham gia ${ten_clb}`
        });
      }
    }

    res.json({ message: 'Phê duyệt thành viên thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi phê duyệt', error: error.message });
  }
});

// Từ chối thành viên CLB
router.post('/reject-member/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'UPDATE thanh_vien_clb SET trang_thai = "tu_choi" WHERE id = ?',
      [id]
    );

    // Gửi thông báo
    const [info] = await db.query(
      `SELECT sv.nguoi_dung_id, clb.ten_clb
       FROM thanh_vien_clb tv
       JOIN sinh_vien sv ON tv.sinh_vien_id = sv.id
       JOIN cau_lac_bo clb ON tv.cau_lac_bo_id = clb.id
       WHERE tv.id = ?`,
      [id]
    );

    if (info.length > 0) {
      const { nguoi_dung_id, ten_clb } = info[0];

      await db.query(
        `INSERT INTO thong_bao (nguoi_nhan_id, loai_thong_bao, tieu_de, noi_dung)
         VALUES (?, 'tu_choi_thanh_vien_clb', 'Yêu cầu tham gia CLB không được duyệt', ?)`,
        [nguoi_dung_id, `Yêu cầu tham gia ${ten_clb} của bạn không được chấp nhận`]
      );
    }

    res.json({ message: 'Từ chối thành viên' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi từ chối', error: error.message });
  }
});

// Lấy danh sách thành viên của CLB
router.get('/members', async (req, res) => {
  try {
    const [clubs] = await db.query(
      `SELECT id FROM cau_lac_bo 
       WHERE chu_nhiem_id = ?`,
      [req.user.id]
    );

    if (clubs.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy CLB' });
    }

    const [members] = await db.query(
      `SELECT tv.*, sv.ho_ten, sv.ma_sinh_vien, sv.lop, sv.khoa, sv.anh_dai_dien
       FROM thanh_vien_clb tv
       JOIN sinh_vien sv ON tv.sinh_vien_id = sv.id
       WHERE tv.cau_lac_bo_id = ? AND tv.trang_thai = 'da_duyet'
       ORDER BY tv.ngay_duyet DESC`,
      [clubs[0].id]
    );

    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách thành viên', error: error.message });
  }
});

// Loại bỏ thành viên khỏi CLB
router.delete('/remove-member/:id', async (req, res) => {
  try {
    const { id } = req.params; // ThanhVienCLB id

    await db.query('DELETE FROM thanh_vien_clb WHERE id = ?', [id]);

    res.json({ message: 'Loại bỏ thành viên thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi loại bỏ thành viên', error: error.message });
  }
});

// Cập nhật hoạt động
router.put('/activity/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      ten_hoat_dong, 
      mo_ta, 
      thoi_gian_bat_dau, 
      thoi_gian_ket_thuc, 
      dia_diem, 
      quy_dinh_trang_phuc, 
      so_luong_toi_da,
      trang_thai
    } = req.body;

    await db.query(
      `UPDATE hoat_dong SET 
       ten_hoat_dong = ?, mo_ta = ?, thoi_gian_bat_dau = ?, thoi_gian_ket_thuc = ?,
       dia_diem = ?, quy_dinh_trang_phuc = ?, so_luong_toi_da = ?, trang_thai = ?
       WHERE id = ?`,
      [ten_hoat_dong, mo_ta, thoi_gian_bat_dau, thoi_gian_ket_thuc, 
       dia_diem, quy_dinh_trang_phuc, so_luong_toi_da, trang_thai, id]
    );

    res.json({ message: 'Cập nhật hoạt động thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật hoạt động', error: error.message });
  }
});

// Xóa hoạt động
router.delete('/activity/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM hoat_dong WHERE id = ?', [id]);

    res.json({ message: 'Xóa hoạt động thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa hoạt động', error: error.message });
  }
});

module.exports = router;
