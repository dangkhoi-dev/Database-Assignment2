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
      setMessage('Error: Cannot connect to the server.');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial' }}>
        <h2>GAME Table Management (Part 3.1)</h2>
        
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
            <input type="number" name="game_id" placeholder="Game ID (For Update / Delete only)" onChange={handleChange} />
            <input type="text" name="title" placeholder="Game Title" onChange={handleChange} />
            <input type="number" name="base_price" placeholder="Base Price" onChange={handleChange} />
            <label style={{ fontSize: '12px', color: 'gray', marginBottom: '-8px' }}>Release Date:</label>
            <input type="date" name="release_date" onChange={handleChange} />
            <input type="text" name="graphics" placeholder="Graphics" onChange={handleChange} />
            <input type="text" name="os" placeholder="OS" onChange={handleChange} />
            <input type="text" name="processor" placeholder="Processor" onChange={handleChange} />
            <input type="text" name="memory" placeholder="Memory" onChange={handleChange} />
            <input type="number" name="developer_id" placeholder="Developer ID (For Add only)" onChange={handleChange} />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
            <button onClick={() => executeAction('POST', 'http://localhost:5000/api/games')} 
                    style={{ padding: '10px 15px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
                Add Game
            </button>
            
            <button onClick={() => executeAction('PUT', `http://localhost:5000/api/games/${formData.game_id}`)} 
                    style={{ padding: '10px 15px', background: '#FF9800', color: 'white', border: 'none', cursor: 'pointer' }}>
                Update Game
            </button>

            <button onClick={() => executeAction('DELETE', `http://localhost:5000/api/games/${formData.game_id}`)} 
                    style={{ padding: '10px 15px', background: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>
                Delete Game
            </button>
        </div>
    </div>
  );
};

export default GameManagement;