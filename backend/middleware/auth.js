const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Middleware xác thực JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
      }

      // Lấy thông tin người dùng từ database
      const [users] = await db.query(
        'SELECT * FROM nguoi_dung WHERE id = ?',
        [decoded.userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }

      req.user = users[0];
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xác thực', error: error.message });
  }
};

// Middleware kiểm tra quyền Admin
const isAdmin = (req, res, next) => {
  if (req.user.loai_nguoi_dung !== 'admin') {
    return res.status(403).json({ message: 'Chỉ Admin mới có quyền thực hiện' });
  }
  next();
};

// Middleware kiểm tra quyền Chủ nhiệm CLB
const isChuNhiemCLB = (req, res, next) => {
  if (req.user.loai_nguoi_dung !== 'chu_nhiem') {
    return res.status(403).json({ message: 'Chỉ Chủ nhiệm CLB mới có quyền' });
  }
  next();
};

// Middleware kiểm tra tài khoản đã được phê duyệt
const isApproved = (req, res, next) => {
  if (req.user.trang_thai !== 'da_duyet') {
    return res.status(403).json({ 
      message: 'Tài khoản chưa được phê duyệt',
      status: req.user.trang_thai 
    });
  }
  next();
};

module.exports = {
  authenticateToken,
  isAdmin,
  isChuNhiemCLB,
  isApproved
};
