import React, { useState, useEffect } from 'react';
import { thongbaoService } from '../services/api';
import Loading from '../components/Loading';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';

const ThongBao = ({ updateUnreadCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await thongbaoService.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error('Fetch notifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await thongbaoService.markAsRead(id);
      fetchNotifications();
      if (updateUnreadCount) updateUnreadCount();
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await thongbaoService.markAllAsRead();
      fetchNotifications();
      if (updateUnreadCount) updateUnreadCount();
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await thongbaoService.deleteNotification(id);
      fetchNotifications();
      if (updateUnreadCount) updateUnreadCount();
    } catch (error) {
      console.error('Delete notification error:', error);
    }
  };

  const getNotificationIcon = (type) => {
    return <FaBell color="#1976d2" />;
  };

  if (loading) return <Loading />;

  return (
    <div className="thongbao-container container">
      <div className="thongbao-header">
        <h1>Thông báo</h1>
        {notifications.some(n => !n.da_doc) && (
          <button onClick={handleMarkAllAsRead} className="btn btn-secondary">
            <FaCheck /> Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card text-center">
          <FaBell size={50} color="#ccc" />
          <p style={{ marginTop: '20px' }}>Không có thông báo nào</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item card ${!notification.da_doc ? 'unread' : ''}`}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.loai_thong_bao)}
              </div>
              <div className="notification-content">
                <h3>{notification.tieu_de}</h3>
                <p>{notification.noi_dung}</p>
                <span className="notification-time">
                  {new Date(notification.ngay_tao).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="notification-actions">
                {!notification.da_doc && (
                  <button 
                    onClick={() => handleMarkAsRead(notification.id)} 
                    className="btn btn-success btn-sm"
                    title="Đánh dấu đã đọc"
                  >
                    <FaCheck />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(notification.id)} 
                  className="btn btn-danger btn-sm"
                  title="Xóa"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .thongbao-container {
          padding: 30px 20px;
          max-width: 900px;
        }

        .thongbao-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .thongbao-header h1 {
          color: #2c3e50;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .notification-item {
          display: flex;
          gap: 20px;
          padding: 20px;
          transition: all 0.3s;
        }

        .notification-item.unread {
          background: #e3f2fd;
          border-left: 4px solid #1976d2;
        }

        .notification-icon {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          border-radius: 50%;
        }

        .notification-content {
          flex: 1;
        }

        .notification-content h3 {
          color: #2c3e50;
          font-size: 16px;
          margin-bottom: 8px;
        }

        .notification-content p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .notification-time {
          color: #999;
          font-size: 12px;
        }

        .notification-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .btn-sm {
          padding: 8px 12px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default ThongBao;
