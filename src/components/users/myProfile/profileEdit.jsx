import React, { useState } from "react";


function ProfileEdit({ isOpen, onClose, user }) {
    const [editedUser, setEditedUser] = useState({ ...user });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
    };
  
    const handleSaveChanges = () => {
      console.log(editedUser)
      onClose();
    };
  
    return (
      <>
        <div className={`dialog-overlay ${isOpen ? "open" : ""}`}>
          <div className="dialog profileEditDialog">
            <h2>Edit Profile</h2>
            <form>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
              />
  
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
              />
  
              {/* Add other input fields for editing other user details */}
            </form>
  
            <div className="dialog-buttons">
              <button onClick={handleSaveChanges}>Save Changes</button>
              <button onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  export default ProfileEdit;