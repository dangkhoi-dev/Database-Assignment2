import React, { useState } from 'react';
// 1. Import components
import RevenueReport from './RevenueReport';
// import GameList from './GameList';
import GameManagement from './GameManagement'; 
import './App.css';

function App() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState('report');

  return (
    <div className="steamApp">
      <div className="steamShell">
        <header className="steamTopBar">
          <div className="steamTitleRow">
            <h1 className="steamTitle">Steam Store Management</h1>
            <p className="steamSubtitle">Internal Dashboard • Steam-inspired theme</p>
          </div>

          {/* 2. Navigation Menu */}
          <nav className="steamTabs" aria-label="Navigation">
            <button
              type="button"
              className={`steamTab ${activeTab === 'list' ? 'steamTabActive' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              Game List
            </button>
            <button
              type="button"
              className={`steamTab ${activeTab === 'form' ? 'steamTabActive' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              Add/Edit/Delete
            </button>
            <button
              type="button"
              className={`steamTab ${activeTab === 'report' ? 'steamTabActive' : ''}`}
              onClick={() => setActiveTab('report')}
            >
              Revenue Report
            </button>
          </nav>
        </header>

        {/* 3. Render the active component */}
        <main className="steamMainCard">
          {activeTab === 'report' && <RevenueReport />}
          {activeTab === 'list' && (
            <div className="steamEmpty">
              <div className="steamH2">Game List</div>
              <div className="steamMuted">Component `GameList` is not yet integrated.</div>
            </div>
          )}
          {activeTab === 'form' && <GameManagement />}
        </main>
      </div>
    </div>
  );
}

export default App;