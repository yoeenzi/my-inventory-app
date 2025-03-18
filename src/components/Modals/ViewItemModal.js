// src/components/Modals/ViewItemModal.js
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import '../../styles/ModalStyles.css';

const ViewItemModal = () => {
  const { 
    showViewItemModal, 
    setShowViewItemModal, 
    selectedItem 
  } = useContext(AppContext);
  
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (showViewItemModal) {
      // Small delay for animation to work properly
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [showViewItemModal]);
  
  // Close modal with fade-out effect
  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setShowViewItemModal(false), 300);
  };

  // Enhanced formatPeso function for Philippine Peso formatting with thousand separators
  const formatPeso = (value) => {
    // Handle case when value is already a string (possibly already formatted)
    if (typeof value === 'string') {
      // Extract numeric value if it's already formatted
      value = parseFloat(value.replace(/[^\d.-]/g, ''));
      if (isNaN(value)) return '₱0.00';
    }
    
    // Format the number with Philippine Peso symbol and thousand separators
    return new Intl.NumberFormat('en-PH', { 
      style: 'currency', 
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // If no modal state or no item selected, don't render anything
  if (!showViewItemModal || !selectedItem) return null;

  // Get status badge color based on quantity
  const getQuantityStatusColor = (quantity) => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty)) return '#6c757d'; // Default gray
    if (qty <= 0) return '#dc3545'; // Red - Out of stock
    if (qty < 5) return '#ffc107'; // Yellow - Low stock
    if (qty >= 50) return '#28a745'; // Green - Good stock
    return '#17a2b8'; // Blue - Normal stock
  };

  return (
    <div className={`modal-overlay ${isVisible ? 'visible' : ''}`} onClick={closeModal}>
      <div 
        className={`modal-content-enhanced ${isVisible ? 'visible' : ''}`} 
        onClick={e => e.stopPropagation()}
      >
        {/* Header with gradient background */}
        <div className="modal-header-enhanced">
          <h3><i className="fas fa-box-open"></i> Item Details</h3>
          <button className="close-button-enhanced" onClick={closeModal}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body-enhanced">
          <div className="item-view-layout">
            {/* Left side - Image and basic info */}
            <div className="item-left-panel">
              <div className="item-image-container">
                {selectedItem.imageData ? (
                  <img 
                    src={selectedItem.imageData} 
                    alt={selectedItem.partsName} 
                    className="item-detail-image"
                  />
                ) : (
                  <div className="item-image-placeholder">
                    <i className="fas fa-box"></i>
                    <span>No Image</span>
                  </div>
                )}
              </div>
              
              <div className="item-quick-info">
                <h2 className="item-title">{selectedItem.partsName}</h2>
                <div className="item-badges">
                  <span className="badge badge-component">
                    <i className="fas fa-cog"></i> {selectedItem.component}
                  </span>
                  <span className="badge badge-quantity" style={{
                    backgroundColor: getQuantityStatusColor(selectedItem.quantity)
                  }}>
                    <i className="fas fa-cubes"></i> QTY: {selectedItem.quantity}
                  </span>
                </div>
                <div className="item-price-tag">
                  <span className="price-label">Price:</span>
                  <span className="price-value">{formatPeso(selectedItem.itemPrice)}</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Details grid */}
            <div className="item-details-grid">
              <div className="detail-row">
                <div className="detail-group">
                  <span className="detail-label">Parts Number</span>
                  <span className="detail-value">
                    <i className="fas fa-hashtag detail-icon"></i> {selectedItem.partsNumber}
                  </span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">PIC</span>
                  <span className="detail-value">
                    <i className="fas fa-user detail-icon"></i> {selectedItem.pic}
                  </span>
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-group">
                  <span className="detail-label">Rack Location</span>
                  <span className="detail-value">
                    <i className="fas fa-map-marker-alt detail-icon"></i> {selectedItem.rack}
                  </span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Date Added</span>
                  <span className="detail-value">
                    <i className="far fa-calendar-alt detail-icon"></i> {selectedItem.date || selectedItem.dateDisplay}
                  </span>
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-group">
                  <span className="detail-label">PO Number</span>
                  <span className="detail-value">
                    <i className="fas fa-file-invoice detail-icon"></i> {selectedItem.poNumber}
                  </span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">CTPL Number</span>
                  <span className="detail-value">
                    <i className="fas fa-barcode detail-icon"></i> {selectedItem.ctplNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Financial Information Card */}
          <div className="financial-card">
            <div className="financial-header">
              <i className="fas fa-chart-line"></i>
              <h4>Financial Details</h4>
            </div>
            <div className="financial-body">
              <div className="financial-grid">
                <div className="financial-item">
                  <div className="circle-icon">
                    <i className="fas fa-tag"></i>
                  </div>
                  <div className="financial-details">
                    <span className="financial-label">Item Price</span>
                    <span className="financial-value">{formatPeso(selectedItem.itemPrice)}</span>
                  </div>
                </div>
                
                <div className="financial-item">
                  <div className="circle-icon">
                    <i className="fas fa-percentage"></i>
                  </div>
                  <div className="financial-details">
                    <span className="financial-label">Tax</span>
                    <span className="financial-value">{formatPeso(selectedItem.tax)}</span>
                  </div>
                </div>
                
                <div className="financial-item total">
                  <div className="circle-icon">
                    <i className="fas fa-coins"></i>
                  </div>
                  <div className="financial-details">
                    <span className="financial-label">Total Amount</span>
                    <span className="financial-value total-value">{formatPeso(selectedItem.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="modal-footer-enhanced">
          <button className="btn btn-close" onClick={closeModal}>
            <i className="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewItemModal;