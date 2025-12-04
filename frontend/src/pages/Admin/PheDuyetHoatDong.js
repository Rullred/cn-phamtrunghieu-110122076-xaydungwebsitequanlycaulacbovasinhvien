import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { 
  FaCheck, 
  FaTimes, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaUniversity,
  FaClock,
  FaClipboardList
} from 'react-icons/fa';
import './PheDuyetHoatDong.css';

const PheDuyetHoatDong = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPendingActivities();
  }, []);

  const fetchPendingActivities = async () => {
    try {
      const response = await adminService.getPendingActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Fetch activities error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm('Bạn có chắc muốn phê duyệt hoạt động này?')) return;

    try {
      console.log('Bắt đầu phê duyệt hoạt động ID:', id);
      const response = await adminService.approveActivity(id);
      console.log('Phản hồi từ server:', response);
      
      // Xóa hoạt động khỏi danh sách ngay lập tức
      setActivities(activities.filter(a => a.id !== id));
      setMessage('Hoạt động đã được phê duyệt thành công! Thông báo đã được gửi đến chủ nhiệm CLB và tất cả sinh viên.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Lỗi phê duyệt:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status:', error.response?.status);
      alert('Lỗi: ' + (error.response?.data?.message || error.message || 'Không thể phê duyệt'));
    }
  };

  const handleReject = async (id) => {
    const ly_do = window.prompt('Nhập lý do từ chối:');
    if (!ly_do) return;

    try {
      await adminService.rejectActivity(id, ly_do);
      // Xóa hoạt động khỏi danh sách ngay lập tức
      setActivities(activities.filter(a => a.id !== id));
      setMessage('Hoạt động đã bị từ chối. Thông báo đã được gửi đến chủ nhiệm CLB.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể từ chối'));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="phe-duyet-container">
      <div className="page-header-section">
        <div>
          <h1 className="page-title-main">Phê duyệt hoạt động</h1>
          <p className="page-subtitle-main">Quản lý và phê duyệt các hoạt động do câu lạc bộ đề xuất</p>
        </div>
        <Badge variant="info" size="large">
          {activities.length} chờ xử lý
        </Badge>
      </div>

      {message && (
        <div className="success-message">
          <FaCheck /> {message}
        </div>
      )}

      {activities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FaClipboardList size={60} />
          </div>
          <h3>Không có hoạt động chờ phê duyệt</h3>
          <p>Tất cả hoạt động đã được xử lý</p>
        </div>
      ) : (
        <div className="activities-grid-modern">
          {activities.map(activity => (
            <div key={activity.id} className="activity-card-modern">
              <div className="activity-card-header">
                <div className="activity-icon-wrapper">
                  <FaCalendarAlt size={32} />
                </div>
                <Badge variant="warning" size="small">Chờ phê duyệt</Badge>
              </div>

              <div className="activity-card-body">
                <h3 className="activity-title">{activity.ten_hoat_dong}</h3>
                
                <div className="activity-club-info">
                  <FaUniversity className="club-icon" />
                  <span className="club-name">{activity.ten_clb}</span>
                </div>

                <div className="activity-description">
                  <p>{activity.mo_ta}</p>
                </div>

                <div className="activity-details">
                  <div className="detail-item">
                    <FaCalendarAlt className="detail-icon" />
                    <div>
                      <span className="detail-label">Ngày tổ chức</span>
                      <span className="detail-value">
                        {formatDate(activity.thoi_gian_bat_dau)}
                      </span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaClock className="detail-icon" />
                    <div>
                      <span className="detail-label">Thời gian</span>
                      <span className="detail-value">
                        {formatTime(activity.thoi_gian_bat_dau)} - {formatTime(activity.thoi_gian_ket_thuc)}
                      </span>
                    </div>
                  </div>

                  <div className="detail-item full-width">
                    <FaMapMarkerAlt className="detail-icon" />
                    <div>
                      <span className="detail-label">Địa điểm</span>
                      <span className="detail-value">{activity.dia_diem}</span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaUsers className="detail-icon" />
                    <div>
                      <span className="detail-label">Số lượng tối đa</span>
                      <span className="detail-value">
                        {activity.so_luong_toi_da || 'Không giới hạn'} người
                      </span>
                    </div>
                  </div>

                  <div className="detail-item">
                    <FaClipboardList className="detail-icon" />
                    <div>
                      <span className="detail-label">Loại hoạt động</span>
                      <span className="detail-value">
                        {activity.loai_hoat_dong || 'Chung'}
                      </span>
                    </div>
                  </div>
                </div>

                {activity.hinh_anh && (
                  <div className="activity-image">
                    <img 
                      src={`http://localhost:5000${activity.hinh_anh}`} 
                      alt={activity.ten_hoat_dong}
                    />
                  </div>
                )}
              </div>

              <div className="activity-card-footer">
                <Button 
                  variant="success" 
                  size="medium"
                  icon={<FaCheck />}
                  onClick={() => handleApprove(activity.id)}
                >
                  Phê duyệt
                </Button>
                <Button 
                  variant="danger" 
                  size="medium"
                  icon={<FaTimes />}
                  onClick={() => handleReject(activity.id)}
                >
                  Từ chối
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PheDuyetHoatDong;
