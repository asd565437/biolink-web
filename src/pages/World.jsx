import React, { useState, useEffect, useContext ,useRef } from "react";
import axios from "axios";
import "../css/World.css";
import Header from "../js/Header";
import FunctionMenu from '../js/FunctionMenu';
import id_close from "../world/id_close.svg";
import id_notice from "../world/id_notice.png";
import { useLocation } from "react-router-dom";
import Showcase from "../js/Showcase";
import { UserContext } from "../App"; // 引入全局 Socket 上下文
const apiUrl = process.env.REACT_APP_API_URL;
// 取得隨機方向
function getNumber(number) {
  return Math.random() < 0.5 ? -number : number; // 50% 概率为负数
}

const World = () => {
  const [timestamp] = useState(new Date().getTime());
  const [hoveredImage, setHoveredImage] = useState(null);
  const [showIdPopup, setShowIdPopup] = useState(false);
  const { userId, setUserId } = useContext(UserContext);
    const [isImagesLoaded, setIsImagesLoaded] = useState(false); // 图片加载状态
  const location = useLocation();
  const popup = location.state?.popup || false; // 如果沒有數據則給預設值

    useEffect(() => {
      const preloadImages = (imageUrls) => {
        const promises = imageUrls.map((url) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = resolve; // 忽略加载失败的情况
          });
        });
        return Promise.all(promises);
      };
  
      const allImages = [...images];
      preloadImages(allImages).then(() => {
        setIsImagesLoaded(true); // 所有图片加载完成
        console.log('所有图片预加载完成');
      });
    }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/get-cookie`, {
          withCredentials: true,
        });
        console.log("获取到的用户 ID:", response.data.id);
        if (response.data.id)
          setUserId(response.data.id);
        else
          setUserId(null);
        if (popup)
          setShowIdPopup(true);
      } catch (error) {
        console.error("获取 Cookie 失败:", error);
      }
    };
    fetchUserData();
  }, []);
  const [data, setData] = useState(() => []);
  const [images, setImages] = useState(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    return Array.from({ length: 8 }, (_, index) => ({
      id: `bio00${index + 1}`,
      src: `bio_0${index + 1}.png`,
      // src: `bio_${index + 1}.svg`,
      x: Math.random() * screenWidth,
      y: Math.random() * screenHeight,
      z: Math.random() * (998 - 1) + 1,
      scale: Math.random() * (0.15 - 0.01) + 0.01, //0.01~0.15
      speedX: Math.random() * 1.5,
      speedY: Math.random() * 1.5,
      speedZ: Math.random() * 1.5,
      directionX: getNumber(1),
      directionY: getNumber(1),
      directionZ: getNumber(1),
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 0.7,
      info: {
        name: `菌種名稱 ${index + 1}`,
        keeper: `培養員 ${index + 1}`,
        birthdate: `2025-0${index + 1}-01`,
        rank: `排名 ${index + 1}`,
      },
    }));
  }, [data]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/get_all_bio`,
          {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight
          });
        if (response.data) {
          setData(response.data.bios); // 存入 state
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    console.log("Data 已更新:", data);
    setImages(data)
  }, [data]);

  const animationFrameIdRef = useRef(null);
  useEffect(() => {
    let animationFrameId;

    const updatePositions = () => {
      setImages((prevImages) =>
        prevImages.map((image) => {
          let newX = image.x + image.speedX * image.directionX;
          let newY = image.y + image.speedY * image.directionY;
          let newZ = image.z + image.speedZ * image.directionZ;
          let newRotation = (image.rotation + image.rotationSpeed) % 360;
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          // 邊界檢測，避免圖片超出視窗範圍
          if (newX > screenWidth*1.5 || newX < -screenWidth*0.5) {
            image.directionX = -image.directionX;
          }
          
          if (newY > screenHeight*1.5 || newY < -screenHeight*0.5) {
            image.directionY = -image.directionY;
          }
          if (newZ < 2 || newZ > 998) { // 限制 Z 軸範圍，防止過遠或過近
            image.directionZ = -image.directionZ;
          }
          // 根據 Z 軸距離計算縮放比例
          let scale = 0.01 + (0.15 - 0.01) * (1 - newZ / 1000)

          return { ...image, x: newX, y: newY, z: newZ, rotation: newRotation, scale };
        })
      );

      animationFrameIdRef.current = requestAnimationFrame(updatePositions);
    };

    animationFrameIdRef.current = requestAnimationFrame(updatePositions);

    return () => cancelAnimationFrame(animationFrameIdRef.current);
  }, []);
  return (
    <div id="world_container">
      <Header images={["world_ul_btn.svg", "wall_btn.svg", "culture_btn.svg"]} />
      <div className="world_bio">
        {isImagesLoaded && images.map((image) => (
          <img
            key={image.id}
            src={`${image.src}?v=${timestamp}`}
            alt="菌種"
            className={image.id}
            style={{
              position: "absolute",
              left: `${image.x}px`,
              top: `${image.y}px`,
              transform: `rotate(${image.rotation}deg)`,
              width:`${image.scale *100}%`,
              zIndex: Math.floor(image.scale * 1000),
            }}
            onMouseEnter={(e) => {
              setHoveredImage({
                src: "information.svg",
                x: e.clientX + 15,
                y: e.clientY + 15,
                scale: 2, // 調整放大倍數
                name: image.info.name,
                owner: image.info.keeper,
                birthday: image.info.createdAt,
                rank: image.info.id,
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
    
        {/* 滑鼠懸停時顯示的圖片與資訊 */}
        {hoveredImage && (
          <div
            style={{
              position: "absolute",
              left: `${hoveredImage.x}px`,
              top: `${hoveredImage.y}px`,
              transform: `scale(${hoveredImage.scale})`,
              pointerEvents: "none",
              zIndex: 10000,
            }}
          >
            {/* 外層容器 (包含圖片和資訊) */}
            <div
              style={{
                position: "relative",
                display: "inline-block",
              }}
            >
              {/* 菌種圖片 */}
              <img
                src={hoveredImage.src}
                alt="hover"
                style={{
                  width: "140px",
                  height: "140px",
                  transition: "transform 0.1s ease-out",
                }}
              />

              {/* 文字資訊 (覆蓋在圖片中央) */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  // color: "rgb(216, 165, 223)",
                  padding: "20px",
                  borderRadius: "10px",
                  width: "150px",
                }}
                className="world-bio-text"
              >

                {/* 菌種名稱 (標題) */}
                <div
                  style={{
                    fontSize: "10px", // 放大字體
                    fontWeight: "bold",
                    //letterSpacing: "1px", // 增加字距
                    marginBottom: "2px", // 與分隔線的間距
                    paddingBottom: "2px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.5)", // 加入分隔線
                  }}
                >
                  {hoveredImage.name}
                </div>

                {/* 菌種資訊 */}
                <div style={{ fontSize: "8px", lineHeight: "1.8", textAlign: "left" }}>
                  <div>培養員：{hoveredImage.owner}</div>
                  <div>菌種誕生日：{hoveredImage.birthday}</div>
                  <div>菌種排名：{hoveredImage.rank}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ID 提示視窗 */}
        {showIdPopup && (
          <div className="id-popup">
            <div className="id-popup-content">
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
