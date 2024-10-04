import React, { useEffect, useState } from "react";
import "./tab.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../helper/firebaseConfig";
import { NavLink } from "react-router-dom";

function Tab() {
  const userId = localStorage.getItem("uid");
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userDocRef = doc(db, "myNumber", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          setUserProfile(userDocSnapshot.data());
          console.log(userDocSnapshot.data());
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  return (
    <section id="tab-container">
      <div className="tab-container">
        <div className="tab">
          <NavLink to="/MyBoughtBook">
            <div className="tab-grp">
              <p>Bought</p>
              <span>
                {userProfile?.bought ?? "0"}&nbsp;
                Books
              </span>
            </div>
          </NavLink>
        </div>
        <div className="tab">
          <NavLink to="/MyBoughtBook">
            <div className="tab-grp">
              <p>Sold</p>
              <span>
                {userProfile?.sale ?? "0"}&nbsp;
                Books
              </span>
            </div>
          </NavLink>
        </div>
        <div className="tab">
          <NavLink to="/MyBoughtBook">
            <div className="tab-grp">
              <p>Rented</p>
              <span>
                {userProfile?.rent ?? "0"}&nbsp;
                Books
              </span>
            </div>
          </NavLink>
        </div>
        <div className="tab">
          <NavLink to="/MyBoughtBook">
            <div className="tab-grp">
              <p>Donated</p>
              <span>
                {userProfile?.donate ?? "0"}&nbsp;
                Books
              </span>
            </div>
          </NavLink>
        </div>
      </div>
    </section>
  );
}

export default Tab;
