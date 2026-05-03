DELIMITER $$

CREATE PROCEDURE GetGamesByGenreAndPrice(
    IN p_GenreName VARCHAR(50),
    IN p_MaxPrice DECIMAL(10,2)
)
BEGIN
    SELECT
        g.game_id,
        g.title AS `Tên Game`,
        g.base_price AS `Giá Gốc`,
        g.release_date AS `Ngày Phát Hành`,
        d.legal_name AS `Nhà Phát Triển`
    FROM `GAME` g
    JOIN `GAME_GENRE` gg ON g.game_id = gg.game_id
    JOIN `DEVELOPER` d ON g.developer_id = d.user_id
    WHERE gg.genre_name = p_GenreName
      AND g.base_price <= p_MaxPrice
    ORDER BY g.base_price DESC, g.title ASC;
END$$

CREATE PROCEDURE GetDeveloperRevenue(
    IN p_StartDate DATE,
    IN p_EndDate DATE,
    IN p_MinRevenue DECIMAL(15,2)
)
BEGIN
    SELECT
        d.legal_name AS `Nhà Phát Triển`,
        COUNT(c.game_id) AS `Tổng Số Lượt Bán`,
        SUM(c.price_at_purchase) AS `Tổng Doanh Thu`
    FROM `DEVELOPER` d
    JOIN `GAME` g ON d.user_id = g.developer_id
    JOIN `CONTAINS` c ON g.game_id = c.game_id
    JOIN `TRANSACTION` t ON c.transaction_id = t.transaction_id
    WHERE DATE(t.date) >= p_StartDate
      AND DATE(t.date) <= p_EndDate
    GROUP BY d.user_id, d.legal_name
    HAVING SUM(c.price_at_purchase) >= p_MinRevenue
    ORDER BY SUM(c.price_at_purchase) DESC;
END$$

DELIMITER ;