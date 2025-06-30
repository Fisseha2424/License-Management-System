import React from "react";
import { Link } from "react-router-dom";
import "../assets/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>License Management System</h2>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <Link to="/companies" className="sidebar-link">
            Company Management
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/licenses" className="sidebar-link">
            License Management
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/payments" className="sidebar-link">
            Payment Management
          </Link>
        </li>
        <li className="sidebar-item">
          <Link to="/fees" className="sidebar-link">
            Fee Management
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
