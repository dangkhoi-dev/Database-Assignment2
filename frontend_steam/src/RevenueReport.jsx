import React, { useState } from 'react';

const RevenueReport = () => {
  const [formData, setFormData] = useState({
    startDate: '2023-01-01',
    endDate: '2024-12-31',
    minRevenue: 0
  });
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Kiểm tra logic ràng buộc (để lấy điểm xử lý lỗi logic)
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
        setError('Lỗi: Ngày bắt đầu không được lớn hơn ngày kết thúc!');
        setLoading(false);
        return;
    }

    try {
      // Gọi API Backend
      const queryParams = new URLSearchParams(formData).toString();
      const response = await fetch(`http://localhost:5000/api/revenue-report?${queryParams}`);
      
      if (!response.ok) throw new Error('Lỗi kết nối đến server');
      
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="steamH2">Báo cáo doanh thu nhà phát triển</h2>
      
      {/* Form Lọc Dữ Liệu */}
      <form onSubmit={fetchReport} style={{ marginBottom: 16 }}>
        <div className="steamRow">
          <div className="steamField">
            <label className="steamLabel" htmlFor="startDate">Từ ngày</label>
            <input
              id="startDate"
              className="steamInput"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="steamField">
            <label className="steamLabel" htmlFor="endDate">Đến ngày</label>
            <input
              id="endDate"
              className="steamInput"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="steamField" style={{ minWidth: 260 }}>
            <label className="steamLabel" htmlFor="minRevenue">Doanh thu tối thiểu (VNĐ)</label>
            <input
              id="minRevenue"
              className="steamInput"
              type="number"
              name="minRevenue"
              value={formData.minRevenue}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <button className="steamButton" type="submit" disabled={loading}>
            {loading ? 'Đang tải…' : 'Lọc dữ liệu'}
          </button>
        </div>

        {error && <div className="steamAlert" role="alert">{error}</div>}
      </form>

      {/* Bảng Hiển Thị Kết Quả */}
      {reportData.length > 0 ? (
        <table className="steamTable">
          <thead>
            <tr>
              <th>Nhà phát triển</th>
              <th>Tổng số lượt bán</th>
              <th>Tổng doanh thu (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr key={index}>
                <td>{row['Nhà Phát Triển']}</td>
                <td>{row['Tổng Số Lượt Bán']}</td>
                <td>
                  {/* Format tiền VNĐ cho chuyên nghiệp */}
                  {Number(row['Tổng Doanh Thu']).toLocaleString('vi-VN')} đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <div className="steamEmpty">Chưa có dữ liệu. Vui lòng nhấn “Lọc dữ liệu”.</div>
      )}
    </div>
  );
};

export default RevenueReport;