// src/components/modals/AddItemModal.js
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import DatePicker from '../common/DatePicker';

const AddItemModal = () => {
  const { 
    showAddItemModal, 
    setShowAddItemModal, 
    addInventoryItem, 
    updateInventoryItem,
    selectedItem
  } = useContext(AppContext);
  
  // State for form data
  const [formData, setFormData] = useState({
    component: '',
    partsName: '',
    partsNumber: '',
    pic: '',
    quantity: 1,
    rack: '',
    date: new Date().toISOString().slice(0, 10),
    dateDisplay: formatDateForDisplay(new Date()),
    itemPrice: 0,
    tax: 0,
    totalAmount: 0,
    poNumber: '',
    ctplNumber: ''
  });
  
  // State for image data
  const [uploadedImageData, setUploadedImageData] = useState(null);
  
  // Determine if we're in edit mode
  const isEditMode = !!selectedItem;
  
  // Format date for display (DD/MM/YYYY)
  function formatDateForDisplay(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  // Load selected item data when in edit mode
  useEffect(() => {
    if (selectedItem) {
      // Convert date from DD/MM/YYYY to YYYY-MM-DD for the input
      let dateValue = selectedItem.date;
      if (selectedItem.date && selectedItem.date.includes('/')) {
        const [day, month, year] = selectedItem.date.split('/');
        dateValue = `${year}-${month}-${day}`;
      }
      
      setFormData({
        component: selectedItem.component || '',
        partsName: selectedItem.partsName || '',
        partsNumber: selectedItem.partsNumber || '',
        pic: selectedItem.pic || '',
        quantity: selectedItem.quantity || 1,
        rack: selectedItem.rack || '',
        date: dateValue,
        dateDisplay: selectedItem.date || formatDateForDisplay(new Date()),
        itemPrice: selectedItem.itemPrice || 0,
        tax: selectedItem.tax || 0,
        totalAmount: selectedItem.totalAmount || 0,
        poNumber: selectedItem.poNumber || '',
        ctplNumber: selectedItem.ctplNumber || ''
      });
      
      setUploadedImageData(selectedItem.imageData || null);
    } else {
      // Reset form for new item
      resetForm();
    }
  }, [selectedItem, showAddItemModal]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Recalculate total amount when price, quantity, or tax changes
    if (id === 'itemPrice' || id === 'quantity' || id === 'tax') {
      calculateTotal();
    }
  };
  
  // Calculate total amount
  const calculateTotal = () => {
    const price = parseFloat(formData.itemPrice) || 0;
    const tax = parseFloat(formData.tax) || 0;
    const quantity = parseInt(formData.quantity) || 1;
    
    const total = (price * quantity) + tax;
    
    setFormData(prev => ({
      ...prev,
      totalAmount: total.toFixed(2)
    }));
  };
  
  // Handle date change from DatePicker component
  const handleDateChange = (dateStr) => {
    // DatePicker returns date in DD/MM/YYYY format
    if (dateStr) {
      const [day, month, year] = dateStr.split('/');
      const isoDate = `${year}-${month}-${day}`;
      
      setFormData({
        ...formData,
        date: isoDate,
        dateDisplay: dateStr
      });
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      // Read file as data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImageData(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Basic form validation
    if (!formData.component || !formData.partsName || !formData.partsNumber) {
      alert('Please fill out all required fields');
      return;
    }
    
    // Create item object
    const itemData = {
      ...formData,
      imageData: uploadedImageData,
      id: selectedItem ? selectedItem.id : Date.now() // Use existing ID or create a new one
    };
    
    // Add or update item
    if (isEditMode) {
      updateInventoryItem(itemData);
      alert('Item updated successfully!');
    } else {
      addInventoryItem(itemData);
      alert('Item added successfully!');
    }
    
    // Close modal
    closeModal();
  };
  
  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      component: '',
      partsName: '',
      partsNumber: '',
      pic: '',
      quantity: 1,
      rack: '',
      date: new Date().toISOString().slice(0, 10),
      dateDisplay: formatDateForDisplay(new Date()),
      itemPrice: 0,
      tax: 0,
      totalAmount: 0,
      poNumber: '',
      ctplNumber: ''
    });
    setUploadedImageData(null);
  };
  
  // Close modal
  const closeModal = () => {
    setShowAddItemModal(false);
  };

  return (
    <div className={`modal ${showAddItemModal ? 'active' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{isEditMode ? 'Edit Item' : 'Add New Item'}</h3>
          <span className="close-button" onClick={closeModal}>&times;</span>
        </div>
        <div className="modal-body">
          <form id="addItemForm">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="component">Component *</label>
                <div className="select-wrapper">
                  <select 
                    id="component" 
                    value={formData.component}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Choose Type</option>
                    <option value="Engine">Engine</option>
                    <option value="Hydraulic">Hydraulic</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Body">Body</option>
                  </select>
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="partsName">Parts Name *</label>
                <input 
                  type="text" 
                  id="partsName" 
                  placeholder="Enter item name" 
                  value={formData.partsName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="partsNumber">Parts Number *</label>
                <input 
                  type="text" 
                  id="partsNumber" 
                  placeholder="Enter serial number" 
                  value={formData.partsNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="pic">PIC *</label>
                <input 
                  type="text" 
                  id="pic" 
                  placeholder="Enter PIC" 
                  value={formData.pic}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="image">Image *</label>
                <div className="file-input-wrapper">
                  <input 
                    type="text" 
                    id="imageDisplay" 
                    placeholder="Choose File" 
                    readOnly
                    value={uploadedImageData ? "Image Selected" : ""}
                  />
                  <label htmlFor="image" className="file-input-label">
                    <i className="fas fa-paperclip"></i>
                  </label>
                  <input 
                    type="file" 
                    id="image" 
                    style={{ display: 'none' }} 
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input 
                  type="number" 
                  id="quantity" 
                  placeholder="Enter item number" 
                  min="1" 
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rack">Rack *</label>
                <div className="select-wrapper">
                  <select 
                    id="rack" 
                    value={formData.rack}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Choose Rack</option>
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                  </select>
                  <i className="fas fa-chevron-down"></i>
                </div>
              </div>
              <DatePicker 
                id="date"
                label="Date"
                value={formData.dateDisplay}
                onChange={handleDateChange}
                placeholder="Select a date"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="itemPrice">Item Price *</label>
                <input 
                  type="number" 
                  id="itemPrice" 
                  placeholder="Enter price" 
                  min="0" 
                  step="0.01" 
                  value={formData.itemPrice}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="tax">Tax *</label>
                <input 
                  type="number" 
                  id="tax" 
                  placeholder="Enter Tax" 
                  min="0" 
                  step="0.01" 
                  value={formData.tax}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="totalAmount">Total Amount *</label>
                <input 
                  type="number" 
                  id="totalAmount" 
                  placeholder="Enter Amount" 
                  min="0" 
                  step="0.01" 
                  value={formData.totalAmount}
                  onChange={handleChange}
                  readOnly
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="poNumber">PO Number *</label>
                <input 
                  type="text" 
                  id="poNumber" 
                  placeholder="Enter PO No." 
                  value={formData.poNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="ctplNumber">CTPL Number *</label>
                <input 
                  type="text" 
                  id="ctplNumber" 
                  placeholder="Enter CTPL No." 
                  value={formData.ctplNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-light" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {isEditMode ? 'Update' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;