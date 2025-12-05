import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaStar, FaAward, FaUser } from 'react-icons/fa';
import './TopSinhVien.css';

const TopSinhVien = () => {
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement API call to fetch top students overall
    // Placeholder data for now
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="modern-spinner"></div>
      </div>
    );
  }

  return (
    <div className="top-sinhvien-sv-container">
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <FaTrophy size={32} />
          </div>
          <div>
            <h1>Top Sinh Viên Xuất Sắc</h1>
            <p>Danh sách sinh viên tích cực tham gia hoạt động</p>
          </div>
        </div>
      </div>

      <div className="top-students-content">
        <div className="stats-overview">
          <div className="stat-card">
            <FaMedal className="stat-icon gold" />
            <div className="stat-info">
              <h3>0</h3>
              <p>Sinh viên xuất sắc</p>
            </div>
          </div>
          <div className="stat-card">
            <FaStar className="stat-icon silver" />
            <div className="stat-info">
              <h3>0</h3>
              <p>Tổng điểm tích lũy</p>
            </div>
          </div>
          <div className="stat-card">
            <FaAward className="stat-icon bronze" />
            <div className="stat-info">
              <h3>0</h3>
              <p>Hoạt động đã tham gia</p>
            </div>
          </div>
        </div>

        <div className="ranking-section">
          <div className="section-header">
            <h2>Bảng Xếp Hạng</h2>
            <div className="filter-buttons">
              <button className="filter-btn active">Tất cả</button>
              <button className="filter-btn">Tháng này</button>
              <button className="filter-btn">Năm học</button>
            </div>
          </div>

          <div className="empty-state">
            <FaUser size={48} className="empty-icon" />
            <h3>Chưa có dữ liệu</h3>
            <p>Hệ thống đang cập nhật thông tin xếp hạng sinh viên</p>
          </div>

          {/* TODO: Replace with actual ranking table */}
          {/* 
          <div className="ranking-table">
            <table>
              <thead>
                <tr>
                  <th>Hạng</th>
                  <th>Sinh viên</th>
                  <th>MSSV</th>
                  <th>Điểm</th>
                  <th>Hoạt động</th>
                </tr>
              </thead>
              <tbody>
                // Student rows here
              </tbody>
            </table>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default TopSinhVien;
