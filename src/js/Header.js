import "../css/Header.css";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App"; // 引入全域 Socket 上下文
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const Header = ({ images }) => {
  const [isOpen, setIsOpen] = useState(false); // 控制功能列是否顯示
  const [show, setShow] = useState(window.innerWidth >= 768);
  const userId = useContext(UserContext);
  const navigate = useNavigate();
  const urls = ['/world', '/wall', '/connect', '/', '/login'];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("LOGIN");

  const toggleMenu = () => {
    setIsOpen(!isOpen); // 切換功能列顯示與隱藏
  };
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

  useEffect(() => {
    const handleResize = () => {
      setShow(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const updateLoginStatus = async () => {
      const authStatus = await checkAuthStatus();
      setIsLoggedIn(authStatus);

      // 直接調用 fetchUserData，避免依賴 isLoggedIn 的更新
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`${apiUrl}/get-cookie`, { withCredentials: true });
          if (response.data.userName) setUserName(response.data.userName);
          else setUserName(null);
        } catch (error) {
          console.error("获取 Cookie 失败:", error);
        }
      };

      if (authStatus) fetchUserData();
    };

    updateLoginStatus();
  }, [userId]); // 依賴 userId

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
      zIndex: 999,
      width: '27.5%',
    },
    {
      zIndex: 999,
      width: '17.5%',
    },
    {
      zIndex: 999,
      width: '27.5%',
    },
  ];

  return (
    <>
      <header className="header">
        <div className="header-logo" onClick={() => handleNavigate(0)}></div>
        {show && (
          <div className="navList">
            <nav className="nav-menu">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={`/${image}`}
                  alt={`Header Image ${index + 1}`}
                  style={{ ...positionAdjustments[index] }}
                  onClick={() => handleNavigate(index)}
                  className="nav-item"
                />
              ))}
            </nav>

            {/* 垂直導覽列 */}
            <div
              className="header-login-container"
              onMouseEnter={() =>
                isLoggedIn ? setIsDropdownOpen(true) : setIsDropdownOpen(false)
              }
            >
              <h2
                className="header-login"
                onClick={() => {
                  if (!isLoggedIn) {
                    handleNavigate(4);
                  }
                }}
              >
                {isLoggedIn ? userName : "LOGIN"}
              </h2>
            </div>

            {/* 下拉選單 */}
            <div>
              {isDropdownOpen && (
                <div
                  className="login-dropdown"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <h3 className="logID">#{userId?.userId}</h3>
                  <h3
                    className="login-container-logout"
                    onClick={async () => {
                      if (isLoggedIn) {
                        await clearCookie();
                        handleNavigate(4);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    LOGOUT
                  </h3>
                </div>
              )}
            </div>
          </div>
        )}

        {!show && (
          <button
            className={`menubtn ${isOpen ? 'open' : ''}`}
            onClick={toggleMenu}
          >
            <img
              src="/menu.png"  // 替換為你的圖片路徑
              alt="功能圖標"
            />
          </button>
        )}
        {/* 功能列：點擊按鈕後顯示或隱藏 */}
      </header>
      {!show && isOpen && (
        <div
          className="menu w-16 h-full text-white shadow-lg p-4"
        >
          <ul className="icon_table">
            <li className="mb-2">
              <img src="/world_icon.png"  // 替換為你的圖片路徑
                onClick={() => handleNavigate(0)}
                alt="功能圖標1" />
            </li>
            <li className="mb-2">
              <img src="/wall_icon.png"  // 替換為你的圖片路徑
                onClick={() => handleNavigate(1)}
                alt="功能圖標2" /></li>
            <li className="mb-2">
              <img src="/connect_icon.png"  // 替換為你的圖片路徑
                onClick={() => handleNavigate(2)}
                alt="功能圖標3" style={{left:'1%'}} /></li>
            <li className="mb-2">
              <img src="/logout_icon.png"  // 替換為你的圖片路徑
                onClick={() => handleNavigate(4)}
                alt="功能圖標4" /></li>
          </ul>
        </div>
      )}
    </>
  );
};

// 默认属性
Header.defaultProps = {
  images: ['world_btn.svg', 'wall_ul_btn.svg', 'culture_btn.svg'],
};

export default Header;
