import React from "react";
import Sidebar from "./sidebar";
import "./layout.css"

function AdminLayout({ children }) {
  return (
    <div className="adminLayout">
        <div className="sidebar">
            <Sidebar/>
        </div>

        <div className="Admin-childrenContet">
          <div>{children}</div>
        </div>
    </div>
  );
}

export default AdminLayout;