import React, { useState, useEffect } from "react";
import '../css/World.css';
import Header from "../js/Header";
import { useData } from '../DataContext';

function World() {
  const [images, setImages] = useState([
    { id: 'bio001', src: "bio_1.svg", x: -100, y: -500, scale: 0.05, speed: 1 },
    { id: 'bio002', src: "bio_2.svg", x: -100, y: -500, scale: 0.05, speed: 1 },
    { id: 'bio003', src: "bio_3.svg", x: -100, y: -500, scale: 0.05, speed: 1 },
    { id: 'bio004', src: "bio_4.svg", x: -100, y: -500, scale: 0.05, speed: 1 },
    { id: 'bio005', src: "bio_5.svg", x: -100, y: -500, scale: 0.05, speed: 1 },
  ]);

  // 設置每個圖片的初始位置為畫面中心
  const getCenterPosition = () => ({
    x: -100,
    y: -500,
  });

  useEffect(() => {
    // 初始化所有圖片的起始位置為畫面中心
    setImages(prevImages =>
      prevImages.map(image => ({
        ...image,
        ...getCenterPosition(),
      }))
    );

    // 每秒隨機更新圖片位置
    const interval = setInterval(() => {
      setImages(prevImages =>
        prevImages.map(image => ({
          ...image,
          x: Math.random() * (window.innerWidth + 2000) - 1500,  // 隨機 x 座標，保持圖片不會超出範圍
          y: Math.random() * (window.innerHeight + 1000) - 1000, // 隨機 y 座標，保持圖片不會超出範圍
          scale: Math.random() * (0.1 - 0.05) + 0.1, // 隨機 scale，範圍 0.5 - 1.5
          speed: Math.random() * 2 + 1,  // 隨機速度，範圍 1 - 3
        }))
      );
    }, 1500);

    return () => clearInterval(interval); // 清除定時器
  }, []);

  return (
    <div id="container">
      <Header images={['world_ul_btn.svg', 'wall_btn.svg', 'culture_btn.svg']} />
      <div className="bio">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt="菌種"
            className={image.id} // 添加 bio-image 類名
            style={{
              position: 'absolute',
              left: `${image.x}px`,
              top: `${image.y}px`,
              transform: `scale(${image.scale})`,
              transition: `all ${image.speed}s ease-in-out`,
              zIndex: Math.floor(Math.random() * 1000),  // 隨機 z-index
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default World;
