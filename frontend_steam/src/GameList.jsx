import React, { useState, useEffect } from 'react';

// =====================================================
// BACKEND API CONFIGURATION
// =====================================================
const API_BASE_URL = 'http://localhost:5000/api';

// =====================================================
// MAIN COMPONENT: GameList
// =====================================================
function GameList() {
    // State variables
    const [games, setGames] = useState([]);
    const [genres, setGenres] = useState([]);
    const [developers, setDevelopers] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedGameId, setSelectedGameId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        game_id: null,
        title: '',
        base_price: '',
        release_date: '',
        os: '',
        processor: '',
        memory: '',
        graphics: '',
        developer_id: ''
    });
    
    // =====================================================
    // FETCH DATA FROM BACKEND
    // =====================================================
    
    // Fetch all games
    const fetchGames = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/games`);
            if (!response.ok) throw new Error('Failed to fetch games');
            const data = await response.json();
            setGames(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch genres for dropdown
    const fetchGenres = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/genres`);
            if (!response.ok) throw new Error('Failed to fetch genres');
            const data = await response.json();
            setGenres(data);
            if (data.length > 0) setSelectedGenre(data[0]);
        } catch (err) {
            console.error('Error fetching genres:', err);
        }
    };
    
    // Fetch developers for dropdown
    const fetchDevelopers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/developers`);
            if (!response.ok) throw new Error('Failed to fetch developers');
            const data = await response.json();
            setDevelopers(data);
        } catch (err) {
            console.error('Error fetching developers:', err);
        }
    };
    
    // Search games by genre and max price (calls stored procedure from 2.3)
    const searchGames = async () => {
        if (!selectedGenre) {
            setError('Please select a genre');
            return;
        }
        if (!maxPrice || parseFloat(maxPrice) < 0) {
            setError('Please enter a valid max price');
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    genre: selectedGenre,
                    maxPrice: parseFloat(maxPrice)
                })
            });
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            setGames(data);
            if (data.length === 0) {
                setError(`No games found for genre "${selectedGenre}" under ${maxPrice} USD`);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // Clear search and show all games
    const clearSearch = async () => {
        setMaxPrice('');
        setError(null);
        await fetchGames();
    };
    
    // =====================================================
    // CRUD OPERATIONS (calls procedures from 2.1)
    // =====================================================
    
    // Add new game (calls sp_InsertGame)
    const addGame = async () => {
        // Validation
        if (!formData.title.trim()) {
            setError('Game title cannot be empty');
            return;
        }
        const price = parseFloat(formData.base_price);
        if (isNaN(price) || price < 0) {
            setError('Price must be a positive number');
            return;
        }
        if (!formData.release_date) {
            setError('Release date is required');
            return;
        }
        if (!formData.developer_id) {
            setError('Please select a developer');
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/games`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title.trim(),
                    base_price: price,
                    release_date: formData.release_date,
                    graphics: formData.graphics,
                    os: formData.os,
                    processor: formData.processor,
                    memory: formData.memory,
                    developer_id: parseInt(formData.developer_id)
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add game');
            }
            setSuccess('Game added successfully!');
            setTimeout(() => setSuccess(null), 3000);
            closeModal();
            await fetchGames();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // Update game (calls sp_UpdateGame)
    const updateGame = async () => {
        if (!formData.title.trim()) {
            setError('Game title cannot be empty');
            return;
        }
        const price = parseFloat(formData.base_price);
        if (isNaN(price) || price < 0) {
            setError('Price must be a positive number');
            return;
        }
        if (!formData.release_date) {
            setError('Release date is required');
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/games/${formData.game_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title.trim(),
                    base_price: price,
                    release_date: formData.release_date,
                    graphics: formData.graphics,
                    os: formData.os,
                    processor: formData.processor,
                    memory: formData.memory
                })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update game');
            }
            setSuccess('Game updated successfully!');
            setTimeout(() => setSuccess(null), 3000);
            closeModal();
            await fetchGames();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // Delete game (calls sp_DeleteGame)
    const deleteGame = async () => {
        if (!selectedGameId) {
            setError('Please select a game first');
            return;
        }
        
        const gameToDelete = games.find(g => g.game_id === selectedGameId);
        if (!gameToDelete) return;
        
        if (window.confirm(`Are you sure you want to delete "${gameToDelete.title}"?\nThis action cannot be undone.`)) {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/games/${selectedGameId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to delete game');
                }
                setSuccess('Game deleted successfully!');
                setTimeout(() => setSuccess(null), 3000);
                setSelectedGameId(null);
                await fetchGames();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };
    
    // =====================================================
    // MODAL FUNCTIONS
    // =====================================================
    
    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({
            game_id: null,
            title: '',
            base_price: '',
            release_date: new Date().toISOString().split('T')[0],
            os: '',
            processor: '',
            memory: '',
            graphics: '',
            developer_id: developers.length > 0 ? developers[0].user_id : ''
        });
        setShowModal(true);
    };
    
    const openEditModal = () => {
        if (!selectedGameId) {
            setError('Please select a game first');
            return;
        }
        
        const game = games.find(g => g.game_id === selectedGameId);
        if (!game) {
            setError('Game not found');
            return;
        }
        
        setIsEditMode(true);
        setFormData({
            game_id: game.game_id,
            title: game.title,
            base_price: game.base_price,
            release_date: game.release_date ? game.release_date.split('T')[0] : '',
            os: '',
            processor: '',
            memory: '',
            graphics: '',
            developer_id: ''
        });
        setShowModal(true);
    };
    
    const closeModal = () => {
        setShowModal(false);
        setFormData({
            game_id: null,
            title: '',
            base_price: '',
            release_date: '',
            os: '',
            processor: '',
            memory: '',
            graphics: '',
            developer_id: ''
        });
        setError(null);
    };
    
    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSave = () => {
        if (isEditMode) {
            updateGame();
        } else {
            addGame();
        }
    };
    
    // =====================================================
    // EFFECTS
    // =====================================================
    
    useEffect(() => {
        fetchGames();
        fetchGenres();
        fetchDevelopers();
    }, []);
    
    // =====================================================
    // RENDER
    // =====================================================
    
    return (
        <div className="game-list-container">
            {/* Header Section */}
            <div className="game-list-header">
                <h2 className="steamH2">🎮 Game Management</h2>
                <p className="steamMuted">Search, add, edit, and delete games in the system</p>
            </div>
            
            {/* Search Section */}
            <div className="search-section">
                <h3 className="steamH3">🔍 Search Games</h3>
                <div className="search-form">
                    <div className="form-group">
                        <label>Genre:</label>
                        <select 
                            value={selectedGenre} 
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="steamInput"
                        >
                            {genres.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Max Price (USD):</label>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="Enter max price"
                            className="steamInput"
                            step="0.01"
                        />
                    </div>
                    <div className="form-group-buttons">
                        <button onClick={searchGames} className="steamBtn steamBtnPrimary" disabled={loading}>
                            {loading ? 'Loading...' : '🔎 Search'}
                        </button>
                        <button onClick={clearSearch} className="steamBtn steamBtnSecondary">
                            🗑️ Clear
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Error/Success Messages */}
            {error && (
                <div className="steamError">
                    ⚠️ {error}
                    <button onClick={() => setError(null)} className="close-msg">×</button>
                </div>
            )}
            {success && (
                <div className="steamSuccess">
                    ✅ {success}
                    <button onClick={() => setSuccess(null)} className="close-msg">×</button>
                </div>
            )}
            
            {/* Game Table Section */}
            <div className="table-section">
                <div className="table-header">
                    <h3 className="steamH3">📋 Game List</h3>
                    <button onClick={fetchGames} className="steamBtn steamBtnSmall" disabled={loading}>
                        🔄 Refresh
                    </button>
                </div>
                
                <div className="table-wrapper">
                    {loading && games.length === 0 ? (
                        <div className="steamLoading">Loading data...</div>
                    ) : (
                        <table className="steamTable">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Game Title</th>
                                    <th>Price (USD)</th>
                                    <th>Release Date</th>
                                    <th>Developer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {games.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="steamEmptyTable">No data available</td>
                                    </tr>
                                ) : (
                                    games.map(game => (
                                        <tr
                                            key={game.game_id}
                                            onClick={() => setSelectedGameId(game.game_id)}
                                            className={selectedGameId === game.game_id ? 'selected-row' : ''}
                                        >
                                            <td>{game.game_id}</td>
                                            <td>{game.title}</td>
                                            <td>{parseFloat(game.base_price).toFixed(2)}</td>
                                            <td>{game.release_date ? game.release_date.split('T')[0] : 'N/A'}</td>
                                            <td>{game.developer_name}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            
            {/* Action Buttons Section */}
            <div className="action-buttons">
                <button onClick={openAddModal} className="steamBtn steamBtnSuccess">
                    ➕ Add New Game
                </button>
                <button onClick={openEditModal} className="steamBtn steamBtnWarning">
                    ✏️ Edit Selected
                </button>
                <button onClick={deleteGame} className="steamBtn steamBtnDanger">
                    🗑️ Delete Selected
                </button>
            </div>
            
            {/* Modal for Add/Edit */}
            {showModal && (
                <div className="steamModal" onClick={closeModal}>
                    <div className="steamModalContent" onClick={(e) => e.stopPropagation()}>
                        <div className="steamModalHeader">
                            <h3>{isEditMode ? '✏️ Edit Game' : '➕ Add New Game'}</h3>
                            <button className="steamModalClose" onClick={closeModal}>×</button>
                        </div>
                        <div className="steamModalBody">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Game Title *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleFormChange}
                                        className="steamInput"
                                        placeholder="Enter game title"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price (USD) *</label>
                                    <input
                                        type="number"
                                        name="base_price"
                                        value={formData.base_price}
                                        onChange={handleFormChange}
                                        className="steamInput"
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Release Date *</label>
                                    <input
                                        type="date"
                                        name="release_date"
                                        value={formData.release_date}
                                        onChange={handleFormChange}
                                        className="steamInput"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Developer {!isEditMode && '*'}</label>
                                    <select
                                        name="developer_id"
                                        value={formData.developer_id}
                                        onChange={handleFormChange}
                                        className="steamInput"
                                        disabled={isEditMode}
                                    >
                                        <option value="">Select a developer</option>
                                        {developers.map(dev => (
                                            <option key={dev.user_id} value={dev.user_id}>
                                                {dev.legal_name}
                                            </option>
                                        ))}
                                    </select>
                                    {isEditMode && <small className="steamMuted">Developer cannot be changed when editing</small>}
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Operating System (OS)</label>
                                    <input
                                        type="text"
                                        name="os"
                                        value={formData.os}
                                        onChange={handleFormChange}
                                        className="steamInput"
                                        placeholder="e.g., Windows 10"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>CPU</label>
                                    <input
                                        type="text"
                                        name="processor"
                                        value={formData.processor}
                                        onChange={handleFormChange}
                                        className="steamInput"
                                        placeholder="e.g., Intel i5"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>RAM</label>
                                    <input
                                        type="text"
                                        name="memory"
                                        value={formData.memory}
                                        onChange={handleFormChange}
                                        className="steamInput"
                                        placeholder="e.g., 8GB"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Graphics Card</label>
                                    <input
                                        type="text"
                                        name="graphics"
                                        value={formData.graphics}
                                        onChange={handleFormChange}
                                        className="steamInput"
                                        placeholder="e.g., GTX 1060"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="steamModalFooter">
                            <button onClick={closeModal} className="steamBtn steamBtnSecondary">Cancel</button>
                            <button onClick={handleSave} className="steamBtn steamBtnPrimary" disabled={loading}>
                                {loading ? 'Processing...' : (isEditMode ? 'Update' : 'Add')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* CSS Styles */}
            <style jsx="true">{`
                .game-list-container {
                    padding: 10px;
                }
                .game-list-header {
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .search-section {
                    background: rgba(0,0,0,0.2);
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .search-form {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                    align-items: flex-end;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    flex: 1;
                    min-width: 150px;
                }
                .form-group-buttons {
                    display: flex;
                    gap: 10px;
                }
                .table-section {
                    background: rgba(0,0,0,0.2);
                    border-radius: 8px;
                    margin-bottom: 20px;
                    overflow: hidden;
                }
                .table-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .table-wrapper {
                    overflow-x: auto;
                    max-height: 400px;
                    overflow-y: auto;
                }
                .steamTable {
                    width: 100%;
                    border-collapse: collapse;
                }
                .steamTable th,
                .steamTable td {
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .steamTable th {
                    background: rgba(0,0,0,0.3);
                    font-weight: 600;
                    position: sticky;
                    top: 0;
                }
                .steamTable tbody tr:hover {
                    background: rgba(255,255,255,0.05);
                    cursor: pointer;
                }
                .steamTable .selected-row {
                    background: rgba(233,69,96,0.2);
                    border-left: 3px solid #e94560;
                }
                .action-buttons {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                    padding-top: 10px;
                }
                .steamError {
                    background: rgba(220,53,69,0.2);
                    border: 1px solid #dc3545;
                    color: #ff6b6b;
                    padding: 12px 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    position: relative;
                }
                .steamSuccess {
                    background: rgba(40,167,69,0.2);
                    border: 1px solid #28a745;
                    color: #6bff6b;
                    padding: 12px 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    position: relative;
                }
                .close-msg {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 18px;
                    cursor: pointer;
                }
                .steamLoading {
                    text-align: center;
                    padding: 40px;
                    color: rgba(255,255,255,0.5);
                }
                .steamEmptyTable {
                    text-align: center;
                    padding: 30px;
                    color: rgba(255,255,255,0.4);
                }
                .steamModal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .steamModalContent {
                    background: #1a1a2e;
                    border-radius: 12px;
                    width: 600px;
                    max-width: 90%;
                    max-height: 85vh;
                    overflow-y: auto;
                }
                .steamModalHeader {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                .steamModalBody {
                    padding: 20px;
                }
                .steamModalFooter {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding: 15px 20px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }
                .steamModalClose {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                }
                .form-row {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 15px;
                }
                .form-row .form-group {
                    flex: 1;
                }
                .steamInput, .steamBtn, .steamBtnSmall, .steamBtnPrimary, .steamBtnSecondary, .steamBtnSuccess, .steamBtnWarning, .steamBtnDanger {
                    border-radius: 4px;
                    font-family: inherit;
                }
            `}</style>
        </div>
    );
}

export default GameList;