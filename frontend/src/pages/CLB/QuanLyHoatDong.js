import React, { useState, useEffect } from 'react';
import { clbService } from '../../services/api';
import Loading from '../../components/Loading';

const QuanLyHoatDong = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await clbService.getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Fetch activities error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa hoạt động này?')) return;

    try {
      await clbService.deleteActivity(id);
      alert('Xóa hoạt động thành công!');
      fetchActivities();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể xóa'));
    }
  };

  const viewRegistrations = async (id) => {
    try {
      const response = await clbService.getActivityRegistrations(id);
      // Show modal or navigate to detail page
      console.log('Registrations:', response.data);
      // For demo, just alert count
      alert(`Có ${response.data.length} đăng ký cho hoạt động này`);
    } catch (error) {
      alert('Lỗi khi lấy danh sách đăng ký');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="quan-ly-hoat-dong">
      <h1>Quản lý Hoạt động</h1>

      {activities.length === 0 ? (
        <div className="card text-center">
          <p>Chưa có hoạt động nào</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tên hoạt động</th>
                <th>Thời gian</th>
                <th>Địa điểm</th>
                <th>Đăng ký</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(activity => (
                <tr key={activity.id}>
                  <td>{activity.ten_hoat_dong}</td>
                  <td>{new Date(activity.thoi_gian_bat_dau).toLocaleString('vi-VN')}</td>
                  <td>{activity.dia_diem}</td>
                  <td>
                    {activity.so_luong_da_dang_ky}/
                    {activity.so_luong_toi_da > 0 ? activity.so_luong_toi_da : '∞'}
                  </td>
                  <td>
                    <span className={`badge badge-${
                      activity.trang_thai === 'sap_dien_ra' ? 'info' :
                      activity.trang_thai === 'dang_dien_ra' ? 'warning' :
                      activity.trang_thai === 'da_ket_thuc' ? 'success' : 'danger'
                    }`}>
                      {activity.trang_thai === 'sap_dien_ra' ? 'Sắp diễn ra' :
                       activity.trang_thai === 'dang_dien_ra' ? 'Đang diễn ra' :
                       activity.trang_thai === 'da_ket_thuc' ? 'Đã kết thúc' : 'Đã hủy'}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => viewRegistrations(activity.id)} 
                      className="btn btn-primary btn-sm"
                      style={{ marginRight: '5px' }}
                    >
                      Xem đăng ký
                    </button>
                    <button 
                      onClick={() => handleDelete(activity.id)} 
                      className="btn btn-danger btn-sm"
                    >
                      Xóa
                    </button>
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
      `}</style>
    </div>
  );
};

export default QuanLyHoatDong;
