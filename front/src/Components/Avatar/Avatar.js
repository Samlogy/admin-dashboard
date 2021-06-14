import React, { useState } from 'react';
// import { FaUser } from 'react-icons/fa';

import './style.css';

const Avatar = props => {  
  const { icon, imgUrl, name, size, shape, badge, multiple } = props;

  const colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
  // generate avatar initals
  const genAvatarInitials = name => {
    let nameArray = name.split(" ");
    if(nameArray.length <= 1)  return name.charAt(0).toUpperCase()
    return nameArray[0].charAt(0).toUpperCase() + nameArray[1].charAt(0).toUpperCase();
  };
  // generate avatar color
  const genAvatarColor = colors => {
      const index = Math.floor((Math.random() * colors.length) + 0);
      return colors[index];
  };  
  // imgUrl
  const showAvatarImg = () => {
    return  <div className={`avatar avatar-${size} avatar-${shape}`}>
              { badge && badge ? <div className={`badge ${badge}`}></div> : ''}
              <img className="avatar__img" src={imgUrl} alt="" />
            </div> 
  };
  // Icon
  const showAvatarIcon = () => {
    return  <div className={`avatar avatar-${size} avatar-${shape}`}>
                { badge && badge ? <div className={`badge ${badge}`}></div> : ''}
                {/* <FaUser className="icon-user" /> */}
            </div> // icon
  };
  // Name
  const showAvatarName = (name, colors) => {
    const avatarInitial = genAvatarInitials(name);
    const avatarColor = genAvatarColor(colors);
    
    return  <div className={`avatar avatar-${size} avatar-${shape}`} style={{ backgroundColor: avatarColor, color: '#fefefe'}} >
              { badge && badge ? <div className={`badge ${badge}`}></div> : ''}
              <h5 className="avatar__initials"> {avatarInitial} </h5>
            </div> // name initials
  };

  // Name Multiple
  const showAvatarNameMultiple = (name, index, colors, styles) => {
    const avatarInitial = genAvatarInitials(name);
    const avatarColor = genAvatarColor(colors);
    
    return  <div key={index} className={`avatar avatar-${size} avatar-${shape}`} style={{ backgroundColor: avatarColor, color: '#fefefe'}} >
              { badge && badge ? <div className={`badge ${badge}`}></div> : ''}
              <h5 className="avatar__initials"> {avatarInitial} </h5>
            </div> // name initials
  };
  // Multiple
  const showMultipleAvatar = () => {
    // const styles = [{ right: '-2%'}, { right: '-5%'}, { right: '-8%'}, { right: '-11%'}, { right: '-14%'}, { right: '-17%'}] 
    // Name
    return <div className="avatar-multiple">
              { name.map((el, index) =>  showAvatarNameMultiple(el, index, colors)  )}
           </div>
  };


  return(
    multiple && multiple ? showMultipleAvatar() :
    name && name ? showAvatarName(name, colors) :
    icon && icon ? showAvatarIcon() : 
    imgUrl && imgUrl ? showAvatarImg() :  ''
  )
  
  
};

export default Avatar;