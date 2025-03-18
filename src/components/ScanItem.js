// src/components/ScanItem.js
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ScanItem = () => {
  const { addNotification } = useContext(AppContext);
  
  // State for form data
  const [formData, setFormData] = useState({
    itemId: '',
    transactionType: 'in',
    quantity: 1,
    notes: ''
  });
  
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
    
    // Show success message
    alert('Transaction recorded successfully!');
  };
  
  // Simulate enabling camera
  const enableCamera = () => {
    alert('Camera access requested. In a real application, this would activate your device camera.');
  };

  return (
    <div className="content-section scan-section">
      <div className="card scanner-card">
        <div className="scanner-container">
          <div className="scanner-placeholder">
            <i className="fas fa-qrcode scanner-icon"></i>
            <div className="scanner-text">Camera access required</div>
            <button className="scanner-btn" onClick={enableCamera}>
              Enable Camera
            </button>
          </div>
          <div className="scanning-frame">
            <div className="corner top-left"></div>
            <div className="corner top-right"></div>
            <div className="corner bottom-left"></div>
            <div className="corner bottom-right"></div>
            <div className="scanning-line"></div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="report-title">Manual Entry</div>
        <form className="manual-entry-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="itemId">Item ID/Code</label>
            <input 
              type="text" 
              id="itemId" 
              placeholder="Enter item ID or scan code"
              value={formData.itemId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="transactionType">Transaction Type</label>
            <select 
              id="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
            >
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input 
              type="number" 
              id="quantity" 
              min="1" 
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea 
              id="notes" 
              placeholder="Add any additional information"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ScanItem;