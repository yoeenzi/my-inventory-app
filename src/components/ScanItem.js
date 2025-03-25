// src/components/ScanItem.js
import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import Quagga from '@ericblade/quagga2'; // Using quagga2 for better maintenance and compatibility
import '../styles/ScanStyles.css';

const ScanItem = () => {
  const { addNotification } = useContext(AppContext);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // State for form data
  const [formData, setFormData] = useState({
    itemId: '',
    transactionType: 'in',
    quantity: 1,
    notes: ''
  });
  
  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [recentScans, setRecentScans] = useState([
    { id: '1001AC', type: 'in', timestamp: '10:25 AM', status: 'success' },
    { id: '2043BX', type: 'out', timestamp: '09:12 AM', status: 'success' }
  ]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Process the form data
    console.log('Form submitted:', formData);
    
    // Add to recent scans
    setRecentScans([
      {
        id: formData.itemId,
        type: formData.transactionType,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: 'success'
      },
      ...recentScans.slice(0, 4) // Keep only the 5 most recent scans
    ]);
    
    // Create a notification
    addNotification({
      type: formData.transactionType === 'in' ? 'stock-in' : 'stock-out',
      title: `${formData.transactionType === 'in' ? 'Stock In' : 'Stock Out'}: Item ${formData.itemId}`,
      productNumber: `Part #${formData.itemId}`,
      quantity: `${formData.transactionType === 'in' ? '+' : '-'}${formData.quantity} units`
    });
    
    // Reset form
    setFormData({
      itemId: '',
      transactionType: 'in',
      quantity: 1,
      notes: ''
    });
    
    // Show success message with toast
    const toast = document.createElement('div');
    toast.className = 'toast success';
    toast.innerHTML = `
      <div class="toast-icon"><i class="fas fa-check-circle"></i></div>
      <div class="toast-message">Transaction recorded successfully!</div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };
  
  // Initialize Quagga directly without relying on video element
  const startBarcodeScanner = () => {
    setErrorMessage('');
    setIsScanning(true);
    
    if (!containerRef.current) {
      setErrorMessage('Scanner container not found');
      setIsScanning(false);
      return;
    }
    
    // Clear any existing content to prevent duplicate elements
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: containerRef.current,
        constraints: {
          width: { min: 450 },
          height: { min: 300 },
          facingMode: "environment",
          aspectRatio: { min: 1, max: 2 }
        },
      },
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      numOfWorkers: 2,
      frequency: 10,
      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader", 
          "ean_8_reader",
          "code_39_reader",
          "upc_reader",
          "upc_e_reader"
        ]
      },
      locate: true
    }, function(err) {
      if (err) {
        console.error("Quagga initialization error:", err);
        setErrorMessage(`Camera error: ${err.message || JSON.stringify(err)}`);
        setIsScanning(false);
        return;
      }
      
      console.log("Quagga initialized successfully");
      
      // Start barcode detection
      Quagga.start();
      
      // Store the video stream for cleanup
      const videoTrack = Quagga.CameraAccess.getActiveTrack();
      if (videoTrack && videoTrack.getSettings) {
        console.log("Camera settings:", videoTrack.getSettings());
      }
      
      // Handle barcode detection
      Quagga.onDetected(handleBarcodeDetected);
    });
  };
  
  // Handle detected barcode
  const handleBarcodeDetected = (result) => {
    if (result && result.codeResult) {
      const scannedCode = result.codeResult.code;
      console.log("Barcode detected:", scannedCode, "with format:", result.codeResult.format);
      
      // Only accept codes with good confidence
      if (result.codeResult.confidence > 0.7) {
        // Update form with the scanned barcode
        setFormData(prev => ({
          ...prev,
          itemId: scannedCode
        }));
        
        // Add to recent scans
        setRecentScans(prev => [
          {
            id: scannedCode,
            type: formData.transactionType,
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            status: 'success'
          },
          ...prev.slice(0, 4)
        ]);
        
        // Play a success sound
        try {
          const audio = new Audio('/assets/sounds/beep.mp3');
          audio.play().catch(e => console.log("Sound play error:", e));
        } catch (e) {
          console.log("Sound error:", e);
        }
        
        // Flash the scanner
        const scanner = document.querySelector('.scanner-container');
        if (scanner) {
          scanner.classList.add('scan-success');
          setTimeout(() => {
            scanner.classList.remove('scan-success');
          }, 500);
        }
        
        // Pause scanning briefly to prevent multiple scans
        Quagga.pause();
        setTimeout(() => {
          if (isScanning) {
            Quagga.start();
          }
        }, 1500);
      }
    }
  };
  
  // Stop scanning and clean up
  const stopScanning = () => {
    try {
      Quagga.stop();
      console.log("Quagga scanner stopped");
    } catch (e) {
      console.log("Quagga stop error:", e);
    }
    
    setIsScanning(false);
  };
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      try {
        Quagga.stop();
      } catch (e) {}
    };
  }, []);

  return (
    <div className="content-section scan-section">
      <div className="scan-header">
        <div className="page-title">
          <i className="fas fa-barcode"></i>
          <h2>Scan Inventory</h2>
        </div>
      </div>
      
      <div className="scan-content">
        {/* Left Side - Scanner */}
        <div className="scan-left-panel">
          <div className="card scanner-card">
            <div className="card-header">
              <h3><i className="fas fa-qrcode"></i> Code Scanner</h3>
              <div className="scanner-status">
                <span className={`status-indicator ${isScanning ? 'active' : 'inactive'}`}></span>
                <span className="status-text">{isScanning ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            
            <div className={`scanner-container ${isScanning ? 'active' : ''}`}>
              {isScanning ? (
                <>
                  <div className="scanner-viewport" ref={containerRef}>
                    {/* Quagga will insert video and canvas elements here */}
                    <div className="scanner-overlay">
                      <div className="scanning-frame">
                        <div className="corner top-left"></div>
                        <div className="corner top-right"></div>
                        <div className="corner bottom-left"></div>
                        <div className="corner bottom-right"></div>
                        <div className="scanning-line"></div>
                      </div>
                    </div>
                    {errorMessage && <div className="scanner-error">{errorMessage}</div>}
                  </div>
                  <button className="scanner-control-btn stop" onClick={stopScanning}>
                    <i className="fas fa-stop"></i> Stop Scanning
                  </button>
                </>
              ) : (
                <>
                  <div className="scanner-placeholder">
                    <i className="fas fa-qrcode scanner-icon"></i>
                    <div className="scanner-text">Camera access required</div>
                    {errorMessage && <div className="scanner-error-message">{errorMessage}</div>}
                    <button className="scanner-control-btn start" onClick={startBarcodeScanner}>
                      <i className="fas fa-camera"></i> Enable Camera
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <div className="recent-scans">
              <h4><i className="fas fa-history"></i> Recent Scans</h4>
              <div className="scans-list">
                {recentScans.length > 0 ? (
                  recentScans.map((scan, index) => (
                    <div key={index} className="scan-item">
                      <div className="scan-info">
                        <div className="scan-id">{scan.id}</div>
                        <div className="scan-time">{scan.timestamp}</div>
                      </div>
                      <div className="scan-status">
                        <span className={`scan-badge ${scan.type}`}>
                          <i className={`fas fa-${scan.type === 'in' ? 'arrow-down' : 'arrow-up'}`}></i>
                          {scan.type === 'in' ? 'In' : 'Out'}
                        </span>
                        <span className={`scan-result ${scan.status}`}>
                          <i className={`fas fa-${scan.status === 'success' ? 'check-circle' : 'times-circle'}`}></i>
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-scans">No recent scans</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Manual Entry */}
        <div className="scan-right-panel">
          <div className="card manual-entry-card">
            <div className="card-header">
              <h3><i className="fas fa-keyboard"></i> Manual Entry</h3>
            </div>
            
            <form className="manual-entry-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-info-circle"></i>
                  <h4>Item Information</h4>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="itemId">
                      Item ID/Code <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <input 
                        type="text" 
                        id="itemId" 
                        placeholder="Enter item ID or scan code"
                        value={formData.itemId}
                        onChange={handleChange}
                        required
                      />
                      <div className="input-icon-container">
                        <i className="fas fa-hashtag"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="quantity">
                      Quantity <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <input 
                        type="number" 
                        id="quantity" 
                        min="1" 
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                      />
                      <div className="input-icon-container">
                        <i className="fas fa-sort"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="transactionType">Transaction Type</label>
                  <div className="transaction-toggle">
                    <label className={`toggle-option ${formData.transactionType === 'in' ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name="transactionType" 
                        id="transactionTypeIn"
                        value="in"
                        checked={formData.transactionType === 'in'}
                        onChange={() => setFormData({...formData, transactionType: 'in'})}
                      />
                      <i className="fas fa-arrow-down"></i>
                      Stock In
                    </label>
                    <label className={`toggle-option ${formData.transactionType === 'out' ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name="transactionType" 
                        id="transactionTypeOut"
                        value="out"
                        checked={formData.transactionType === 'out'}
                        onChange={() => setFormData({...formData, transactionType: 'out'})}
                      />
                      <i className="fas fa-arrow-up"></i>
                      Stock Out
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <div className="section-header">
                  <i className="fas fa-sticky-note"></i>
                  <h4>Additional Details</h4>
                </div>
                
                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea 
                    id="notes" 
                    placeholder="Add any additional information about this transaction"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                  ></textarea>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setFormData({
                  itemId: '',
                  transactionType: 'in',
                  quantity: 1,
                  notes: ''
                })}>
                  <i className="fas fa-undo"></i> Reset
                </button>
                <button type="submit" className="btn-primary">
                  <i className="fas fa-save"></i> Submit Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanItem;