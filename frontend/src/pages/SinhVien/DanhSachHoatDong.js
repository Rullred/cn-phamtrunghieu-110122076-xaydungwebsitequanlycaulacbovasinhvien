import React, { useState, useEffect } from 'react';
import { sinhvienService } from '../../services/api';
import Loading from '../../components/Loading';
import { FaCalendar, FaMapMarkerAlt, FaUsers, FaTshirt } from 'react-icons/fa';

const DanhSachHoatDong = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await sinhvienService.getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Fetch activities error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (id) => {
    const ghi_chu = window.prompt('Ghi chú (nếu có):');
    
    try {
      await sinhvienService.registerActivity(id, ghi_chu || '');
      setMessage('Đăng ký thành công! Vui lòng chờ CLB phê duyệt.');
      setTimeout(() => setMessage(''), 3000);
      fetchActivities();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể đăng ký'));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="danh-sach-hoat-dong">
      <h1>Danh sách Hoạt động</h1>

      {message && <div className="alert alert-success">{message}</div>}

      {activities.length === 0 ? (
        <div className="card text-center">
          <p>Chưa có hoạt động nào</p>
        </div>
      ) : (
        <div className="activities-grid">
          {activities.map(activity => (
            <div key={activity.id} className="activity-card card">
              <div className="activity-header">
                <h3>{activity.ten_hoat_dong}</h3>
                <span className="badge badge-info">{activity.ten_clb}</span>
              </div>

              <div className="activity-body">
                <p>{activity.mo_ta}</p>
                
                <div className="activity-details">
                  <div className="detail-item">
                    <FaCalendar />
                    <span>
                      <strong>Thời gian:</strong><br />
                      {new Date(activity.thoi_gian_bat_dau).toLocaleString('vi-VN')} <br />
                      đến {new Date(activity.thoi_gian_ket_thuc).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <div className="detail-item">
                    <FaMapMarkerAlt />
                    <span><strong>Địa điểm:</strong> {activity.dia_diem}</span>
                  </div>

                  {activity.quy_dinh_trang_phuc && (
                    <div className="detail-item">
                      <FaTshirt />
                      <span><strong>Trang phục:</strong> {activity.quy_dinh_trang_phuc}</span>
                    </div>
                  )}

                  <div className="detail-item">
                    <FaUsers />
                    <span>
                      <strong>Số lượng:</strong>{' '}
                      {activity.so_luong_da_dang_ky}/{activity.so_luong_toi_da > 0 ? activity.so_luong_toi_da : '∞'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="activity-footer">
                <button 
                  onClick={() => handleRegister(activity.id)} 
                  className="btn btn-primary"
                  disabled={
                    activity.so_luong_toi_da > 0 && 
                    activity.so_luong_da_dang_ky >= activity.so_luong_toi_da
                  }
                >
                  {activity.so_luong_toi_da > 0 && activity.so_luong_da_dang_ky >= activity.so_luong_toi_da
                    ? 'Đã đủ số lượng'
                    : 'Đăng ký tham gia'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .activities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .activity-card {
          display: flex;
          flex-direction: column;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .activity-header h3 {
          color: #2c3e50;
          font-size: 18px;
          margin: 0;
          flex: 1;
        }

        .activity-body {
          flex: 1;
        }

        .activity-body > p {
          color: #666;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .activity-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .detail-item {
          display: flex;
          gap: 10px;
          color: #555;
          font-size: 14px;
        }

        .detail-item svg {
          margin-top: 3px;
          flex-shrink: 0;
          color: #1976d2;
        }

        .activity-footer {
          border-top: 1px solid #eee;
          padding-top: 15px;
        }

        .activity-footer .btn {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default DanhSachHoatDong;
