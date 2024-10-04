import React from "react";
import MyProfile from "./myProfile";
import Tab from "./tab";

const ProfileLayout = React.memo(({ children }) => {
  return (
    <div className="layout-div-profile">
      <div className="prof-div">
        <MyProfile />
        <Tab />
      </div>
      <div className="prof-tab">{children}</div>
    </div>
  );
});

export default ProfileLayout;
