import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/api';
import './CreateProfile.css';

const CreateProfile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    ho_ten: '',
    ma_sinh_vien: '',
    lop: '',
    khoa: '',
    nam_sinh: ''
  });
  const [anhDaiDien, setAnhDaiDien] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const status = searchParams.get('status');

    if (token) {
      localStorage.setItem('token', token);
      
      if (status === 'da_duyet') {
        navigate('/sinhvien');
      } else if (status === 'cho_duyet') {
        navigate('/waiting-approval');
      }
    }

    // Lấy thông tin user
    const fetchUser = async () => {
      try {
        const response = await authService.getCurrentUser();
        setUser(response.data);
        
        if (response.data.trang_thai !== 'chua_hoan_thanh') {
          navigate('/sinhvien');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAnhDaiDien(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('nguoi_dung_id', user.id);
      data.append('ho_ten', formData.ho_ten);
      data.append('ma_sinh_vien', formData.ma_sinh_vien);
      data.append('lop', formData.lop);
      data.append('khoa', formData.khoa);
      data.append('nam_sinh', formData.nam_sinh);
      
      if (anhDaiDien) {
        data.append('anh_dai_dien', anhDaiDien);
      }

      await authService.createProfile(data);
      navigate('/waiting-approval');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi tạo hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <div className="create-profile-container">
      <div className="profile-box">
        <div className="profile-header">
          <h1>Tạo hồ sơ sinh viên</h1>
          <p>Vui lòng điền đầy đủ thông tin để hoàn tất đăng ký</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="avatar-upload">
            <div className="avatar-preview">
              {preview ? (
                <img src={preview} alt="Preview" />
              ) : (
                <div className="avatar-placeholder">
                  <span>Chọn ảnh</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="avatar-input"
            />
            <label htmlFor="avatar-input" className="btn btn-secondary">
              Tải ảnh đại diện
            </label>
          </div>

          <div className="form-group">
            <label>Họ và tên *</label>
            <input
              type="text"
              name="ho_ten"
              className="form-control"
              value={formData.ho_ten}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mã số sinh viên *</label>
            <input
              type="text"
              name="ma_sinh_vien"
              className="form-control"
              value={formData.ma_sinh_vien}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Lớp *</label>
            <input
              type="text"
              name="lop"
              className="form-control"
              value={formData.lop}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Khoa *</label>
            <select
              name="khoa"
              className="form-control"
              value={formData.khoa}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn khoa --</option>
              <option value="Kỹ thuật và Công nghệ">Kỹ thuật và Công nghệ</option>
              <option value="Kinh tế">Kinh tế</option>
              <option value="Nông nghiệp">Nông nghiệp</option>
              <option value="Sư phạm">Sư phạm</option>
            </select>
          </div>

          <div className="form-group">
            <label>Năm sinh *</label>
            <input
              type="number"
              name="nam_sinh"
              className="form-control"
              value={formData.nam_sinh}
              onChange={handleChange}
              min="1990"
              max="2010"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
