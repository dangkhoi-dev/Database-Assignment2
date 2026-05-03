DELIMITER //
CREATE PROCEDURE `GetGamesByGenreAndPrice`(
    IN p_GenreName VARCHAR(50),
    IN p_MaxPrice DECIMAL(10,2)
)
BEGIN
    SELECT
        g.game_id,
        g.title AS 'Game Title',
        g.base_price AS 'Base Price',
        g.release_date AS 'Release Date',
        d.legal_name AS 'Developer'
    FROM `GAME` g
    JOIN `GAME_GENRE` gg ON g.game_id = gg.game_id
    JOIN `DEVELOPER` d ON g.developer_id = d.user_id
    WHERE
        gg.genre_name = p_GenreName
        AND g.base_price <= p_MaxPrice
    ORDER BY
        g.base_price DESC,
        g.title ASC;
END //
DELIMITER ;