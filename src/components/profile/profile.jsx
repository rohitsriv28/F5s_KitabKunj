import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../helper/firebaseConfig';
import { collection, doc, getDoc } from "firebase/firestore";
import "../profile/profile.css"

function Profile() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            setUserData(docSnapshot.data());
          } else {
            console.log('User data not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [user]);

  return (
    <div className="profile-container">
      {user && (
        <div className="profile-details">
          <h1>Welcome, {user.displayName}</h1>
          <div className="user-info">
            <span>Email: {userData?.email}</span>
            <span>Phone: {userData?.phone}</span>
            <span>Address: {userData?.address}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
