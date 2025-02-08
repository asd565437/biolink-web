import React, { useState, useEffect } from "react";
import "../css/World.css";
import Header from "../js/Header";
let cookie = null;
function getNumber(number) {
  return Math.random() < 0.5 ? -number : number; // 50% 機率為負數
}
async function getCookie() {
  try {
    const response = await fetch('http://localhost:5000/get-cookie', {
      method: 'GET',
      credentials: 'include'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("獲取 Cookie 失敗:", error);
  }
} getCookie().then(cookies => {
  cookie = cookies;
});
function World() {
  const [images, setImages] = useState(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    getCookie();
    return Array.from({ length: 5 }, (_, index) => ({
      id: `bio00${index + 1}`,
      src: `bio_${index + 1}.svg`,
      x: Math.random() * screenWidth - screenWidth / 2,
      y: Math.random() * screenHeight - screenHeight,
      scale: Math.random() * (0.1 - 0.05) + 0.05,
      speed: Math.random() * 2 + 0.5, // 調整速度
      directionX: getNumber(1),
      directionY: 1,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 + 0.5,
    }));
  });
  const [hoveredImage, setHoveredImage] = useState(null);

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

          // 邊界檢測，超出範圍則反彈
          if (newX < -screenWidth / 2 || newX > screenWidth / 2) {
            image.directionX = -image.directionX;
          }
          if (newY < -screenHeight || newY > 0) {
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
                x: e.clientX + 15, // 避免鼠標擋住圖片
                y: e.clientY + 15,
                scale: 5, // 改為 2 倍放大，避免太誇張
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

        {/* 滑鼠懸浮時顯示的圖片 */}
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
              transition: "transform 0.1s ease-out", // 添加平滑效果
              zIndex: 10000,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default World;
