// src/components/Dashboard.js
import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const { stockData } = useContext(AppContext);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Initialize and update chart when data changes
  useEffect(() => {
    if (stockData.chartData && chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: stockData.chartData.labels,
          datasets: [
            {
              label: 'Stock In',
              data: stockData.chartData.stockInData,
              borderColor: '#36a2eb',
              backgroundColor: 'rgba(54, 162, 235, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Stock Out',
              data: stockData.chartData.stockOutData,
              borderColor: '#8557e8',
              backgroundColor: 'rgba(133, 87, 232, 0.1)',
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
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(200, 200, 200, 0.1)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [stockData.chartData]);

  // Add animation effects to summary items
  useEffect(() => {
    const summaryItems = document.querySelectorAll('.summary-item');
    summaryItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const valueElement = item.querySelector('.summary-value');
        valueElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
          valueElement.style.transform = '';
        }, 300);
      });
    });
  }, []);

  return (
    <>
      <div className="card">
        <div className="report-title">Stock Report</div>
        
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color blue"></div>
            <span>Stock In</span>
          </div>
          <div className="legend-item">
            <div className="legend-color purple"></div>
            <span>Stock Out</span>
          </div>
        </div>
        
        <div className="chart-container">
          {!stockData.chartData ? (
            <div className="empty-chart-message">
              No stock data available. Add products to view the report.
            </div>
          ) : (
            <canvas 
              id="stockChart" 
              ref={chartRef}
              style={{ display: 'block', height: '100%', width: '100%' }}
            ></canvas>
          )}
        </div>
      </div>
      
      <div className="card">
        <div className="report-title">Item Summary</div>
        
        <div className="summary-container">
          <div className="summary-item">
            <div className="summary-icon box">
              <i className="fas fa-box"></i>
            </div>
            <div className="summary-value">{stockData.itemsInHand}</div>
            <div className="summary-label">Quantity in Hand</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-icon in">
              <i className="fas fa-arrow-circle-down"></i>
            </div>
            <div className="summary-value">{stockData.stockIn}</div>
            <div className="summary-label">Stock In Products</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-icon out">
              <i className="fas fa-arrow-circle-up"></i>
            </div>
            <div className="summary-value">{stockData.stockOut}</div>
            <div className="summary-label">Stock Out Products</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;