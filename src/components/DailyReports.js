// src/components/DailyReports.js
import React, { useState } from 'react';

const DailyReports = () => {
  // State to manage the current date and reports
  const [currentDate, setCurrentDate] = useState('March 10, 2025');
  const [reports, setReports] = useState([
    {
      id: 1,
      time: '08:30 AM',
      item: 'Hydraulic Oil',
      transactionType: 'Stock In',
      quantity: '+10',
      user: 'Manticao-ACD',
      notes: 'Regular delivery'
    },
    {
      id: 2,
      time: '10:15 AM',
      item: 'Air Filter',
      transactionType: 'Stock Out',
      quantity: '-2',
      user: 'Manticao-ACD',
      notes: 'Routine maintenance'
    },
    {
      id: 3,
      time: '02:45 PM',
      item: 'Fuel Filter',
      transactionType: 'Stock Out',
      quantity: '-1',
      user: 'Tina J.',
      notes: 'Emergency repair'
    }
  ]);
  
  // Calculate summary statistics
  const itemsIn = reports.filter(report => report.transactionType === 'Stock In').length;
  const itemsOut = reports.filter(report => report.transactionType === 'Stock Out').length;
  const totalTransactions = reports.length;
  
  // Simulate navigation to previous day
  const goToPreviousDay = () => {
    // In a real app, this would load the previous day's data
    alert('Loading previous day data...');
  };
  
  // Simulate navigation to next day
  const goToNextDay = () => {
    // In a real app, this would load the next day's data
    alert('Loading next day data...');
  };

  return (
    <div className="content-section reports-section">
      <div className="card">
        <div className="report-title">Daily Transaction Log</div>
        
        <div className="date-selector">
          <button className="date-nav prev" onClick={goToPreviousDay}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="current-date">{currentDate}</div>
          <button className="date-nav next" onClick={goToNextDay}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <div className="report-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Item</th>
                <th>Transaction Type</th>
                <th>Quantity</th>
                <th>User</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map(report => (
                  <tr key={report.id}>
                    <td>{report.time}</td>
                    <td>{report.item}</td>
                    <td>
                      <span className={`transaction-badge ${report.transactionType.toLowerCase().replace(' ', '-')}`}>
                        {report.transactionType}
                      </span>
                    </td>
                    <td>{report.quantity}</td>
                    <td>{report.user}</td>
                    <td>{report.notes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    No transactions recorded for this day.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="report-summary card">
          <div className="summary-title">Daily Summary</div>
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-label">Items In</div>
              <div className="stat-value">{itemsIn}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Items Out</div>
              <div className="stat-value">{itemsOut}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Total Transactions</div>
              <div className="stat-value">{totalTransactions}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReports;