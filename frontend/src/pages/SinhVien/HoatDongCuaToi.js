import React, { useState, useEffect } from 'react';
import { sinhvienService } from '../../services/api';
import Loading from '../../components/Loading';

const HoatDongCuaToi = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyActivities();
  }, []);

  const fetchMyActivities = async () => {
    try {
      const response = await sinhvienService.getMyActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Fetch my activities error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc muốn hủy đăng ký?')) return;

    try {
      await sinhvienService.cancelRegistration(id);
      alert('Hủy đăng ký thành công');
      fetchMyActivities();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể hủy'));
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'cho_duyet': { class: 'badge-warning', text: 'Chờ duyệt' },
      'da_duyet': { class: 'badge-success', text: 'Đã duyệt' },
      'tu_choi': { class: 'badge-danger', text: 'Bị từ chối' },
      'da_huy': { class: 'badge-secondary', text: 'Đã hủy' }
    };
    const badge = badges[status] || { class: 'badge-info', text: status };
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  if (loading) return <Loading />;

  return (
    <div className="hoat-dong-cua-toi">
      <h1>Hoạt động của tôi</h1>

      {activities.length === 0 ? (
        <div className="card text-center">
          <p>Bạn chưa đăng ký hoạt động nào</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tên hoạt động</th>
                <th>Câu lạc bộ</th>
                <th>Thời gian</th>
                <th>Địa điểm</th>
                <th>Trạng thái</th>
                <th>Ngày đăng ký</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(activity => (
                <tr key={activity.id}>
                  <td>{activity.ten_hoat_dong}</td>
                  <td>{activity.ten_clb}</td>
                  <td>{new Date(activity.thoi_gian_bat_dau).toLocaleString('vi-VN')}</td>
                  <td>{activity.dia_diem}</td>
                  <td>{getStatusBadge(activity.trang_thai_dang_ky)}</td>
                  <td>{new Date(activity.ngay_dang_ky).toLocaleDateString('vi-VN')}</td>
                  <td>
                    {activity.trang_thai_dang_ky === 'cho_duyet' && (
                      <button 
                        onClick={() => handleCancel(activity.id)} 
                        className="btn btn-danger btn-sm"
                      >
                        Hủy
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .table-container {
          background: white;
          border-radius: 8px;
          overflow-x: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
        }

        .badge-secondary {
          background: #e0e0e0;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default HoatDongCuaToi;
