// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import '../styles/DashboardStyles.css';

const Dashboard = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('monthly');
  const [chartInstance, setChartInstance] = useState(null);
  const [chartInitialized, setChartInitialized] = useState(false);
  
  // Define consistent colors for the chart
  const chartColors = {
    stockIn: {
      border: '#3498db', // Blue
      background: 'rgba(52, 152, 219, 0.1)',
      point: '#3498db'
    },
    stockOut: {
      border: '#9b59b6', // Violet
      background: 'rgba(155, 89, 182, 0.1)',
      point: '#9b59b6'
    }
  };
  
  // Generate sample chart data for demonstration
  const generateSampleChartData = (timeframe) => {
    let labels = [];
    const stockInData = [];
    const stockOutData = [];
    
    // Generate different labels based on timeframe
    if (timeframe === 'weekly') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      for (let i = 0; i < 7; i++) {
        stockInData.push(Math.floor(Math.random() * 50) + 20);
        stockOutData.push(Math.floor(Math.random() * 40) + 10);
      }
    } else if (timeframe === 'yearly') {
      labels = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];
      for (let i = 0; i < 7; i++) {
        stockInData.push(Math.floor(Math.random() * 300) + 100);
        stockOutData.push(Math.floor(Math.random() * 250) + 80);
      }
    } else {
      // Default to monthly
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 0; i < 12; i++) {
        stockInData.push(Math.floor(Math.random() * 50) + 20);
        stockOutData.push(Math.floor(Math.random() * 40) + 10);
      }
    }
    
    return {
      labels,
      stockInData,
      stockOutData
    };
  };
  
  // Generate sample trend data
  const generateTrendData = (baseValue) => {
    const value = baseValue || Math.floor(Math.random() * 100) + 50;
    const randomPercentage = Math.floor(Math.random() * 31) - 15; // -15 to +15
    
    return {
      value: value,
      trend: randomPercentage,
      isPositive: randomPercentage >= 0
    };
  };

  // Sample data for display cards
  const totalTransactionsData = generateTrendData(125);
  const stockInData = generateTrendData(78);
  const stockOutData = generateTrendData(47);
  
  // Initialize or update chart
  const initializeChart = (timeframe) => {
    try {
      console.log("Initializing chart for timeframe:", timeframe);
      
      // Ensure chart container exists
      const chartContainer = document.querySelector('.chart-container');
      if (!chartContainer) {
        console.error('Chart container not found');
        return;
      }
      
      // Ensure canvas exists and is properly sized
      const canvas = document.getElementById('stockChart');
      if (!canvas) {
        console.error('Canvas element not found');
        return;
      }
      
      // Set explicit dimensions
      canvas.width = chartContainer.offsetWidth;
      canvas.height = 300;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Could not get 2d context');
        return;
      }
      
      // Destroy existing chart if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      // Generate sample data for the current timeframe
      const chartData = generateSampleChartData(timeframe);
      console.log("Chart data generated:", chartData);
      
      // Create new chart
      const newChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              label: 'Stock In',
              data: chartData.stockInData,
              borderColor: chartColors.stockIn.border,
              backgroundColor: chartColors.stockIn.background,
              borderWidth: 2,
              pointBackgroundColor: chartColors.stockIn.point,
              pointRadius: 4,
              pointHoverRadius: 6,
              tension: 0.4,
              fill: true
            },
            {
              label: 'Stock Out',
              data: chartData.stockOutData,
              borderColor: chartColors.stockOut.border,
              backgroundColor: chartColors.stockOut.background,
              borderWidth: 2,
              pointBackgroundColor: chartColors.stockOut.point,
              pointRadius: 4,
              pointHoverRadius: 6,
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              align: 'end',
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20,
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                size: 13
              },
              padding: 12,
              cornerRadius: 8,
              caretSize: 6,
              displayColors: true,
              boxWidth: 10,
              boxHeight: 10,
              boxPadding: 4,
              usePointStyle: true
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(200, 200, 200, 0.1)'
              },
              ticks: {
                padding: 10,
                font: {
                  size: 11
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                padding: 10,
                font: {
                  size: 11
                }
              }
            }
          },
          animation: {
            duration: 800,
            easing: 'easeOutQuart'
          }
        }
      });
      
      // Save the chart instance
      setChartInstance(newChartInstance);
      console.log("Chart instance created successfully");
      setChartInitialized(true);
    } catch (error) {
      console.error("Error creating chart:", error);
      // Force re-render chart container
      setChartInitialized(false);
      // Try again after a brief delay with simpler chart configuration
      setTimeout(() => {
        try {
          const canvas = document.getElementById('stockChart');
          if (canvas && canvas.getContext) {
            const ctx = canvas.getContext('2d');
            const chartData = generateSampleChartData(timeframe);
            
            // Create simplified chart as fallback
            const simpleChart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: chartData.labels,
                datasets: [
                  {
                    label: 'Stock In',
                    data: chartData.stockInData,
                    borderColor: chartColors.stockIn.border,
                    fill: false
                  },
                  {
                    label: 'Stock Out',
                    data: chartData.stockOutData,
                    borderColor: chartColors.stockOut.border,
                    fill: false
                  }
                ]
              },
              options: {
                responsive: true,
                maintainAspectRatio: false
              }
            });
            
            setChartInstance(simpleChart);
            setChartInitialized(true);
            console.log("Fallback chart created");
          }
        } catch (fallbackError) {
          console.error("Fallback chart creation failed:", fallbackError);
        }
      }, 500);
    }
  };

  // Handle timeframe change
  const changeTimeframe = (timeframe) => {
    setActiveTimeframe(timeframe);
    initializeChart(timeframe);
  };

  // Initialize chart after component is mounted
  useEffect(() => {
    // Add a small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      console.log("Initializing chart...");
      initializeChart(activeTimeframe);
    }, 300);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="dashboard-wrapper">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <i className="fas fa-chart-line"></i>
          <h2>Inventory Dashboard</h2>
        </div>
        <div className="dashboard-date">
          <i className="far fa-calendar-alt"></i>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card card-items">
          <div className="card-icon">
            <i className="fas fa-exchange-alt"></i>
          </div>
          <div className="card-content">
            <div className="card-label">Total Transactions</div>
            <div className="card-value">{totalTransactionsData.value}</div>
            <div className={`card-trend ${totalTransactionsData.isPositive ? 'positive' : 'negative'}`}>
              <i className={`fas fa-arrow-${totalTransactionsData.isPositive ? 'up' : 'down'}`}></i>
              <span>{Math.abs(totalTransactionsData.trend)}% from last month</span>
            </div>
          </div>
        </div>
        
        <div className="summary-card card-in">
          <div className="card-icon">
            <i className="fas fa-arrow-circle-down"></i>
          </div>
          <div className="card-content">
            <div className="card-label">Stock In Products</div>
            <div className="card-value">{stockInData.value}</div>
            <div className={`card-trend ${stockInData.isPositive ? 'positive' : 'negative'}`}>
              <i className={`fas fa-arrow-${stockInData.isPositive ? 'up' : 'down'}`}></i>
              <span>{Math.abs(stockInData.trend)}% from last month</span>
            </div>
          </div>
        </div>
        
        <div className="summary-card card-out">
          <div className="card-icon">
            <i className="fas fa-arrow-circle-up"></i>
          </div>
          <div className="card-content">
            <div className="card-label">Stock Out Products</div>
            <div className="card-value">{stockOutData.value}</div>
            <div className={`card-trend ${stockOutData.isPositive ? 'positive' : 'negative'}`}>
              <i className={`fas fa-arrow-${stockOutData.isPositive ? 'up' : 'down'}`}></i>
              <span>{Math.abs(stockOutData.trend)}% from last month</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart Card */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title">
            <i className="fas fa-chart-area"></i>
            <h3>Stock Movement Report</h3>
          </div>
          
          <div className="chart-controls">
            <div className="timeframe-selector">
              <button 
                className={`timeframe-btn ${activeTimeframe === 'weekly' ? 'active' : ''}`}
                onClick={() => changeTimeframe('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`timeframe-btn ${activeTimeframe === 'monthly' ? 'active' : ''}`}
                onClick={() => changeTimeframe('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`timeframe-btn ${activeTimeframe === 'yearly' ? 'active' : ''}`}
                onClick={() => changeTimeframe('yearly')}
              >
                Yearly
              </button>
            </div>
            
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color in"></div>
                <span>Stock In</span>
              </div>
              <div className="legend-item">
                <div className="legend-color out"></div>
                <span>Stock Out</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="chart-body">
          <div className="chart-container" style={{ height: '300px', position: 'relative' }}>
            <canvas 
              id="stockChart"
              style={{ width: '100%', height: '100%' }}
            ></canvas>
            {!chartInitialized && (
              <div className="chart-loading" style={{ 
                position: 'absolute', 
                top: '0', 
                left: '0', 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}>
                <div className="loading-spinner"></div>
                <p>Loading chart data...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;