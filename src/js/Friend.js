import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Friend.css"; // 引入样式文件
import Header from "./Header.js";
import AddFriend from "./AddFriend.js";
import addFriend_icon from '../friend_list/addFriend_icon.svg';
import friend_list from '../friend_list/friend_list.svg';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
const Friend = () => {
  const [isImagesLoaded, setIsImagesLoaded] = useState(false); // 图片加载状态
  const friend_images = Array.from({ length: 6 }, (_, index) => `/friend_${index + 1}.png`);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // 预加载图片
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

    preloadImages(friend_images).then(() => {
      setIsImagesLoaded(true); // 标记图片已加载
      console.log('Friend 页面图片预加载完成');
    });
  }, [friend_images]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/friend`);
        console.log('Fetched data:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    loadData();
  }, []);

  const friend_styles = {
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', // 每行两列
      columnGap: '35px',
      justifyContent: 'center', // 水平居中
      alignItems: 'center', // 垂直居中
      position: 'relative',
      zIndex: 1,
    },
    gridItem: {
      objectFit: 'contain',
      overflow: 'visible',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      scale: '0.9',
    },
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    setShowPopup(true); // 點擊圖片時顯示彈窗
  };

  return (
    <div className="friend_wall">
      {/* Header 组件 */}
      <Header
        images={['world_btn.svg', 'wall_ul_btn.svg', 'culture_btn.svg']}
      />

      <div className="friend_list_lab">
        <img src={friend_list} alt="Friend List Label" />
      </div>

      {/* Content 部分 */}
      <main className="content">
        {isImagesLoaded ? ( // 检查图片是否预加载完成
          <div className="friend" style={friend_styles.gridContainer}>
            {friend_images.map((image, index) => (
              <div className="friend" key={index} style={friend_styles.gridItem}>
                <img src={image} alt={`Bio ${index + 1}`} style={friend_styles.image} />
              </div>
            ))}
          </div>
        ) : (
          <p>加载中...</p> // 显示加载提示
        )}
      </main>

      {/* Footer */}
      <div className="footer">
        <img src={addFriend_icon} alt="加入好友" onClick={handleNavigate} />
      </div>

      {showPopup && <AddFriend onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Friend;
