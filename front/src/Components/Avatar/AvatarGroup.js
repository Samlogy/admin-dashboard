import React, { useState } from 'react';

import './style.css';

const AvatarGroup = ({ children }) => {  

  return (<div className="avatar-group-container"> 
            { children.map((el, index) => el) } 
          </div> );
};

export default AvatarGroup;