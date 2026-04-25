import React, { useState } from 'react';

const GameManagement = () => {
  const [formData, setFormData] = useState({
    game_id: '', title: '', base_price: '', release_date: '',
    graphics: '', os: '', processor: '', memory: '', developer_id: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm Validation cơ bản ở Frontend (Đáp ứng yêu cầu 3.1)
  const validate = (isUpdate = false, isDelete = false) => {
    if (isDelete) {
        if (!formData.game_id) return "Lỗi: Vui lòng nhập Game ID để xóa.";
        return null;
    }
    if (!formData.title) return "Lỗi: Title không được để trống.";
    if (formData.base_price < 0) return "Lỗi: Giá game không được âm.";
    if (isUpdate && !formData.game_id) return "Lỗi: Vui lòng nhập Game ID để cập nhật.";
    if (!isUpdate && !formData.developer_id) return "Lỗi: Vui lòng nhập Developer ID để thêm mới.";
    return null;
  };

  const executeAction = async (method, url) => {
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: method !== 'DELETE' ? JSON.stringify(formData) : null
      });
      const data = await response.json();
      setMessage(data.message); // Hiển thị câu thông báo (hoặc lỗi từ SQL)
    } catch (err) {
      setMessage('Lỗi: Không thể kết nối tới server.');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial' }}>
        <h2>Quản lý Bảng GAME (Part 3.1)</h2>
        
        {/* Khung hiển thị thông báo lỗi hoặc thành công */}
        {message && (
            <div style={{ 
                padding: '10px', marginBottom: '15px', fontWeight: 'bold',
                color: message.includes('Success') ? 'green' : 'red',
                backgroundColor: message.includes('Success') ? '#e6ffe6' : '#ffe6e6'
            }}>
                {message}
            </div>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="number" name="game_id" placeholder="Game ID (Chỉ dùng cho Sửa / Xóa)" onChange={handleChange} />
            <input type="text" name="title" placeholder="Tên Game (Title)" onChange={handleChange} />
            <input type="number" name="base_price" placeholder="Giá gốc (Base Price)" onChange={handleChange} />
            <label style={{ fontSize: '12px', color: 'gray', marginBottom: '-8px' }}>Ngày phát hành:</label>
            <input type="date" name="release_date" onChange={handleChange} />
            <input type="text" name="graphics" placeholder="Graphics" onChange={handleChange} />
            <input type="text" name="os" placeholder="OS" onChange={handleChange} />
            <input type="text" name="processor" placeholder="Processor" onChange={handleChange} />
            <input type="text" name="memory" placeholder="Memory" onChange={handleChange} />
            <input type="number" name="developer_id" placeholder="Developer ID (Chỉ dùng cho Thêm mới)" onChange={handleChange} />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
            <button onClick={() => {
                const err = validate(false, false);
                err ? setMessage(err) : executeAction('POST', 'http://localhost:5000/api/games');
            }} style={{ padding: '10px 15px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                Thêm Game
            </button>
            
            <button onClick={() => {
                const err = validate(true, false);
                err ? setMessage(err) : executeAction('PUT', `http://localhost:5000/api/games/${formData.game_id}`);
            }} style={{ padding: '10px 15px', background: '#FF9800', color: 'white', border: 'none', cursor: 'pointer' }}>
                Sửa Game
            </button>

            <button onClick={() => {
                const err = validate(false, true);
                err ? setMessage(err) : executeAction('DELETE', `http://localhost:5000/api/games/${formData.game_id}`);
            }} style={{ padding: '10px 15px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>
                Xóa Game
            </button>
        </div>
    </div>
  );
};

export default GameManagement;