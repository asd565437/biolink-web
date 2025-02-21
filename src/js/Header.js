import "../css/Header.css";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App"; // 引入全域 Socket 上下文
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const Header = ({ images }) => {
  const userId = useContext(UserContext);
  const navigate = useNavigate();
  const urls = ['/world', '/wall', '/connect', '/', '/login'];

  if (!Array.isArray(images)) {
    images = ['world_btn.svg', 'wall_btn.svg', 'culture_btn.svg'];
  }

  // 檢查後端是否有有效的 userAccount Cookie
  const checkAuthStatus = async () => {
    try {
      const res = await axios.get(`${apiUrl}/check_auth`, { withCredentials: true });
      return res.data.isAuthenticated; // 假設後端返回 { isAuthenticated: true/false }
    } catch (error) {
      console.error("檢查登入狀態失敗：", error);
      return false;
    }
  };

  // 清除 Cookie
  const clearCookie = async () => {
    try {
      await axios.get(`${apiUrl}/clear_cookie`, { withCredentials: true });
      console.log("Cookie 清除成功");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("清空 Cookie 失敗：", error);
    }
  };

  // 設定登入狀態
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 監聽 userId 變化 & 檢查後端登入狀態
  useEffect(() => {
    const updateLoginStatus = async () => {
      const authStatus = await checkAuthStatus();
      setIsLoggedIn(authStatus);
    };

    updateLoginStatus();
  }, [userId]); // 依賴 userId 變化

  // 監聽 Cookie 變化（每 10 秒檢查一次）
  useEffect(() => {
    const interval = setInterval(async () => {
      const authStatus = await checkAuthStatus();
      setIsLoggedIn(authStatus);
    }, 10000); // 每 10 秒檢查一次

    return () => clearInterval(interval); // 清理計時器
  }, []);

  const handleNavigate = (index) => {
    navigate(urls[index]);
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
          {images.map((image, index) => (
            <img
              key={index}
              src={`/${image}`}
              alt={`Header Image ${index + 1}`}
              style={{...positionAdjustments[index]}}
              onClick={() => handleNavigate(index)}
              className="nav-item"
            />
          ))}
        </nav>

        <h2
          className="header-login"
          onClick={async () => {
            if (isLoggedIn) {
              await clearCookie();
            }
            handleNavigate(4);
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
