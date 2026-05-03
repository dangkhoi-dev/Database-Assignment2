const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình kết nối đến MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Change this to your MySQL password if you have one
    database: 'SteamDB'  
};

// =====================================================
// API ENDPOINTS FOR REVENUE REPORT (Khôi - 3.3)
// =====================================================
app.get('/api/revenue-report', async (req, res) => {
    const { startDate, endDate, minRevenue } = req.query;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'CALL GetDeveloperRevenue(?, ?, ?)', 
            [startDate, endDate, minRevenue]
        );
        res.json(rows[0]);
        await connection.end();
    } catch (error) {
        console.error('Lỗi Database:', error);
        res.status(500).json({ message: 'Lỗi truy xuất dữ liệu từ Database' });
    }
});

// =====================================================
// API ENDPOINTS FOR GAME MANAGEMENT (Hùng - 3.2)
// =====================================================

// Get all genres for dropdown
app.get('/api/genres', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT genre_name FROM GENRE ORDER BY genre_name'
        );
        const genres = rows.map(r => r.genre_name);
        res.json(genres);
        await connection.end();
    } catch (error) {
        console.error('Lỗi Database:', error);
        res.status(500).json({ message: 'Lỗi truy xuất thể loại game' });
    }
});

// Get all developers for dropdown
app.get('/api/developers', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT user_id, legal_name FROM DEVELOPER ORDER BY legal_name'
        );
        res.json(rows);
        await connection.end();
    } catch (error) {
        console.error('Lỗi Database:', error);
        res.status(500).json({ message: 'Lỗi truy xuất nhà phát triển' });
    }
});

// Get all games (for refresh list)
app.get('/api/games', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT g.game_id, g.title, g.base_price, g.release_date, d.legal_name as developer_name
            FROM GAME g
            JOIN DEVELOPER d ON g.developer_id = d.user_id
            ORDER BY g.game_id
        `);
        res.json(rows);
        await connection.end();
    } catch (error) {
        console.error('Lỗi Database:', error);
        res.status(500).json({ message: 'Lỗi truy xuất danh sách game' });
    }
});

// Search games by genre and max price (calls stored procedure GetGamesByGenreAndPrice)
app.post('/api/search', async (req, res) => {
    const { genre, maxPrice } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'CALL GetGamesByGenreAndPrice(?, ?)', 
            [genre, maxPrice]
        );
        res.json(rows[0]);
        await connection.end();
    } catch (error) {
        console.error('Lỗi Database:', error);
        res.status(500).json({ message: 'Lỗi tìm kiếm game' });
    }
});

// Add new game (calls sp_InsertGame)
app.post('/api/games', async (req, res) => {
    const { title, base_price, release_date, graphics, os, processor, memory, developer_id } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'CALL sp_InsertGame(?, ?, ?, ?, ?, ?, ?, ?)', 
            [title, base_price, release_date, graphics, os, processor, memory, developer_id]
        );
        res.json({ message: 'Game added successfully' });
        await connection.end();
    } catch (error) {
        console.error('Lỗi Database:', error);
        res.status(500).json({ message: error.message || 'Lỗi thêm game' });
    }
});

// Update game (calls sp_UpdateGame)
app.put('/api/games/:id', async (req, res) => {
    const gameId = req.params.id;
    const { title, base_price, release_date, graphics, os, processor, memory } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'CALL sp_UpdateGame(?, ?, ?, ?, ?, ?, ?, ?)', 
            [gameId, title, base_price, release_date, graphics, os, processor, memory]
        );
        res.json({ message: 'Game updated successfully' });
        await connection.end();
    } catch (error) {
        console.error('Lỗi Database:', error);
        res.status(500).json({ message: error.message || 'Lỗi cập nhật game' });
    }
});

// Delete game (calls sp_DeleteGame)
app.delete('/api/games/:id', async (req, res) => {
    const gameId = req.params.id;

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('CALL sp_DeleteGame(?)', [gameId]);
        res.json({ message: 'Game deleted successfully' });
        await connection.end();
    } catch (error) {
        console.error('Lỗi Database:', error);
        if (error.message.includes('already owned')) {
            res.status(400).json({ message: 'Cannot delete game that is already owned by players' });
        } else {
            res.status(500).json({ message: error.message || 'Lỗi xóa game' });
        }
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend Server đang chạy tại http://localhost:${PORT}`);
});