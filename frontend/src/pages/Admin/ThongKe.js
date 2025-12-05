import React, { useState, useEffect } from 'react';
import { FaChartLine, FaChartBar, FaChartPie, FaCalendar, FaUsers, FaClipboardList } from 'react-icons/fa';
import './ThongKe.css';

const ThongKe = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    // TODO: Implement API call to fetch statistics
    // Placeholder data for now
    setLoading(false);
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="modern-spinner"></div>
      </div>
    );
  }

  return (
    <div className="thong-ke-container">
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <FaChartLine size={32} />
          </div>
          <div>
            <h1>Thống Kê Hệ Thống</h1>
            <p>Báo cáo và phân tích dữ liệu hoạt động</p>
          </div>
        </div>
        <div className="period-selector">
          <button 
            className={`period-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('week')}
          >
            Tuần
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('month')}
          >
            Tháng
          </button>
          <button 
            className={`period-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
            onClick={() => setSelectedPeriod('year')}
          >
            Năm
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-icon-wrapper blue">
            <FaUsers size={28} />
          </div>
          <div className="stat-details">
            <h3>0</h3>
            <p>Tổng sinh viên</p>
            <span className="stat-change positive">+0% so với tháng trước</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon-wrapper green">
            <FaClipboardList size={28} />
          </div>
          <div className="stat-details">
            <h3>0</h3>
            <p>Hoạt động đã tổ chức</p>
            <span className="stat-change positive">+0% so với tháng trước</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon-wrapper orange">
            <FaCalendar size={28} />
          </div>
          <div className="stat-details">
            <h3>0</h3>
            <p>Lượt tham gia</p>
            <span className="stat-change positive">+0% so với tháng trước</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon-wrapper purple">
            <FaChartPie size={28} />
          </div>
          <div className="stat-details">
            <h3>0%</h3>
            <p>Tỷ lệ tham gia</p>
            <span className="stat-change">Trung bình</span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3><FaChartBar /> Biểu đồ hoạt động theo tháng</h3>
          </div>
          <div className="chart-placeholder">
            <FaChartBar size={48} className="placeholder-icon" />
            <p>Biểu đồ đang được phát triển</p>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3><FaChartPie /> Phân bố theo câu lạc bộ</h3>
          </div>
          <div className="chart-placeholder">
            <FaChartPie size={48} className="placeholder-icon" />
            <p>Biểu đồ đang được phát triển</p>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3><FaChartLine /> Xu hướng tham gia</h3>
          </div>
          <div className="chart-placeholder">
            <FaChartLine size={48} className="placeholder-icon" />
            <p>Biểu đồ đang được phát triển</p>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <h3>Hoạt động gần đây</h3>
        <div className="empty-state">
          <FaCalendar size={48} className="empty-icon" />
          <p>Chưa có dữ liệu hoạt động</p>
        </div>
      </div>
    </div>
  );
};

export default ThongKe;
