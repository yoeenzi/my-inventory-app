// src/components/modals/EditProfileModal.js
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';

const EditProfileModal = () => {
  const { userData, updateUserData, showEditProfileModal, setShowEditProfileModal } = useContext(AppContext);
  
  // Form data state
  const [formData, setFormData] = useState({
    profileName: '',
    profileEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Profile image state
  const [profileImage, setProfileImage] = useState(null);
  
  // Password visibility state
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  
  // Password validation state
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  
  // Load user data when modal opens
  useEffect(() => {
    if (showEditProfileModal) {
      setFormData({
        profileName: userData.name,
        profileEmail: userData.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setProfileImage(userData.avatar);
      setPasswordMismatch(false);
    }
  }, [showEditProfileModal, userData]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    
    // Check password match
    if (id === 'newPassword' || id === 'confirmPassword') {
      validatePasswords();
    }
  };
  
  // Validate passwords match
  const validatePasswords = () => {
    if (formData.newPassword || formData.confirmPassword) {
      const mismatch = formData.newPassword !== formData.confirmPassword;
      setPasswordMismatch(mismatch);
      return !mismatch;
    }
    return true;
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field]
    });
  };
  
  // Handle profile image upload
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
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Validate passwords
    if (!validatePasswords()) {
      return;
    }
    
    // Validate current password (in a real app, this would verify against stored password)
    if (!formData.currentPassword) {
      alert('Please enter your current password');
      return;
    }
    
    // Update user data
    updateUserData({
      name: formData.profileName,
      email: formData.profileEmail,
      avatar: profileImage
    });
    
    // In a real app, you would also update the password here
    
    // Close modal
    setShowEditProfileModal(false);
    
    // Show success message
    alert('Profile updated successfully!');
  };
  
  // Close modal
  const closeModal = () => {
    setShowEditProfileModal(false);
  };

  return (
    <div className={`modal ${showEditProfileModal ? 'active' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Edit Profile</h3>
          <span className="close-button" onClick={closeModal}>&times;</span>
        </div>
        <div className="modal-body">
          <form id="editProfileForm">
            <div className="profile-image-container">
              <div 
                className="profile-image"
                onClick={() => document.getElementById('profileImage').click()}
              >
                <img 
                  id="profilePreview" 
                  src={profileImage} 
                  alt="Profile Preview" 
                />
                <div className="image-overlay">
                  <i className="fas fa-camera"></i>
                </div>
                <input 
                  type="file" 
                  id="profileImage" 
                  accept="image/*" 
                  hidden
                  onChange={handleImageUpload}
                />
              </div>
              <div 
                className="profile-image-text"
                onClick={() => document.getElementById('profileImage').click()}
              >
                Change Profile Picture
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="profileName">Full Name *</label>
                <input 
                  type="text" 
                  id="profileName" 
                  placeholder="Enter your full name" 
                  value={formData.profileName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="profileEmail">Company Email *</label>
                <input 
                  type="email" 
                  id="profileEmail" 
                  placeholder="Enter your company email" 
                  value={formData.profileEmail}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="currentPassword">Current Password *</label>
                <div className="password-input-wrapper">
                  <input 
                    type={passwordVisibility.currentPassword ? 'text' : 'password'} 
                    id="currentPassword" 
                    placeholder="Enter current password" 
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required 
                  />
                  <div 
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('currentPassword')}
                  >
                    <i className={`fas fa-eye${passwordVisibility.currentPassword ? '-slash' : ''}`}></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="newPassword">New Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={passwordVisibility.newPassword ? 'text' : 'password'} 
                    id="newPassword" 
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                  <div 
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('newPassword')}
                  >
                    <i className={`fas fa-eye${passwordVisibility.newPassword ? '-slash' : ''}`}></i>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input 
                    type={passwordVisibility.confirmPassword ? 'text' : 'password'} 
                    id="confirmPassword" 
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <div 
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                  >
                    <i className={`fas fa-eye${passwordVisibility.confirmPassword ? '-slash' : ''}`}></i>
                  </div>
                </div>
                {passwordMismatch && (
                  <div id="passwordMismatch" className="error-message">
                    Passwords do not match
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-light" onClick={closeModal}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;