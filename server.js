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

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend Server đang chạy tại http://localhost:${PORT}`);
});