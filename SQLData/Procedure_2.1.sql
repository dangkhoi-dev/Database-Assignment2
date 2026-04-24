DELIMITER //

-- =============================================
-- 1. INSERT PROCEDURE
-- =============================================
CREATE PROCEDURE sp_InsertGame(
    IN p_title VARCHAR(100),
    IN p_base_price DECIMAL(10,2),
    IN p_release_date DATE,
    IN p_graphics VARCHAR(50),
    IN p_os VARCHAR(50),
    IN p_processor VARCHAR(50),
    IN p_memory VARCHAR(50),
    IN p_developer_id INT
)
BEGIN
    IF p_title IS NULL OR TRIM(p_title) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Game title cannot be empty.';
    END IF;

    IF CHAR_LENGTH(p_title) > 100 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Title exceeds 100 characters.';
    END IF;
    
    IF CHAR_LENGTH(p_graphics) > 50 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: System requirement [Graphics] fields cannot exceed 50 characters.';
    END IF;
    
    IF CHAR_LENGTH(p_os) > 50 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: System requirement fields [OS] cannot exceed 50 characters.';
    END IF;
    
    IF CHAR_LENGTH(p_processor) > 50 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: System requirement fields [Processor] cannot exceed 50 characters.';
    END IF;
    
    IF CHAR_LENGTH(p_memory) > 50 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: System requirement fields [Memory] cannot exceed 50 characters.';
    END IF;
    
    IF p_base_price IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Base price cannot be empty.';
    END IF;
    
    IF p_base_price < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Base price cannot be a negative value.';
    END IF;

    IF p_release_date > DATE_ADD(CURDATE(), INTERVAL 100 YEAR) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Release date is too far in the future.';
    END IF;

    IF p_release_date < '1950-01-01' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Release date is too far in the past.';
    END IF;
    
    IF p_developer_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Developer ID cannot be empty.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM `DEVELOPER` WHERE user_id = p_developer_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Developer ID does not exist.';
    END IF;

    IF EXISTS (SELECT 1 FROM `GAME` WHERE title = p_title) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: A game with this title already exists.';
    END IF;

    INSERT INTO `GAME` (title, base_price, release_date, graphics, os, processor, memory, developer_id)
    VALUES (TRIM(p_title), p_base_price, p_release_date, p_graphics, p_os, p_processor, p_memory, p_developer_id);
    
    SELECT 'Success: Game added successfully.' AS Result;
END //

-- =============================================
-- 2. UPDATE PROCEDURE
-- =============================================
CREATE PROCEDURE sp_UpdateGame(
    IN p_game_id INT,
    IN p_title VARCHAR(100),
    IN p_base_price DECIMAL(10,2),
    IN p_release_date DATE,
    IN p_graphics VARCHAR(50),
    IN p_os VARCHAR(50),
    IN p_processor VARCHAR(50),
    IN p_memory VARCHAR(50)
)
BEGIN
	
    IF p_game_id IS NULL THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Game ID cannot be empty.';
	END IF;
	
    IF NOT EXISTS (SELECT 1 FROM `GAME` WHERE game_id = p_game_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Cannot update. Game ID not found.';
    END IF;

    IF p_title IS NULL OR TRIM(p_title) = '' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Game title cannot be empty.';
    END IF;

    IF CHAR_LENGTH(p_title) > 100 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Title exceeds 100 characters.';
    END IF;
    
    IF CHAR_LENGTH(p_graphics) > 50 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: System requirement [Graphics] fields cannot exceed 50 characters.';
    END IF;
    
    IF CHAR_LENGTH(p_os) > 50 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: System requirement fields [OS] cannot exceed 50 characters.';
    END IF;
    
    IF CHAR_LENGTH(p_processor) > 50 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: System requirement fields [Processor] cannot exceed 50 characters.';
    END IF;
    
    IF CHAR_LENGTH(p_memory) > 50 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: System requirement fields [Memory] cannot exceed 50 characters.';
    END IF;
    
    IF p_base_price IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Base price cannot be empty.';
    END IF;
    
    IF p_base_price < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Base price cannot be a negative value.';
    END IF;

    IF p_release_date > DATE_ADD(CURDATE(), INTERVAL 100 YEAR) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Release date is too far in the future.';
    END IF;

    IF p_release_date < '1950-01-01' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Release date is too far in the past.';
    END IF;

    IF EXISTS (SELECT 1 FROM `GAME` WHERE title = p_title AND game_id != p_game_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: A game with this title already exists.';
    END IF;

    UPDATE `GAME`
    SET title = TRIM(p_title),
        base_price = p_base_price,
        release_date = p_release_date,
        graphics = p_graphics,
        os = p_os,
        processor = p_processor,
        memory = p_memory
    WHERE game_id = p_game_id;
    
    SELECT 'Success: Game updated successfully.' AS Result;
END //

-- =============================================
-- 3. DELETE PROCEDURE
-- =============================================
CREATE PROCEDURE sp_DeleteGame(
    IN p_game_id INT
)
BEGIN
	IF p_game_id IS NULL THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Game ID cannot be empty.';
	END IF;
    
    IF NOT EXISTS (SELECT 1 FROM `GAME` WHERE game_id = p_game_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Deletion failed. Game ID does not exist.';
    END IF;
    
    IF EXISTS (SELECT 1 FROM `OWNS_LIBRARY` WHERE game_id = p_game_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Cannot delete game. It is already owned by players in their library.';
    END IF;

    DELETE FROM `GAME` WHERE game_id = p_game_id;
    
    SELECT 'Success: Game deleted successfully.' AS Result;
END //

DELIMITER ;
