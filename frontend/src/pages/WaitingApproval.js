import React from 'react';
import { FaHourglassHalf } from 'react-icons/fa';
import './WaitingApproval.css';

const WaitingApproval = () => {
  return (
    <div className="waiting-container">
      <div className="waiting-box">
        <FaHourglassHalf size={60} color="#ff9800" />
        <h1>Chờ phê duyệt</h1>
        <p>
          Hồ sơ của bạn đã được gửi thành công!<br />
          Vui lòng chờ Admin phê duyệt tài khoản.
        </p>
        <p className="waiting-note">
          Bạn sẽ nhận được thông báo qua email khi tài khoản được phê duyệt.
        </p>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="btn btn-primary"
        >
          Quay lại trang đăng nhập
        </button>
      </div>
    </div>
  );
};

export default WaitingApproval;
