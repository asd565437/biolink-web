import "../css/Header.css";
import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import Login from "../header/login.svg";

const Header = ({ images }) => {
  const navigate = useNavigate();
  const urls = ['/world', '/wall', '/connect','/','/login'];

  if (!Array.isArray(images)) {
    images = ['world_btn.svg', 
      'wall_btn.svg', 
      'culture_btn.svg']
  }
  const handleNavigate = (index) => {
    navigate(urls[index]);
  };

  const logImages = ["/login.svg","/logout.svg"];
  const [currentImage, setCurrentImage] = useState(0);
  const handleLog = () => {
    // 切換圖片 (0 -> 1 或 1 -> 0)
    setCurrentImage((prev) => (prev === 0 ? 1 : 0));
  };


  const positionAdjustments = [
    {
      width: '7.5%',
      position: 'absolute',
      left: '64.2%',
    }, // 对应 .symbiosis
    {
      width: '4.5%',
      position: 'absolute',
      left: '73.7%',
    }, // 对应 .show
    {
      width: '7.5%',
      position: 'absolute',
      left: '80.5%',
    }, // 对应 .game
  ];
  
  return (
    <header className="header">
      <div className="header-logo" onClick={() => handleNavigate(3)}></div>
      <div>
        {images.map((image, index) => {
          return (
            <img
              key={index}
              src={`/${image}`} // 如果使用动态路径，请改用 require
              alt={`Header Image ${index + 1}`}
              style={{...positionAdjustments[index]}}
              onClick={() => handleNavigate(index)}
            />
          );
        })}
        <img 
          src={logImages[currentImage]}
          className="header-login"
          onClick={() => {
            handleNavigate(4);
            handleLog();
            }}
          alt={currentImage === 0 ? "登入" : "登出"}
        />
      </div>
    </header>
  );
};
// 默认属性
Header.defaultProps = {
  images: ['world_btn.svg', 'wall_ul_btn.svg', 'culture_btn.svg'],
};

export default Header;
