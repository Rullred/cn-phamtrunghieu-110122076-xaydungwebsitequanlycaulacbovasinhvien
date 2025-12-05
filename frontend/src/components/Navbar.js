import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ user, unreadCount }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    
    switch (user.loai_nguoi_dung) {
      case 'admin':
        return '/admin';
      case 'chu_nhiem':
        return '/caulacbo';
      case 'sinh_vien':
        return '/sinhvien';
      default:
        return '/';
    }
  };

  const getUserTitle = () => {
    if (!user) return '';
    
    switch (user.loai_nguoi_dung) {
      case 'admin':
        return 'Quản trị viên';
      case 'chu_nhiem':
        return 'Chủ nhiệm CLB';
      case 'sinh_vien':
        return user.ho_ten || 'Sinh viên';
      default:
        return '';
    }
  };

  const getNavbarTitle = () => {
    if (!user) return 'QL CLB & HD SV - TVU';
    
    switch (user.loai_nguoi_dung) {
      case 'admin':
        return 'Hệ Thống Quản Lý Câu Lạc Bộ';
      case 'chu_nhiem':
        return 'Hệ Thống Quản Lý Câu Lạc Bộ';
      case 'sinh_vien':
        return 'Sinh Viên KT&CN - TVU';
      default:
        return 'QL CLB & HD SV - TVU';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={getDashboardLink()} className="navbar-logo">
          <img src="/logo-tvu.jpg" alt="TVU Logo" className="navbar-logo-img" />
          <h2>{getNavbarTitle()}</h2>
        </Link>

        {user && (
          <div className="navbar-menu">
            <Link to="/thongbao" className="navbar-notification">
              <FaBell size={20} />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </Link>

            <div className="navbar-user">
              <FaUserCircle size={24} />
              <span className="user-name">{getUserTitle()}</span>
            </div>

            <button onClick={handleLogout} className="btn-logout">
              <FaSignOutAlt size={18} />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
