import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clbService } from '../../services/api';

const TaoHoatDong = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ten_hoat_dong: '',
    mo_ta: '',
    thoi_gian_bat_dau: '',
    thoi_gian_ket_thuc: '',
    dia_diem: '',
    quy_dinh_trang_phuc: '',
    so_luong_toi_da: 0
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await clbService.createActivity(formData);
      alert('Tạo hoạt động thành công!');
      navigate('/caulacbo/hoat-dong');
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Không thể tạo hoạt động'));
    }
  };

  return (
    <div className="tao-hoat-dong">
      <h1>Tạo hoạt động mới</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên hoạt động *</label>
            <input
              type="text"
              name="ten_hoat_dong"
              className="form-control"
              value={formData.ten_hoat_dong}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="mo_ta"
              className="form-control"
              value={formData.mo_ta}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label>Thời gian bắt đầu *</label>
              <input
                type="datetime-local"
                name="thoi_gian_bat_dau"
                className="form-control"
                value={formData.thoi_gian_bat_dau}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Thời gian kết thúc *</label>
              <input
                type="datetime-local"
                name="thoi_gian_ket_thuc"
                className="form-control"
                value={formData.thoi_gian_ket_thuc}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Địa điểm *</label>
            <input
              type="text"
              name="dia_diem"
              className="form-control"
              value={formData.dia_diem}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Quy định trang phục</label>
            <input
              type="text"
              name="quy_dinh_trang_phuc"
              className="form-control"
              value={formData.quy_dinh_trang_phuc}
              onChange={handleChange}
              placeholder="VD: Áo đồng phục, quần jean..."
            />
          </div>

          <div className="form-group">
            <label>Số lượng tối đa (0 = không giới hạn)</label>
            <input
              type="number"
              name="so_luong_toi_da"
              className="form-control"
              value={formData.so_luong_toi_da}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Tạo hoạt động</button>
            <button 
              type="button" 
              onClick={() => navigate('/caulacbo')} 
              className="btn btn-secondary"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default TaoHoatDong;
