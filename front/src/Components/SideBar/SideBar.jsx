import { Link } from "react-router-dom";

import "./sidebar.css";

function SideBar() {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/home" className="link">
            <li className="sidebarListItem active">
              {/* <LineStyle className="sidebarIcon" /> */}
              Home
            </li>
            </Link>
            <li className="sidebarListItem">
              {/* <Timeline className="sidebarIcon" /> */}
              Analytics
            </li>
            <li className="sidebarListItem">
              {/* <TrendingUp className="sidebarIcon" /> */}
              Sales
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/ManageUser" className="link">
              <li className="sidebarListItem">
                {/* <PermIdentity className="sidebarIcon" /> */}
                Users
              </li>
            </Link>
            <Link to="/products" className="link">
              <li className="sidebarListItem">
                {/* <Storefront className="sidebarIcon" /> */}
                Products
              </li>
            </Link>
            <li className="sidebarListItem">
              {/* <AttachMoney className="sidebarIcon" /> */}
              Transactions
            </li>
            <li className="sidebarListItem">
              {/* <BarChart className="sidebarIcon" /> */}
              Reports
            </li>
          </ul>
        </div>

        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/WriteNewsletter" className="link">
              <li className="sidebarListItem">
                {/* <PermIdentity className="sidebarIcon" /> */}
                Write a Newsletter
              </li>
            </Link>
            <li className="sidebarListItem">
              {/* <AttachMoney className="sidebarIcon" /> */}
              Transactions
            </li>
            <li className="sidebarListItem">
              {/* <BarChart className="sidebarIcon" /> */}
              Reports
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}

export default SideBar;