// src/App.js
import React, { useContext, useState } from 'react';
import { AppContext } from './context/AppContext';

// Import components
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import DailyReports from './components/DailyReports';
import ScanItem from './components/ScanItem';
import Footer from './components/TempFooter';
import AddItemModal from './components/Modals/AddItemModal';
import EditProfileModal from './components/Modals/EditProfileModal';
import ViewItemModal from './components/Modals/ViewItemModal';
import ProfileDropdown from './components/Dropdowns/ProfileDropdown';
import NotificationDropdown from './components/Dropdowns/NotificationDropdown';

// Import styles
import './styles/App.css';
import './styles/ModalStyles.css';
import './styles/LoginStyles.css';

function App() {
  const { activeSection, isDarkMode } = useContext(AppContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Check for remembered user on component mount
  React.useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      // Auto-login if user was remembered (in a real app, you'd verify with the backend)
      setCurrentUser(rememberedUser);
      setIsAuthenticated(true);
    }
  }, []);
  
  // Handle login
  const handleLogin = (username) => {
    setCurrentUser(username);
    setIsAuthenticated(true);
  };
  
  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    // You might want to clear any auth tokens from localStorage here
  };

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return (
      <div className={isDarkMode ? 'dark-mode' : ''}>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // If authenticated, show the main app
  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <Sidebar />
      
      <div className="main-content">
        <Header currentUser={currentUser} onLogout={handleLogout} />
        
        {activeSection === 'Dashboard' && <Dashboard />}
        {activeSection === 'Inventory' && <Inventory />}
        {activeSection === 'Daily Reports' && <DailyReports />}
        {activeSection === 'Scan Item' && <ScanItem />}
        
        <Footer />
      </div>
      
      {/* Modals - These are portal-style components that render at the document level */}
      <AddItemModal />
      <EditProfileModal />
      <ViewItemModal />
      <ProfileDropdown />
      <NotificationDropdown />
    </div>
  );
}

export default App;