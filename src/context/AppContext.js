// src/context/AppContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AppContext = createContext();

// Create the context provider
export const AppProvider = ({ children }) => {
  // Main state for the application
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || false
  );
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showViewItemModal, setShowViewItemModal] = useState(false);
  
  // User data
  const [userData, setUserData] = useState({
    name: 'Manticao-ACD',
    email: 'manticao@acd.com',
    role: 'Store Manager',
    avatar: '/assets/lebron.avif'
  });
  
  // Stock data
  const [stockData, setStockData] = useState({
    itemsInHand: 0,
    stockIn: 0,
    stockOut: 0,
    chartData: null
  });

  // Inventory items
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      date: '01/03/2025',
      partsNumber: 'ENG-104',
      partsName: 'Engine Oil Filter',
      component: 'Engine',
      quantity: 15,
      itemPrice: 1250,
      imageData: null,
      rack: 'A1',
      tax: 150,
      totalAmount: 18900,
      pic: 'John Doe',
      poNumber: 'PO-2025-001',
      ctplNumber: 'CTPL-001',
    },
    {
      id: 2, 
      date: '28/02/2025',
      partsNumber: 'HYD-221',
      partsName: 'Hydraulic Pump',
      component: 'Hydraulic',
      quantity: 3,
      itemPrice: 8500,
      imageData: null,
      rack: 'B2',
      tax: 1020,
      totalAmount: 26520,
      pic: 'Sarah Smith',
      poNumber: 'PO-2025-002',
      ctplNumber: 'CTPL-002',
    }
  ]);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'stock-in',
      title: 'Stock In: Engine Oil Filter',
      productNumber: 'Part #ENG-104',
      quantity: '+15 units',
      time: '10 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'stock-out',
      title: 'Stock Out: Hydraulic Pump',
      productNumber: 'Part #HYD-221',
      quantity: '-2 units',
      time: '2 hours ago',
      unread: false
    },
    {
      id: 3,
      type: 'low-stock',
      title: 'Low Stock Alert: Fuel Filter',
      productNumber: 'Part #ENG-118',
      quantity: '3 units remaining',
      time: 'Yesterday',
      unread: false
    },
    {
      id: 4,
      type: 'stock-in',
      title: 'Stock In: Control Valve',
      productNumber: 'Part #HYD-305',
      quantity: '+8 units',
      time: 'Yesterday',
      unread: true
    }
  ]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  // Load stock data with a delay to simulate API fetch
  useEffect(() => {
    const loadStockData = () => {
      setTimeout(() => {
        setStockData({
          itemsInHand: 868,
          stockIn: 200,
          stockOut: 21,
          chartData: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            stockInData: [12000, 19000, 15000, 22000, 18000, 24000],
            stockOutData: [8000, 12000, 10000, 14000, 11000, 16000]
          }
        });
      }, 1000);
    };

    loadStockData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.user-profile') && 
          !event.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
      
      if (showNotificationDropdown && !event.target.closest('.notification-icon') && 
          !event.target.closest('.notification-dropdown')) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown, showNotificationDropdown]);

  // Function to toggle dark mode
  const toggleDarkMode = (value) => {
    setIsDarkMode(value);
  };

  // Function to add a new inventory item
  const addInventoryItem = (item) => {
    const newItem = {
      id: Date.now(),
      ...item
    };
    setInventoryItems([newItem, ...inventoryItems]);
    
    // Add notification for new item
    addNotification({
      type: 'stock-in',
      title: `Stock In: ${item.partsName}`,
      productNumber: `Part #${item.partsNumber}`,
      quantity: `+${item.quantity} units`
    });
  };

  // Function to update an existing inventory item
  const updateInventoryItem = (updatedItem) => {
    setInventoryItems(inventoryItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  // Function to delete an inventory item
  const deleteInventoryItem = (itemId) => {
    const itemToDelete = inventoryItems.find(item => item.id === itemId);
    setInventoryItems(inventoryItems.filter(item => item.id !== itemId));
    
    // Add notification for deleted item
    if (itemToDelete) {
      addNotification({
        type: 'stock-out',
        title: `Removed: ${itemToDelete.partsName}`,
        productNumber: `Part #${itemToDelete.partsNumber}`,
        quantity: `-${itemToDelete.quantity} units`
      });
    }
  };

  // Function to import inventory items from Excel
  const importItemsToInventory = (items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    
    // Clone the current items array
    const updatedItems = [...inventoryItems];
    const newItems = [];
    
    // Process each imported item
    items.forEach(newItem => {
      const existingItemIndex = updatedItems.findIndex(
        item => item.partsNumber === newItem.partsNumber
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item (merge properties)
        const updatedItem = {
          ...updatedItems[existingItemIndex],
          // Preserve the original ID
          id: updatedItems[existingItemIndex].id,
          // Update quantity
          quantity: parseInt(updatedItems[existingItemIndex].quantity) + parseInt(newItem.quantity)
        };
        
        // Only update other fields if they exist in the new item
        if (newItem.partsName) updatedItem.partsName = newItem.partsName;
        if (newItem.component) updatedItem.component = newItem.component;
        if (newItem.itemPrice) updatedItem.itemPrice = parseFloat(newItem.itemPrice);
        if (newItem.rack) updatedItem.rack = newItem.rack;
        if (newItem.tax) updatedItem.tax = parseFloat(newItem.tax);
        if (newItem.totalAmount) updatedItem.totalAmount = parseFloat(newItem.totalAmount);
        if (newItem.pic) updatedItem.pic = newItem.pic;
        if (newItem.poNumber) updatedItem.poNumber = newItem.poNumber;
        if (newItem.ctplNumber) updatedItem.ctplNumber = newItem.ctplNumber;
        
        updatedItems[existingItemIndex] = updatedItem;
        
        // Add notification for updated item
        addNotification({
          type: 'stock-in',
          title: `Updated: ${updatedItem.partsName}`,
          productNumber: `Part #${updatedItem.partsNumber}`,
          quantity: `+${newItem.quantity} units`
        });
      } else {
        // Add new item
        newItems.push(newItem);
        
        // Add notification for new item
        addNotification({
          type: 'stock-in',
          title: `New Item: ${newItem.partsName}`,
          productNumber: `Part #${newItem.partsNumber}`,
          quantity: `+${newItem.quantity} units`
        });
      }
    });
    
    // Update state with modified and new items
    setInventoryItems([...newItems, ...updatedItems]);
    
    // Update stock data (simplified - in a real app, you'd recalculate this)
    const totalNewQuantity = items.reduce((total, item) => total + parseInt(item.quantity || 0), 0);
    setStockData(prevData => ({
      ...prevData,
      itemsInHand: prevData.itemsInHand + totalNewQuantity,
      stockIn: prevData.stockIn + totalNewQuantity
    }));
  };

  // Function to mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      unread: false
    })));
  };

  // Function to mark a specific notification as read
  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId ? { ...notification, unread: false } : notification
    ));
  };

  // Function to add a new notification
  const addNotification = (notification) => {
    setNotifications([
      { 
        id: Date.now(),
        unread: true,
        time: 'Just now',
        ...notification 
      },
      ...notifications
    ]);
  };

  // Function to update user data
  const updateUserData = (data) => {
    setUserData({ ...userData, ...data });
  };

  // Count unread notifications
  const unreadCount = notifications.filter(notification => notification.unread).length;

  // Create the context value
  const contextValue = {
    activeSection,
    setActiveSection,
    isDarkMode,
    toggleDarkMode,
    userData,
    updateUserData,
    stockData,
    inventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    importItemsToInventory, // Add the new import function
    notifications,
    unreadCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    addNotification,
    showAddItemModal,
    setShowAddItemModal,
    showEditProfileModal,
    setShowEditProfileModal,
    showProfileDropdown,
    setShowProfileDropdown,
    showNotificationDropdown,
    setShowNotificationDropdown,
    selectedItem,
    setSelectedItem,
    showViewItemModal,
    setShowViewItemModal,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};