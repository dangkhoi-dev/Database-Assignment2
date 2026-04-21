CREATE TABLE `USER` (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    join_date DATE NOT NULL
);

CREATE TABLE `PLAYER` (
    user_id INT PRIMARY KEY,
    wallet_balance DECIMAL(10,2) DEFAULT 0 CHECK (wallet_balance >= 0),
    profile_bio TEXT,
    FOREIGN KEY (user_id) REFERENCES `USER`(user_id)
);

CREATE TABLE `DEVELOPER` (
    user_id INT PRIMARY KEY,
    legal_name VARCHAR(100) NOT NULL,
    bank_account VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES `USER`(user_id)
);

CREATE TABLE `CONTACT_PHONE` (
    developer_user_id INT NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    PRIMARY KEY (developer_user_id, contact_phone),
    FOREIGN KEY (developer_user_id) REFERENCES `DEVELOPER`(user_id) ON DELETE CASCADE
);

CREATE TABLE `GAME` (
    game_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
    release_date DATE,
    graphics VARCHAR(50),
    os VARCHAR(50),
    processor VARCHAR(50),
    memory VARCHAR(50),
    developer_id INT NOT NULL,
    FOREIGN KEY (developer_id) REFERENCES `DEVELOPER`(user_id)
);

CREATE TABLE `PROMOTION` (
    promotion_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    discount_percentage DECIMAL(5,2) CHECK (discount_percentage > 0 AND discount_percentage <= 100),
    start_date DATE,
    end_date DATE,
    CHECK (end_date > start_date)
);

CREATE TABLE `GENRE` (
    genre_name VARCHAR(50) NOT NULL UNIQUE PRIMARY KEY,
    description TEXT
);

CREATE TABLE `DLC` (
    game_id INT NOT NULL,
    dlc_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) CHECK (price >= 0),
    release_date DATE,
    PRIMARY KEY (game_id, dlc_name),
    FOREIGN KEY (game_id) REFERENCES `GAME`(game_id)
);

CREATE TABLE `ACHIEVEMENT` (
    game_id INT NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    points INT CHECK (points >= 0),
    description TEXT,
    PRIMARY KEY (game_id, achievement_name),
    FOREIGN KEY (game_id) REFERENCES `GAME`(game_id)
);

CREATE TABLE `REVIEW` (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    rating VARCHAR(20) NOT NULL CHECK (rating IN ('Recommended', 'Not Recommended')),
    comment TEXT,
    review_date DATE,
    player_id INT NOT NULL,
    game_id INT NOT NULL,
    UNIQUE (player_id, game_id),
    FOREIGN KEY (player_id) REFERENCES `PLAYER`(user_id),
    FOREIGN KEY (game_id) REFERENCES `GAME`(game_id)
);

CREATE TABLE `CART` (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    last_updated DATETIME,
    player_id INT UNIQUE, 
    FOREIGN KEY (player_id) REFERENCES `PLAYER`(user_id)
);

CREATE TABLE `TRANSACTION` (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    date DATETIME NOT NULL,
    payment_method VARCHAR(50),
    total_amount DECIMAL(10,2) CHECK (total_amount >= 0),
    player_id INT NOT NULL,
    FOREIGN KEY (player_id) REFERENCES `PLAYER`(user_id)
);

CREATE TABLE `FRIENDS` (
    player_id INT,
    friend_id INT,
    PRIMARY KEY (player_id, friend_id),
    FOREIGN KEY (player_id) REFERENCES `PLAYER`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES `PLAYER`(user_id) ON DELETE CASCADE,
    CHECK (player_id <> friend_id)
);

CREATE TABLE `OWNS_LIBRARY` (
    player_id INT,
    game_id INT,
    purchase_date DATE,
    total_playtime INT DEFAULT 0 CHECK (total_playtime >= 0),
    PRIMARY KEY (player_id, game_id),
    FOREIGN KEY (player_id) REFERENCES `PLAYER`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES `GAME`(game_id) ON DELETE CASCADE
);

CREATE TABLE `CONTAINS` (
    transaction_id INT,
    game_id INT,
    price_at_purchase DECIMAL(10,2) CHECK (price_at_purchase >= 0),
    PRIMARY KEY (transaction_id, game_id),
    FOREIGN KEY (transaction_id) REFERENCES `TRANSACTION`(transaction_id),
    FOREIGN KEY (game_id) REFERENCES `GAME`(game_id)
);

CREATE TABLE `GAME_PROMOTION` (
    game_id INT,
    promotion_id INT,
    PRIMARY KEY (game_id, promotion_id),
    FOREIGN KEY (game_id) REFERENCES `GAME`(game_id),
    FOREIGN KEY (promotion_id) REFERENCES `PROMOTION`(promotion_id)
);

CREATE TABLE `GAME_GENRE` (
    game_id INT,
    genre_name VARCHAR(50),
    PRIMARY KEY (game_id, genre_name),
    FOREIGN KEY (game_id) REFERENCES `GAME`(game_id),
    FOREIGN KEY (genre_name) REFERENCES `GENRE`(genre_name)
);

CREATE TABLE `QUEUE` (
    cart_id INT,
    game_id INT,
    PRIMARY KEY (cart_id, game_id),
    FOREIGN KEY (cart_id) REFERENCES `CART`(cart_id),
    FOREIGN KEY (game_id) REFERENCES `GAME`(game_id)
);

CREATE TABLE `PLAYER_ACHIEVEMENT` (
    player_id INT,
    game_id INT,
    achievement_name VARCHAR(100),
    unlock_date DATE,
    PRIMARY KEY (player_id, game_id, achievement_name),
    FOREIGN KEY (player_id) REFERENCES `PLAYER`(user_id),
    FOREIGN KEY (game_id, achievement_name) REFERENCES `ACHIEVEMENT`(game_id, achievement_name)
);

CREATE TABLE `BUY_DLC` (
    transaction_id INT,
    game_id INT,
    dlc_name VARCHAR(100),
    purchase_date DATE,
    PRIMARY KEY (transaction_id, game_id, dlc_name),
    FOREIGN KEY (transaction_id) REFERENCES `TRANSACTION`(transaction_id) ON DELETE CASCADE,
    FOREIGN KEY (game_id, dlc_name) REFERENCES `DLC`(game_id, dlc_name) ON DELETE CASCADE
);

CREATE TABLE `OWNS_DLC` (
    player_id INT,
    game_id INT,
    dlc_name VARCHAR(100),
    purchase_date DATE,
    PRIMARY KEY (player_id, game_id, dlc_name),
    FOREIGN KEY (player_id) REFERENCES `PLAYER`(user_id) ON DELETE CASCADE,
    FOREIGN KEY (game_id, dlc_name) REFERENCES `DLC`(game_id, dlc_name) ON DELETE CASCADE
);