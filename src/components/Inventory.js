// src/components/Inventory.js
import React, { useState, useContext, useEffect } from 'react';
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
  
  // Add filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: {
      start: '',
      end: ''
    },
    priceRange: {
      min: '',
      max: ''
    },
    quantityRange: {
      min: '',
      max: ''
    },
    components: [],
    isFiltered: false
  });
  
  // Predefined component categories
  const componentCategories = ['Engine', 'Hydraulic', 'Electrical', 'Mechanical', 'Body'];
  
  // Filter inventory items based on search term and filters
  const filteredItems = inventoryItems.filter(item => {
    // Search term filter
    const matchesSearch = 
      item.partsName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partsNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.component.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Only apply additional filters if filtering is active
    if (!filters.isFiltered) return true;
    
    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      const itemDate = new Date(item.date);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59); // Include the end date fully
      
      if (itemDate < startDate || itemDate > endDate) {
        return false;
      }
    }
    
    // Price range filter
    if (filters.priceRange.min && parseFloat(item.itemPrice) < parseFloat(filters.priceRange.min)) {
      return false;
    }
    if (filters.priceRange.max && parseFloat(item.itemPrice) > parseFloat(filters.priceRange.max)) {
      return false;
    }
    
    // Quantity range filter
    if (filters.quantityRange.min && parseInt(item.quantity) < parseInt(filters.quantityRange.min)) {
      return false;
    }
    if (filters.quantityRange.max && parseInt(item.quantity) > parseInt(filters.quantityRange.max)) {
      return false;
    }
    
    // Component filter - case insensitive comparison
    if (filters.components.length > 0 && !filters.components.some(comp => 
      item.component.toLowerCase() === comp.toLowerCase() ||
      item.component.toLowerCase().includes(comp.toLowerCase())
    )) {
      return false;
    }
    
    return true;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter button click
  const handleFilterClick = () => {
    setShowFilterModal(true);
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => {
      // Create a new object to avoid direct state mutation
      const newFilters = { ...prevFilters };
      
      switch (filterType) {
        case 'dateStart':
          newFilters.dateRange.start = value;
          break;
        case 'dateEnd':
          newFilters.dateRange.end = value;
          break;
        case 'priceMin':
          newFilters.priceRange.min = value;
          break;
        case 'priceMax':
          newFilters.priceRange.max = value;
          break;
        case 'quantityMin':
          newFilters.quantityRange.min = value;
          break;
        case 'quantityMax':
          newFilters.quantityRange.max = value;
          break;
        case 'component':
          // Toggle component selection
          if (newFilters.components.includes(value)) {
            newFilters.components = newFilters.components.filter(comp => comp !== value);
          } else {
            newFilters.components = [...newFilters.components, value];
          }
          break;
        default:
          break;
      }
      
      return newFilters;
    });
  };

  // Apply filters
  const applyFilters = () => {
    setFilters(prevFilters => ({
      ...prevFilters,
      isFiltered: true
    }));
    setShowFilterModal(false);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      dateRange: {
        start: '',
        end: ''
      },
      priceRange: {
        min: '',
        max: ''
      },
      quantityRange: {
        min: '',
        max: ''
      },
      components: [],
      isFiltered: false
    });
    setShowFilterModal(false);
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
          <button 
            className={`action-btn filter-btn ${filters.isFiltered ? 'active' : ''}`} 
            onClick={handleFilterClick}
          >
            <i className="fas fa-filter"></i> Filter
            {filters.isFiltered && <span className="filter-badge"></span>}
          </button>
        </div>
      </div>
      
          {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal-overlay">
          <div className="filter-modal">
            <div className="filter-modal-header">
              <h3><i className="fas fa-filter"></i> Filter Inventory</h3>
              <button className="close-btn" onClick={() => setShowFilterModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="filter-modal-body">
              {/* Date Range Filter */}
              <div className="filter-section">
                <h4><i className="far fa-calendar-alt"></i> Date Range</h4>
                <div className="filter-inputs">
                  <div className="filter-input-group">
                    <label>From</label>
                    <input 
                      type="date" 
                      value={filters.dateRange.start}
                      onChange={(e) => handleFilterChange('dateStart', e.target.value)}
                    />
                  </div>
                  <div className="filter-input-group">
                    <label>To</label>
                    <input 
                      type="date" 
                      value={filters.dateRange.end}
                      onChange={(e) => handleFilterChange('dateEnd', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div className="filter-section">
                <h4><i className="fas fa-tag"></i> Price Range</h4>
                <div className="filter-inputs">
                  <div className="filter-input-group">
                    <label>Min Price</label>
                    <input 
                      type="number" 
                      placeholder="Enter minimum price" 
                      value={filters.priceRange.min}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    />
                  </div>
                  <div className="filter-input-group">
                    <label>Max Price</label>
                    <input 
                      type="number" 
                      placeholder="Enter maximum price" 
                      value={filters.priceRange.max}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Quantity Range Filter */}
              <div className="filter-section">
                <h4><i className="fas fa-box"></i> Quantity Range</h4>
                <div className="filter-inputs">
                  <div className="filter-input-group">
                    <label>Min Quantity</label>
                    <input 
                      type="number" 
                      placeholder="Enter minimum quantity" 
                      value={filters.quantityRange.min}
                      onChange={(e) => handleFilterChange('quantityMin', e.target.value)}
                    />
                  </div>
                  <div className="filter-input-group">
                    <label>Max Quantity</label>
                    <input 
                      type="number" 
                      placeholder="Enter maximum quantity" 
                      value={filters.quantityRange.max}
                      onChange={(e) => handleFilterChange('quantityMax', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Component Filter */}
              <div className="filter-section">
                <h4><i className="fas fa-cogs"></i> Components</h4>
                <div className="component-checkboxes">
                  {componentCategories.map((component, index) => (
                    <div key={index} className="component-checkbox">
                      <label>
                        <input 
                          type="checkbox" 
                          checked={filters.components.includes(component)}
                          onChange={() => handleFilterChange('component', component)}
                        />
                        <span>{component}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="filter-modal-footer">
              <button className="btn secondary-btn" onClick={clearFilters}>
                <i className="fas fa-times-circle"></i> Clear Filters
              </button>
              <button className="btn primary-btn" onClick={applyFilters}>
                <i className="fas fa-check-circle"></i> Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="card inventory-card">
        {/* Filter indicator */}
        {filters.isFiltered && (
          <div className="active-filters">
            <span><i className="fas fa-filter"></i> Active Filters:</span>
            {(filters.dateRange.start && filters.dateRange.end) && (
              <div className="filter-tag">
                <i className="far fa-calendar-alt"></i>
                {new Date(filters.dateRange.start).toLocaleDateString()} - {new Date(filters.dateRange.end).toLocaleDateString()}
                <button onClick={() => setFilters({...filters, dateRange: {start: '', end: ''}})}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
            {(filters.priceRange.min || filters.priceRange.max) && (
              <div className="filter-tag">
                <i className="fas fa-tag"></i>
                {filters.priceRange.min ? formatPeso(filters.priceRange.min) : '₱0'} - {filters.priceRange.max ? formatPeso(filters.priceRange.max) : 'Any'}
                <button onClick={() => setFilters({...filters, priceRange: {min: '', max: ''}})}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
            {(filters.quantityRange.min || filters.quantityRange.max) && (
              <div className="filter-tag">
                <i className="fas fa-box"></i>
                {filters.quantityRange.min || '0'} - {filters.quantityRange.max || 'Any'}
                <button onClick={() => setFilters({...filters, quantityRange: {min: '', max: ''}})}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
            {filters.components.length > 0 && (
              <div className="filter-tag">
                <i className="fas fa-cogs"></i>
                {filters.components.join(', ')}
                <button onClick={() => setFilters({...filters, components: []})}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
            <button className="clear-all-btn" onClick={clearFilters}>
              <i className="fas fa-trash-alt"></i> Clear All
            </button>
          </div>
        )}
        
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
                    {searchTerm || filters.isFiltered ? 'No items match your search or filters.' : 'No inventory items available. Add an item to get started.'}
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