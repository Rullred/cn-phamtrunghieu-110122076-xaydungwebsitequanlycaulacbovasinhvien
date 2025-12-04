import React, { useState, useEffect } from 'react';
import { clbService } from '../../services/api';
import Loading from '../../components/Loading';

const QuanLyThanhVien = () => {
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, requestsRes] = await Promise.all([
        clbService.getMembers(),
        clbService.getMemberRequests()
      ]);
      setMembers(membersRes.data);
      setRequests(requestsRes.data);
    } catch (error) {
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await clbService.approveMember(id);
      alert('Phê duyệt thành viên thành công!');
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể phê duyệt'));
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Bạn có chắc muốn từ chối yêu cầu này?')) return;

    try {
      await clbService.rejectMember(id);
      alert('Đã từ chối yêu cầu');
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể từ chối'));
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Bạn có chắc muốn loại bỏ thành viên này?')) return;

    try {
      await clbService.removeMember(id);
      alert('Loại bỏ thành viên thành công');
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể loại bỏ'));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="quan-ly-thanh-vien">
      <h1>Quản lý Thành viên</h1>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Thành viên ({members.length})
        </button>
        <button 
          className={`tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Yêu cầu chờ duyệt ({requests.length})
        </button>
      </div>

      {activeTab === 'requests' && (
        <div className="requests-section">
          {requests.length === 0 ? (
            <div className="card text-center">
              <p>Không có yêu cầu nào</p>
            </div>
          ) : (
            <div className="members-grid">
              {requests.map(request => (
                <div key={request.id} className="member-card card">
                  <img 
                    src={`http://localhost:5000${request.anh_dai_dien}`} 
                    alt={request.ho_ten}
                    className="member-avatar"
                  />
                  <h3>{request.ho_ten}</h3>
                  <p><strong>MSSV:</strong> {request.ma_sinh_vien}</p>
                  <p><strong>Lớp:</strong> {request.lop}</p>
                  <p><strong>Khoa:</strong> {request.khoa}</p>
                  <div className="member-actions">
                    <button onClick={() => handleApprove(request.id)} className="btn btn-success btn-sm">
                      Phê duyệt
                    </button>
                    <button onClick={() => handleReject(request.id)} className="btn btn-danger btn-sm">
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="members-section">
          {members.length === 0 ? (
            <div className="card text-center">
              <p>Chưa có thành viên nào</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Họ tên</th>
                    <th>MSSV</th>
                    <th>Lớp</th>
                    <th>Khoa</th>
                    <th>Vai trò</th>
                    <th>Ngày tham gia</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id}>
                      <td>
                        <img 
                          src={`http://localhost:5000${member.anh_dai_dien}`} 
                          alt={member.ho_ten}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      </td>
                      <td>{member.ho_ten}</td>
                      <td>{member.ma_sinh_vien}</td>
                      <td>{member.lop}</td>
                      <td>{member.khoa}</td>
                      <td>
                        <span className="badge badge-info">{member.vai_tro}</span>
                      </td>
                      <td>{new Date(member.ngay_duyet).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <button onClick={() => handleRemove(member.id)} className="btn btn-danger btn-sm">
                          Loại bỏ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <style>{`
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .tab {
          padding: 12px 24px;
          background: white;
          border: 2px solid #ddd;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }

        .tab.active {
          background: #1976d2;
          color: white;
          border-color: #1976d2;
        }

        .tab:hover:not(.active) {
          border-color: #1976d2;
          color: #1976d2;
        }

        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .member-card {
          text-align: center;
          padding: 20px;
        }

        .member-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 15px;
          border: 3px solid #1976d2;
        }

        .member-card h3 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .member-card p {
          color: #666;
          font-size: 14px;
          margin: 5px 0;
        }

        .member-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 15px;
        }

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

export default QuanLyThanhVien;
