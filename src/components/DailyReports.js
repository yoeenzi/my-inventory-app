// src/components/DailyReports.js
import React, { useState } from 'react';
import '../styles/ReportStyles.css';

const DailyReports = () => {
  // State to manage the current date and reports
  const [currentDate, setCurrentDate] = useState('March 19, 2025');
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
  
  // Calculate total quantity changes
  const totalQuantityIn = reports
    .filter(report => report.transactionType === 'Stock In')
    .reduce((sum, report) => sum + parseInt(report.quantity.replace('+', '')), 0);
  
  const totalQuantityOut = reports
    .filter(report => report.transactionType === 'Stock Out')
    .reduce((sum, report) => sum + Math.abs(parseInt(report.quantity.replace('-', ''))), 0);
  
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
      <div className="report-header-actions">
        <div className="report-title-section">
          <i className="fas fa-clipboard-list"></i>
          <h2>Daily Transaction Log</h2>
        </div>
        
        <div className="report-actions">
          <button className="action-btn print-btn">
            <i className="fas fa-print"></i> Print
          </button>
          <button className="action-btn excel-btn">
            <i className="fas fa-file-excel"></i> Export
          </button>
        </div>
      </div>
      
      <div className="reports-container">
        {/* Date Navigation Card */}
        <div className="date-nav-card">
          <button className="date-nav-btn prev" onClick={goToPreviousDay}>
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="date-display">
            <div className="date-label">Current Date</div>
            <div className="current-date">
              <i className="far fa-calendar-alt"></i>
              <span>{currentDate}</span>
            </div>
          </div>
          
          <button className="date-nav-btn next" onClick={goToNextDay}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        {/* Summary Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card in">
            <div className="stat-icon">
              <i className="fas fa-arrow-circle-down"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{itemsIn}</div>
              <div className="stat-label">Items In</div>
              <div className="stat-quantity">+{totalQuantityIn} units</div>
            </div>
          </div>
          
          <div className="stat-card out">
            <div className="stat-icon">
              <i className="fas fa-arrow-circle-up"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{itemsOut}</div>
              <div className="stat-label">Items Out</div>
              <div className="stat-quantity">-{totalQuantityOut} units</div>
            </div>
          </div>
          
          <div className="stat-card total">
            <div className="stat-icon">
              <i className="fas fa-exchange-alt"></i>
            </div>
            <div className="stat-details">
              <div className="stat-value">{totalTransactions}</div>
              <div className="stat-label">Total Transactions</div>
              <div className="stat-quantity">Daily Activity</div>
            </div>
          </div>
        </div>
        
        {/* Transactions Table Card */}
        <div className="table-card">
          <div className="table-header">
            <h3><i className="fas fa-history"></i> Transaction History</h3>
            <div className="table-actions">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search transactions" />
              </div>
              <div className="filter-dropdown">
                <button className="filter-btn">
                  <i className="fas fa-filter"></i> Filter
                </button>
              </div>
            </div>
          </div>
          
          <div className="table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th><span>Time <i className="fas fa-sort"></i></span></th>
                  <th><span>Item <i className="fas fa-sort"></i></span></th>
                  <th><span>Transaction Type</span></th>
                  <th><span>Quantity <i className="fas fa-sort"></i></span></th>
                  <th><span>User <i className="fas fa-sort"></i></span></th>
                  <th><span>Notes</span></th>
                </tr>
              </thead>
              <tbody>
                {reports.length > 0 ? (
                  reports.map(report => (
                    <tr key={report.id}>
                      <td>
                        <div className="cell-with-icon">
                          <i className="far fa-clock"></i>
                          <span>{report.time}</span>
                        </div>
                      </td>
                      <td>
                        <div className="item-cell">
                          {report.item}
                        </div>
                      </td>
                      <td>
                        <span className={`transaction-badge ${report.transactionType === 'Stock In' ? 'stock-in' : 'stock-out'}`}>
                          <i className={`fas fa-${report.transactionType === 'Stock In' ? 'arrow-down' : 'arrow-up'}`}></i>
                          {report.transactionType}
                        </span>
                      </td>
                      <td>
                        <span className={`quantity-value ${report.quantity.includes('+') ? 'positive' : 'negative'}`}>
                          {report.quantity}
                        </span>
                      </td>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {report.user.charAt(0)}
                          </div>
                          <span>{report.user}</span>
                        </div>
                      </td>
                      <td>
                        <div className="notes-cell">
                          {report.notes}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="empty-state">
                    <td colSpan="6">
                      <div className="empty-container">
                        <i className="fas fa-clipboard-check"></i>
                        <p>No transactions recorded for this day.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="pagination-container">
            <div className="showing-info">
              <span>Showing</span>
              <select>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="records-info">
              <span>Showing 1 to {reports.length} out of {reports.length} records</span>
            </div>
            <div className="pagination-controls">
              <button className="pagination-btn prev-btn" disabled>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="pagination-btn page-btn active">1</button>
              <button className="pagination-btn next-btn" disabled>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReports;