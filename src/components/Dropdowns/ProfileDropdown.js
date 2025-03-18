// src/components/dropdowns/ProfileDropdown.js
import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const ProfileDropdown = () => {
  const { 
    showProfileDropdown, 
    setShowProfileDropdown, 
    setShowEditProfileModal 
  } = useContext(AppContext);

  // Handle edit profile click
  const handleEditProfile = () => {
    setShowProfileDropdown(false);
    setShowEditProfileModal(true);
  };

  // Handle logout click
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      setShowProfileDropdown(false);
      alert('You have been logged out.');
      // In a real app, this would redirect to login page
    }
  };

  // If dropdown is not active, don't render it
  if (!showProfileDropdown) {
    return null;
  }

  return (
    <div className="profile-dropdown active" id="profileDropdown">
      <div className="dropdown-item" id="editProfileBtn" onClick={handleEditProfile}>
        <i className="fas fa-user-edit"></i>
        <span>Edit Profile</span>
      </div>
      <div className="dropdown-item" id="logoutBtn" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </div>
    </div>
  );
};

export default ProfileDropdown;