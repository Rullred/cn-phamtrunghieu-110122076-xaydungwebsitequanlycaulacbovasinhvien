# HƯỚNG DẪN CẬP NHẬT DATABASE

## Đã thay đổi

Đã chuyển từ **Phê duyệt tài khoản sinh viên** sang **Phê duyệt hoạt động từ câu lạc bộ**

## Các bước cập nhật

### 1. Chạy Migration Database

Kết nối MySQL và chạy file migration:

```bash
docker exec -i ql_clb_sv-db-1 mysql -uqlclb_user -pqlclb_password ql_clb_sv < database/migrations/add_activity_approval.sql
```

Hoặc kết nối MySQL trực tiếp:

```bash
docker exec -it ql_clb_sv-db-1 mysql -uqlclb_user -pqlclb_password ql_clb_sv
```

Sau đó copy và paste nội dung file `database/migrations/add_activity_approval.sql`

### 2. Khởi động lại services

```bash
docker-compose restart
```

### 3. Test chức năng mới

1. Đăng nhập với tài khoản Chủ nhiệm CLB
2. Tạo hoạt động mới - sẽ có trạng thái "Chờ phê duyệt"
3. Đăng nhập Admin
4. Vào mục "Phê duyệt hoạt động"
5. Phê duyệt hoặc từ chối hoạt động

## Thay đổi trong code

### Frontend:
- ✅ Đã tạo `PheDuyetHoatDong.js` và CSS
- ✅ Cập nhật `AdminDashboard.js` để sử dụng component mới
- ✅ Thêm API methods trong `services/api.js`
- ✅ Xóa `PheDuyetTaiKhoan.js` cũ

### Backend:
- ✅ Thêm routes:
  - `GET /api/admin/pending-activities` - Lấy danh sách hoạt động chờ duyệt
  - `POST /api/admin/approve-activity/:id` - Phê duyệt hoạt động
  - `POST /api/admin/reject-activity/:id` - Từ chối hoạt động
- ✅ Cập nhật statistics API để bao gồm `hoat_dong_cho_duyet`

### Database:
- ✅ Thêm cột `trang_thai_duyet` vào bảng `hoat_dong`
- ✅ Thêm các cột bổ sung: `ngay_to_chuc`, `gio_bat_dau`, `gio_ket_thuc`, `loai_hoat_dong`, `hinh_anh`

## Giao diện mới

### Trang Phê duyệt hoạt động:
- 📊 Card-based layout với gradient headers
- 📅 Hiển thị đầy đủ thông tin: tên CLB, ngày giờ, địa điểm, số lượng
- 🖼️ Hiển thị hình ảnh hoạt động (nếu có)
- ✅ Nút Phê duyệt / Từ chối với UI đẹp
- 📱 Responsive design

## Lưu ý

- Các hoạt động cũ sẽ tự động được đánh dấu "đã duyệt" sau migration
- Hoạt động mới tạo sẽ có trạng thái "chờ duyệt" mặc định
- Admin cần phê duyệt hoạt động trước khi sinh viên có thể thấy và đăng ký
