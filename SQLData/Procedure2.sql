-- Test Procedure 1: Tìm game RPG giá dưới 1 triệu
CALL GetGamesByGenreAndPrice('RPG', 1000000);

-- Test Procedure 2: Xem Developer nào bán được trên 500k từ 2023 đến hết 2024
CALL GetDeveloperRevenue('2023-01-01', '2024-12-31', 500000);