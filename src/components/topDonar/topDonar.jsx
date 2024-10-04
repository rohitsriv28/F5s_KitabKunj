  import React, { useState, useEffect } from "react";
  import { db } from "../helper/firebaseConfig";
  import { collection, getDocs, orderBy, query } from "firebase/firestore";
  import Loader from "../loader/loader";
  import "./RecentDonors.css";

  const RecentDonors = () => {
    const [recentDonors, setRecentDonors] = useState([]);

    useEffect(() => {
      const fetchRecentDonors = async () => {
        try {
          const recentDonorsCollection = collection(db, "recentDonation");
          const querySnapshot = await getDocs(
            query(recentDonorsCollection, orderBy("timestamp", "desc"))
          );

          const donationsArray = [];

          querySnapshot.forEach((doc) => {
            const donationData = doc.data();
            console.log(donationData);
            donationsArray.push(donationData);
          });

          setRecentDonors(donationsArray);
        } catch (error) {
          console.error("Error fetching recent donors:", error.message);
        }
      };

      fetchRecentDonors();
    }, []);

    const visibleDonors = recentDonors.slice(0, 4);

    if(recentDonors.length===0){
      return(
        <Loader/>
      )
    }

    return (
      <div className="donar-collecttion">
        <div className="recent-donors">
        {/* <h2>Recent Donors</h2> */}
        <div className="donor-container">
          {visibleDonors.map((donation, index) => (
            <div key={index} className="donor-card">
              <div className="user-details">
                {donation.user.profileImg && (
                  <img
                    src={donation.user.profileImg}
                    alt={donation.user.name}
                    className="user-image"
                  />
                )}
                <p>
                  <strong>Name:</strong> {donation.user.name}
                </p>
                <p>
                  <strong>Email:</strong> {donation.user.email}
                </p>
              </div>
              <div className="book-details">
                <p>
                  <strong>Book Name:</strong> {donation.book.bookName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    );
  };

  export default RecentDonors;
