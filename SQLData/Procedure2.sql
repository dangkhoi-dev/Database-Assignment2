-- Test Procedure 1: Find RPG games priced under 1,000,000
CALL GetGamesByGenreAndPrice('RPG', 1000000);

-- Test Procedure 2: List Developers with revenue over 500,000 from 2023 through end of 2024
CALL GetDeveloperRevenue('2023-01-01', '2024-12-31', 500000);
