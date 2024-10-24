import React, { useState } from 'react';
import './App.css';
import logo from './finalLogo.png';
import AppCurrent from './AppCurrent'; 
import AppPast from './AppPast';

function Dashboard() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderComponent = () => {
    switch (currentPage) {
      case 'appCurrent':
        return <AppCurrent />;
      case 'appPast':
        return <AppPast />;
      default:
        return (
          <div>
            <header>
            
            <h1>Dashboard</h1>
            </header>
            
            <div className="dashboard-container">
                <img className="logo"
                    src={logo} 
                    alt="Logo" 
                />
                <div className="button-group">
                    <button onClick={() => setCurrentPage('appCurrent')}>
                        <h2>Service Requests</h2>
                    </button>
                    <button onClick={() => setCurrentPage('appPast')}>
                        <h2>Service Request History</h2>
                    </button>
                </div>
            </div>
          </div>

          
        );
    }
  };

  return (
    <div className="App">
      {renderComponent()} {/* This will display the appropriate component */}
    </div>
  );
}

export default Dashboard;
