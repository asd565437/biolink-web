import "../css/Header.css";
import { useNavigate} from 'react-router-dom';
import React, { useState ,useEffect, useContext } from "react";
import { UserContext } from "../App"; // 引入全域 Socket 上下文
const Header = ({ images }) => {
  const userId = useContext(UserContext);
  const navigate = useNavigate();
  const urls = ['/world', '/wall', '/connect', '/', '/login'];

  if (!Array.isArray(images)) {
    images = ['world_btn.svg',
      'wall_btn.svg',
      'culture_btn.svg']
  }
  const handleNavigate = (index) => {
    navigate(urls[index]);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const handleLog = () => {
    if(userId)
      setIsLoggedIn(true);   
    else
      setIsLoggedIn(false);   
  };

  const positionAdjustments = [
    {
      width: '27.5%',
    },
    {
      width: '17.5%',
    },
    {
      width: '27.5%',
    },
  ];

  return (
    <header className="header">
      <div className="header-logo" onClick={() => handleNavigate(3)}></div>
      <div className="navList">
        <nav className="nav-menu">
          {images.map((image, index) => {
            return (
              <img
                key={index}
                src={`/${image}`} // 如果使用动态路径，请改用 require
                alt={`Header Image ${index + 1}`}
                style={{ ...positionAdjustments[index] }}
                onClick={() => handleNavigate(index)}
                className="nav-item"
              />
            );
          })}
        </nav>

        <h2
          className="header-login"
          onClick={() => {
            handleNavigate(4);
            handleLog();
          }}
        >
          {isLoggedIn ? "LOGOUT" : "LOGIN"}
        </h2>
      </div>

    </header>
  );
};
// 默认属性
Header.defaultProps = {
  images: ['world_btn.svg', 'wall_ul_btn.svg', 'culture_btn.svg'],
};

export default Header;
