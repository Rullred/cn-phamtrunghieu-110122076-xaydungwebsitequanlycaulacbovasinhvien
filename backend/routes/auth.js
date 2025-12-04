const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const db = require('../config/database');
const upload = require('../middleware/upload');

// Đăng ký tài khoản sinh viên
router.post('/register', async (req, res) => {
  try {
    console.log('Đăng ký - Request body:', req.body);
    
    const { email, mat_khau, ho_ten, ma_sinh_vien, lop, khoa, nam_sinh } = req.body;

    // Validate dữ liệu đầu vào
    if (!email || !mat_khau || !ho_ten || !ma_sinh_vien || !lop || !khoa || !nam_sinh) {
      return res.status(400).json({ 
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
      });
    }

    // Kiểm tra email phải là email sinh viên (@st.tvu.edu.vn)
    if (!email.endsWith('@st.tvu.edu.vn')) {
      return res.status(400).json({ 
        message: 'Email phải là email sinh viên của trường (@st.tvu.edu.vn)' 
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const [existingUsers] = await db.query(
      'SELECT * FROM nguoi_dung WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email đã được đăng ký' });
    }

    // Kiểm tra mã sinh viên đã tồn tại chưa
    const [existingSV] = await db.query(
      'SELECT * FROM sinh_vien WHERE ma_sinh_vien = ?',
      [ma_sinh_vien]
    );

    if (existingSV.length > 0) {
      return res.status(400).json({ message: 'Mã sinh viên đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    // Tạo tài khoản người dùng (tự động duyệt)
    const [result] = await db.query(
      `INSERT INTO nguoi_dung (email, mat_khau, loai_nguoi_dung, trang_thai)
       VALUES (?, ?, 'sinh_vien', 'da_duyet')`,
      [email, hashedPassword]
    );

    const nguoi_dung_id = result.insertId;
    console.log('Đã tạo người dùng ID:', nguoi_dung_id);

    // Sử dụng ảnh đại diện mặc định (logo Thanh Niên Việt Nam)
    const anh_dai_dien = '/public/images/default-avatar.jpg';

    // Tạo hồ sơ sinh viên
    await db.query(
      `INSERT INTO sinh_vien (nguoi_dung_id, ho_ten, ma_sinh_vien, lop, khoa, nam_sinh, anh_dai_dien)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nguoi_dung_id, ho_ten, ma_sinh_vien, lop, khoa, parseInt(nam_sinh), anh_dai_dien]
    );

    console.log('Đã tạo hồ sơ sinh viên');

    // Tạo JWT token ngay
    const token = jwt.sign(
      { userId: nguoi_dung_id, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Đăng ký thành công cho:', email);

    res.json({ 
      message: 'Bạn đã đăng ký thành công!',
      token,
      user: {
        id: nguoi_dung_id,
        email: email,
        loai_nguoi_dung: 'sinh_vien',
        trang_thai: 'da_duyet'
      }
    });
  } catch (error) {
    console.error('Lỗi đăng ký chi tiết:', error);
    res.status(500).json({ 
      message: 'Lỗi đăng ký', 
      error: error.message,
      details: error.sqlMessage || error.toString()
    });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, mat_khau } = req.body;

    // Tìm người dùng
    const [users] = await db.query(
      'SELECT * FROM nguoi_dung WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const user = users[0];

    // Kiểm tra xem người dùng có mật khẩu không
    if (!user.mat_khau) {
      return res.status(401).json({ message: 'Tài khoản không hợp lệ' });
    }

    // Kiểm tra mật khẩu
    const isValidPassword = await bcrypt.compare(mat_khau, user.mat_khau);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        loai_nguoi_dung: user.loai_nguoi_dung,
        trang_thai: user.trang_thai
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đăng nhập', error: error.message });
  }
});

// Tạo hồ sơ sinh viên sau khi đăng ký Google
router.post('/create-profile', upload.single('anh_dai_dien'), async (req, res) => {
  try {
    const { nguoi_dung_id, ho_ten, ma_sinh_vien, lop, khoa, nam_sinh } = req.body;

    // Kiểm tra người dùng tồn tại và chưa có hồ sơ
    const [users] = await db.query(
      'SELECT * FROM nguoi_dung WHERE id = ? AND loai_nguoi_dung = "sinh_vien"',
      [nguoi_dung_id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra mã sinh viên đã tồn tại chưa
    const [existingSV] = await db.query(
      'SELECT * FROM sinh_vien WHERE ma_sinh_vien = ?',
      [ma_sinh_vien]
    );

    if (existingSV.length > 0) {
      return res.status(400).json({ message: 'Mã sinh viên đã tồn tại' });
    }

    // Xử lý ảnh đại diện
    const anh_dai_dien = req.file 
      ? `/public/images/${req.file.filename}` 
      : '/public/images/default-avatar.jpg';

    // Tạo hồ sơ sinh viên
    await db.query(
      `INSERT INTO sinh_vien (nguoi_dung_id, ho_ten, ma_sinh_vien, lop, khoa, nam_sinh, anh_dai_dien)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nguoi_dung_id, ho_ten, ma_sinh_vien, lop, khoa, nam_sinh, anh_dai_dien]
    );

    // Cập nhật trạng thái người dùng sang "chờ duyệt"
    await db.query(
      'UPDATE nguoi_dung SET trang_thai = "cho_duyet" WHERE id = ?',
      [nguoi_dung_id]
    );

    // Tạo thông báo cho Admin
    const [admins] = await db.query(
      'SELECT id FROM nguoi_dung WHERE loai_nguoi_dung = "admin"'
    );

    for (const admin of admins) {
      await db.query(
        `INSERT INTO thong_bao (nguoi_nhan_id, loai_thong_bao, tieu_de, noi_dung)
         VALUES (?, 'tai_khoan_duyet', 'Yêu cầu phê duyệt tài khoản mới', ?)`,
        [admin.id, `Sinh viên ${ho_ten} (${ma_sinh_vien}) vừa đăng ký tài khoản`]
      );
    }

    res.json({ 
      message: 'Tạo hồ sơ thành công! Vui lòng chờ Admin phê duyệt.',
      status: 'cho_duyet'
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi tạo hồ sơ', error: error.message });
  }
});

// Lấy thông tin người dùng hiện tại
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Không tìm thấy token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await db.query(
      `SELECT nd.*, sv.ho_ten, sv.ma_sinh_vien, sv.lop, sv.khoa, sv.nam_sinh, sv.anh_dai_dien
       FROM nguoi_dung nd
       LEFT JOIN sinh_vien sv ON nd.id = sv.nguoi_dung_id
       WHERE nd.id = ?`,
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const user = users[0];
    delete user.mat_khau; // Không trả về mật khẩu

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xác thực', error: error.message });
  }
});

// Đăng xuất
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Lỗi đăng xuất' });
    }
    res.json({ message: 'Đăng xuất thành công' });
  });
});

module.exports = router;
