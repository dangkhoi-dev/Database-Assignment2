CREATE PROCEDURE GetGamesByGenreAndPrice(
    IN p_GenreName VARCHAR(50),
    IN p_MaxPrice DECIMAL(10,2)
)
BEGIN
    SELECT 
        g.game_id, 
        g.title AS 'Tên Game', 
        g.base_price AS 'Giá Gốc', 
        g.release_date AS 'Ngày Phát Hành',
        d.legal_name AS 'Nhà Phát Triển'
    FROM `GAME` g
    JOIN `GAME_GENRE` gg ON g.game_id = gg.game_id
    JOIN `DEVELOPER` d ON g.developer_id = d.user_id
    WHERE 
        gg.genre_name = p_GenreName 
        AND g.base_price <= p_MaxPrice
    ORDER BY 
        g.base_price DESC, 
        g.title ASC;      
END