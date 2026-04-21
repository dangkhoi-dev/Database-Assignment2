import React, { useState } from 'react';
// 1. Import các giao diện của từng thành viên vào
import RevenueReport from './RevenueReport'; // File của bạn (Khôi - Mục 3.3)
// import GameList from './GameList';         // File của Hùng (Mục 3.2)
// import GameForm from './GameForm';         // File của Ân (Mục 3.1)
import './App.css';

function App() {
  // State để nhớ xem người dùng đang bấm vào Tab nào
  const [activeTab, setActiveTab] = useState('report');

  return (
    <div className="steamApp">
      <div className="steamShell">
        <header className="steamTopBar">
          <div className="steamTitleRow">
            <h1 className="steamTitle">Steam Store Management</h1>
            <p className="steamSubtitle">Dashboard nội bộ • theme mô phỏng Steam</p>
          </div>

          {/* 2. Thanh Menu Điều Hướng */}
          <nav className="steamTabs" aria-label="Điều hướng">
            <button
              type="button"
              className={`steamTab ${activeTab === 'list' ? 'steamTabActive' : ''}`}
              onClick={() => setActiveTab('list')}
            >
              Quản lý Game (Hùng)
            </button>
            <button
              type="button"
              className={`steamTab ${activeTab === 'form' ? 'steamTabActive' : ''}`}
              onClick={() => setActiveTab('form')}
            >
              Thêm/Sửa/Xóa (Ân)
            </button>
            <button
              type="button"
              className={`steamTab ${activeTab === 'report' ? 'steamTabActive' : ''}`}
              onClick={() => setActiveTab('report')}
            >
              Báo cáo Doanh thu (Khôi)
            </button>
          </nav>
        </header>

        {/* 3. Khu vực hiển thị Component (Mảnh ghép) tương ứng */}
        <main className="steamMainCard">
          {activeTab === 'report' && <RevenueReport />}
          {activeTab === 'list' && (
            <div className="steamEmpty">
              <div className="steamH2">Quản lý Game</div>
              <div className="steamMuted">Chưa gắn component `GameList`.</div>
            </div>
          )}
          {activeTab === 'form' && (
            <div className="steamEmpty">
              <div className="steamH2">Thêm/Sửa/Xóa</div>
              <div className="steamMuted">Chưa gắn component `GameForm`.</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;