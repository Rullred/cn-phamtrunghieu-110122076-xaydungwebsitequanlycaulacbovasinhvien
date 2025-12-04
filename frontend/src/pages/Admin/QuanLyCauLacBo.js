import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import Loading from '../../components/Loading';
import { FaPlus, FaTrash, FaUniversity } from 'react-icons/fa';
import './QuanLyCauLacBo.css';

const QuanLyCauLacBo = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ten_clb: '',
    mo_ta: '',
    ngay_thanh_lap: '',
    chu_nhiem_email: '',
    chu_nhiem_password: ''
  });

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await adminService.getClubs();
      setClubs(response.data);
    } catch (error) {
      console.error('Fetch clubs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Tạo CLB
      const clubResponse = await adminService.createClub({
        ten_clb: formData.ten_clb,
        mo_ta: formData.mo_ta,
        ngay_thanh_lap: formData.ngay_thanh_lap
      });

      const clb_id = clubResponse.data.clb_id;

      // Tạo tài khoản Chủ nhiệm
      if (formData.chu_nhiem_email && formData.chu_nhiem_password) {
        await adminService.createClubAdmin({
          email: formData.chu_nhiem_email,
          mat_khau: formData.chu_nhiem_password,
          loai_nguoi_dung: 'chu_nhiem',
          clb_id
        });
      }

      alert('Tạo câu lạc bộ thành công!');
      setShowModal(false);
      fetchClubs();
      setFormData({
        ten_clb: '',
        mo_ta: '',
        ngay_thanh_lap: '',
        chu_nhiem_email: '',
        chu_nhiem_password: ''
      });
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể tạo CLB'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa CLB này?')) return;

    try {
      await adminService.deleteClub(id);
      alert('Xóa CLB thành công!');
      fetchClubs();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể xóa CLB'));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="quan-ly-clb-container">
      <div className="page-header">
        <h1>Quản lý Câu lạc bộ</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <FaPlus /> Tạo CLB mới
        </button>
      </div>

      <div className="clubs-list">
        {clubs.map(club => (
          <div key={club.id} className="club-item card">
            <div className="club-icon">
              <FaUniversity size={40} color="#1976d2" />
            </div>
            <div className="club-details">
              <h3>{club.ten_clb}</h3>
              <p>{club.mo_ta}</p>
              <div className="club-meta">
                <span><strong>Chủ nhiệm:</strong> {club.chu_nhiem_email || 'Chưa có'}</span>
                <span><strong>Ngày thành lập:</strong> {new Date(club.ngay_thanh_lap).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
            <button onClick={() => handleDelete(club.id)} className="btn btn-danger">
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Tạo Câu lạc bộ mới</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên CLB *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.ten_clb}
                  onChange={(e) => setFormData({...formData, ten_clb: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  className="form-control"
                  value={formData.mo_ta}
                  onChange={(e) => setFormData({...formData, mo_ta: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Ngày thành lập *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.ngay_thanh_lap}
                  onChange={(e) => setFormData({...formData, ngay_thanh_lap: e.target.value})}
                  required
                />
              </div>

              <h3>Tài khoản Chủ nhiệm</h3>
              <div className="form-group">
                <label>Email Chủ nhiệm</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.chu_nhiem_email}
                  onChange={(e) => setFormData({...formData, chu_nhiem_email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu Chủ nhiệm</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.chu_nhiem_password}
                  onChange={(e) => setFormData({...formData, chu_nhiem_password: e.target.value})}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">Tạo CLB</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyCauLacBo;
