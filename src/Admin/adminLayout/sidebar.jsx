import React from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
  const user = localStorage.getItem("userD")
  const userDetails = JSON.parse(user)
  console.log(userDetails)
  return (
    <div className="sidebar">
      <div className="admin-profile">
        <p>{userDetails.name}</p>
      </div>
      <div className="admin-option">
        <ol>

         {/* <Link to="/donate"><li>Donation</li></Link>  */}

         {userDetails.role === "admin" && <Link to="/donate"><li>Donation</li></Link>   }
         {userDetails.role !== "admin" && <Link to="/ApproveRent"><li>Approve Rent</li></Link>   }
         {userDetails.role !== "admin" && <Link to="/PendingBooksList"><li>Book Request</li></Link>   }

          <li>Event</li>
          {/* <li>Book Request</li> */}
        </ol>
      </div>
    </div>
  );
}

export default Sidebar;
