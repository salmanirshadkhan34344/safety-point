import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderCard from "../global/HeaderCard";
import Sidebar from "../sidebar/Sidebar";

const AdminLayout = (props) => {
  const [toggled, setToggled] = useState(false);

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  return (
    <>
      <div className="main-layout">
        <Sidebar toggled={toggled} handleToggleSidebar={handleToggleSidebar} />
        <main className="main-content table-responsive p-4">
          <HeaderCard />
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
