const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình kết nối đến XAMPP MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root', // Tên user mặc định của XAMPP
    password: '', // Mật khẩu mặc định của XAMPP thường để trống
    database: 'SteamDB'
};

// API Endpoint gọi Procedure
app.get('/api/revenue-report', async (req, res) => {
    const { startDate, endDate, minRevenue } = req.query;

    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Gọi Stored Procedure bằng lệnh CALL
        const [rows] = await connection.execute(
            'CALL GetDeveloperRevenue(?, ?, ?)', 
            [startDate, endDate, minRevenue]
        );

        // Result của Procedure luôn nằm ở mảng đầu tiên
        res.json(rows[0]); 
        await connection.end();
    } catch (error) {
        console.error('Lỗi Database:', error);
        res.status(500).json({ message: 'Lỗi truy xuất dữ liệu từ Database' });
    }
});

// --- API CHO PART 3.1: QUẢN LÝ BẢNG GAME ---

// 1. Thêm Game (Gọi sp_InsertGame)
app.post('/api/games', async (req, res) => {
    const { title, base_price, release_date, graphics, os, processor, memory, developer_id } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'CALL sp_InsertGame(?, ?, ?, ?, ?, ?, ?, ?)',
            [title, base_price, release_date, graphics, os, processor, memory, developer_id]
        );
        res.json({ message: 'Success: Thêm game thành công!' });
        await connection.end();
    } catch (error) {
        // Bắt lỗi validation từ SIGNAL SQLSTATE trong SQL
        res.status(400).json({ message: error.message }); 
    }
});

// 2. Sửa Game (Gọi sp_UpdateGame)
app.put('/api/games/:id', async (req, res) => {
    const game_id = req.params.id;
    const { title, base_price, release_date, graphics, os, processor, memory } = req.body;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'CALL sp_UpdateGame(?, ?, ?, ?, ?, ?, ?, ?)',
            [game_id, title, base_price, release_date, graphics, os, processor, memory]
        );
        res.json({ message: 'Success: Cập nhật game thành công!' });
        await connection.end();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 3. Xóa Game (Gọi sp_DeleteGame)
app.delete('/api/games/:id', async (req, res) => {
    const game_id = req.params.id;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'CALL sp_DeleteGame(?)',
            [game_id]
        );
        res.json({ message: 'Success: Xóa game thành công!' });
        await connection.end();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend Server đang chạy tại http://localhost:${PORT}`);
});