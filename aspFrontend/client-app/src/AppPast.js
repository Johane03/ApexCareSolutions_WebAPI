import React from 'react';
import ServiceRequestsTable from './ServiceRequestHistory'; 
import './App.css';
import arrow from './arrow.png';

function AppPast() {
  const goToDashboard = () => {
    window.location.href = './';
  };

  return (
    <div className="App">
      <header className='nav'>
        <button onClick={goToDashboard} className="dashboard-button">
        <img
          src={arrow}
          alt="Arrow"
          width="50"
          height="50"
          backgroundColor="transparent"
        />
        </button>
        <h1>Service Request History</h1>
      </header>
      <ServiceRequestsTable />  
    </div>
  );
}

export default AppPast;
