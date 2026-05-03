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
    
    // Check constraints logic
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
        setError('Error: Start date cannot be later than end date!');
        setLoading(false);
        return;
    }

    try {
      // Call Backend API
      const queryParams = new URLSearchParams(formData).toString();
      const response = await fetch(`http://localhost:5000/api/revenue-report?${queryParams}`);
      
      if (!response.ok) throw new Error('Error connecting to the server');
      
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
      <h2 className="steamH2">Developer Revenue Report</h2>
      
      {/* Data Filter Form */}
      <form onSubmit={fetchReport} style={{ marginBottom: 16 }}>
        <div className="steamRow">
          <div className="steamField">
            <label className="steamLabel" htmlFor="startDate">From Date</label>
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
            <label className="steamLabel" htmlFor="endDate">To Date</label>
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
            <label className="steamLabel" htmlFor="minRevenue">Minimum Revenue (VND)</label>
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
            {loading ? 'Loading...' : 'Filter Data'}
          </button>
        </div>

        {error && <div className="steamAlert" role="alert">{error}</div>}
      </form>

      {/* Results Table */}
      {reportData.length > 0 ? (
        <table className="steamTable">
          <thead>
            <tr>
              <th>Developer</th>
              <th>Total Sales</th>
              <th>Total Revenue (VND)</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr key={index}>
                <td>{row['Nhà Phát Triển']}</td>
                <td>{row['Tổng Số Lượt Bán']}</td>
                <td>
                  {/* Format VND currency professionally */}
                  {Number(row['Tổng Doanh Thu']).toLocaleString('vi-VN')} đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <div className="steamEmpty">No data available. Please click "Filter Data".</div>
      )}
    </div>
  );
};

export default RevenueReport;