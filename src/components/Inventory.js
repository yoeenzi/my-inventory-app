// src/components/Inventory.js
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { formatNumberWithCommas, formatPeso } from '../utils/formatters';
import { exportToExcel } from '../utils/excelExport';

const Inventory = () => {
  const { 
    inventoryItems, 
    deleteInventoryItem, 
    setShowAddItemModal, 
    setShowViewItemModal,
    setSelectedItem 
  } = useContext(AppContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filter inventory items based on search term
  const filteredItems = inventoryItems.filter(item => 
    item.partsName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.partsNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.component.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle view item details
  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowViewItemModal(true);
  };

  // Handle edit item
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowAddItemModal(true);
  };

  // Handle delete item
  const handleDeleteItem = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.partsName}?`)) {
      deleteInventoryItem(item.id);
    }
  };

  // Handle add new item
  const handleAddItem = () => {
    setSelectedItem(null);
    setShowAddItemModal(true);
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual row selection
  const handleRowSelect = (itemId) => {
    if (selectedRows.includes(itemId)) {
      setSelectedRows(selectedRows.filter(id => id !== itemId));
    } else {
      setSelectedRows([...selectedRows, itemId]);
    }
  };

  // Export to Excel function
  const handleExportToExcel = () => {
    // If no items selected, export all filtered items
    const itemsToExport = selectedRows.length > 0 
      ? filteredItems.filter(item => selectedRows.includes(item.id))
      : filteredItems;
    
    if (itemsToExport.length === 0) {
      alert('No items to export');
      return;
    }
    
    const success = exportToExcel(itemsToExport, 'inventory_export');
    if (success) {
      alert('Inventory data exported successfully!');
    } else {
      alert('Failed to export data. Please try again.');
    }
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  return (
    <div className="content-section inventory-section">
      <div className="inventory-actions-top">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Search Item" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="action-buttons">
          <button className="action-btn add-btn" onClick={handleAddItem}>
            <i className="fas fa-plus"></i> Add Item
          </button>
          <button className="action-btn excel-btn" onClick={handleExportToExcel}>
            <i className="fas fa-file-excel"></i> Make Excel
          </button>
          <button className="action-btn filter-btn">
            <i className="fas fa-filter"></i> Filter
          </button>
        </div>
      </div>
      
      <div className="card inventory-card">
        <div className="inventory-table-container">
          <table className="inventory-table">
            <colgroup>
              <col className="checkbox-column" />
              <col className="date-column" />
              <col className="parts-number-column" />
              <col className="parts-name-column" />
              <col className="component-column" />
              <col className="quantity-column" />
              <col className="price-column" />
              <col className="image-column" />
              <col className="action-column" />
            </colgroup>
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input 
                    type="checkbox" 
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="date-column">Date <i className="fas fa-sort"></i></th>
                <th className="parts-number-column">Parts Number</th>
                <th className="parts-name-column">Parts Name</th>
                <th className="component-column">Component</th>
                <th className="quantity-column">Quantity</th>
                <th className="price-column">Item Price</th>
                <th className="image-column">Image</th>
                <th className="action-column">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map(item => (
                  <tr key={item.id}>
                    <td className="checkbox-column">
                      <input 
                        type="checkbox" 
                        checked={selectedRows.includes(item.id)}
                        onChange={() => handleRowSelect(item.id)}
                      />
                    </td>
                    <td className="date-column">{item.date}</td>
                    <td className="parts-number-column">{item.partsNumber}</td>
                    <td className="parts-name-column">{item.partsName}</td>
                    <td className="component-column">{item.component}</td>
                    <td className="quantity-column">{item.quantity}</td>
                    <td className="price-column">{formatPeso(item.itemPrice)}</td>
                    <td className="image-column">
                      <div className="image-cell">
                        {item.imageData ? (
                          <img 
                            src={item.imageData} 
                            alt={item.partsName}
                          />
                        ) : (
                          <i className="fas fa-image" style={{ color: '#aaa' }}></i>
                        )}
                      </div>
                    </td>
                    <td className="action-column">
                      <div className="action-cell">
                        <button 
                          className="icon-btn view-btn"
                          onClick={() => handleViewItem(item)}
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="icon-btn edit-btn"
                          onClick={() => handleEditItem(item)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="icon-btn delete-btn"
                          onClick={() => handleDeleteItem(item)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                    {searchTerm ? 'No items match your search.' : 'No inventory items available. Add an item to get started.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="pagination-container">
          <div className="showing-info">
            <span>Showing</span>
            <select 
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="records-info">
            <span>
              {filteredItems.length > 0 
                ? `Showing ${indexOfFirstItem + 1} to ${Math.min(indexOfLastItem, filteredItems.length)} out of ${filteredItems.length} records` 
                : 'No records to show'}
            </span>
          </div>
          <div className="pagination-controls">
            <button 
              className="pagination-btn prev-btn" 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {/* Generate page buttons */}
            {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => {
              // If we have 4 or fewer pages, show all page numbers
              let pageNum = i + 1;
              
              // If we have more than 4 pages and we're not on the first or last pages
              if (totalPages > 4 && currentPage > 2 && currentPage < totalPages - 1) {
                // Show current page and surrounding pages
                pageNum = currentPage - 1 + i;
                // Ensure we don't exceed the total pages
                if (pageNum > totalPages) {
                  return null;
                }
              } else if (totalPages > 4 && currentPage >= totalPages - 1) {
                // If we're on one of the last two pages, show the last 4 pages
                pageNum = totalPages - 3 + i;
              }
              
              return (
                <button 
                  key={pageNum}
                  className={`pagination-btn page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className="pagination-btn next-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;