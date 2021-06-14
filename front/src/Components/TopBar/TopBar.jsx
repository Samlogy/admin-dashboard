import React from "react";
import { Link } from "react-router-dom"
import { NotificationsNone, Language, Settings } from "@material-ui/icons";

import Logout from "../../Pages/Auth/Logout"

import "./topbar.css";

function TopBar(props) {
  const avatar = props.avatar
  const notifs = props.notifs

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo"> admin panel </span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <Link to="/Notifications"> <NotificationsNone /> </Link>
            { (notifs && notifs.length > 0) &&
              <span className="topIconBadge"> {notifs.length} </span>
            }            
          </div>

          {/* <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div> */}

          <img src={avatar && avatar} alt="avatar image" className="topAvatar" />
          <Logout />
        </div>
      </div>
    </div>
  );
}

export default TopBar
