import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/World.css";
import Header from "../js/Header";
import id_close from "../world/id_close.svg";
import id_notice from "../world/id_notice.png";

const apiUrl = process.env.REACT_APP_API_URL;

// 取得隨機方向
function getRandomDirection() {
  return Math.random() < 0.5 ? -1 : 1; // 50% 機率為負數
}

const World = () => {
  const [cookie, setCookie] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [showIdPopup, setShowIdPopup] = useState(false);
  const userId = "#0507"; // 這裡可以替換為動態 ID

  useEffect(() => {
    const fetchCookie = async () => {
      try {
        const response = await axios.get(`${apiUrl}/get-cookie`, {
          withCredentials: true,
        });
        setCookie(response.data.account);
        console.log(response.data.account)
        if(cookie)
          setShowIdPopup(true); // 只有在取得 cookie 成功後才顯示
      } catch (error) {
        console.error("獲取 Cookie 失敗:", error);
      }
    };
    fetchCookie();
  }, []);

  // 初始化圖片狀態
  const [images, setImages] = useState(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    return Array.from({ length: 5 }, (_, index) => ({
      id: `bio00${index + 1}`,
      src: `bio_${index + 1}.svg`,
      x: Math.random() * screenWidth * 0.8, // 確保圖片不會超出邊界
      y: Math.random() * screenHeight * 0.8, 
      scale: Math.random() * (0.1 - 0.05) + 0.05,
      speed: Math.random() * 2 + 0.5,
      directionX: getRandomDirection(),
      directionY: getRandomDirection(),
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 + 0.5,
    }));
  });

  useEffect(() => {
    let animationFrameId;

    const updatePositions = () => {
      setImages((prevImages) =>
        prevImages.map((image) => {
          let newX = image.x + image.speed * image.directionX;
          let newY = image.y + image.speed * image.directionY;
          let newRotation = (image.rotation + image.rotationSpeed) % 360;

          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;

          // 邊界檢測，避免圖片超出視窗範圍
          if (newX < 0 || newX > screenWidth - 50) {
            image.directionX = -image.directionX;
          }
          if (newY < 0 || newY > screenHeight - 50) {
            image.directionY = -image.directionY;
          }

          return { ...image, x: newX, y: newY, rotation: newRotation };
        })
      );

      animationFrameId = requestAnimationFrame(updatePositions);
    };

    animationFrameId = requestAnimationFrame(updatePositions);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div id="container">
      <Header images={["world_ul_btn.svg", "wall_btn.svg", "culture_btn.svg"]} />
      <div className="world_bio">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt="菌種"
            className={image.id}
            style={{
              position: "absolute",
              left: `${image.x}px`,
              top: `${image.y}px`,
              transform: `scale(${image.scale}) rotate(${image.rotation}deg)`,
              transition: "none",
              zIndex: Math.floor(image.scale * 10000),
            }}
            onMouseEnter={(e) => {
              setHoveredImage({
                src: "information.svg",
                x: e.clientX + 15,
                y: e.clientY + 15,
                scale: 2, // 調整放大倍數
              });
            }}
            onMouseMove={(e) => {
              setHoveredImage((prev) => prev && { ...prev, x: e.clientX + 15, y: e.clientY + 15 });
            }}
            onMouseLeave={() => {
              setHoveredImage(null);
            }}
          />
        ))}

        {/* 滑鼠懸停時顯示的圖片 */}
        {hoveredImage && (
          <img
            src={hoveredImage.src}
            alt="hover"
            style={{
              position: "absolute",
              left: `${hoveredImage.x}px`,
              top: `${hoveredImage.y}px`,
              transform: `scale(${hoveredImage.scale})`,
              width: "50px",
              height: "50px",
              pointerEvents: "none",
              transition: "transform 0.1s ease-out",
              zIndex: 10000,
            }}
          />
        )}

        {/* ID 提示視窗 */}
        {showIdPopup && (
          <div className="id-popup">
            <div className="popup-content">
              <strong>您的專屬 ID：{userId}</strong>
              <img src={id_notice} alt="id_notice" className="id_notice" />
              <img src={id_close} alt="id_close" className="id_close" onClick={() => setShowIdPopup(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default World;
