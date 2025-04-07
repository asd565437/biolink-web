import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Friend.css"; // 引入样式文件
import Header from "./Header.js";
import AddFriend from "./AddFriend.js";
import addFriend_icon from '../friend_list/addFriend_icon.svg';
import friend_list from '../friend_list/friend_list.svg';
import friend_test from '../confirm/confirm_photo.svg';
import next_icon from '../question/back_btn.svg';
import axios from 'axios';
import { UserContext } from "../App"; // 引入全域 Socket 上下文
const apiUrl = process.env.REACT_APP_API_URL;
const Friend = () => {
  const [isImagesLoaded, setIsImagesLoaded] = useState(false); // 图片加载状态
  const friend_images = Array.from({ length: 6 }, (_, index) => `/friend_box.png`);
  // const friend_images = Array.from({ length: 6 }, (_, index) => `/friend_${index + 1}.png`);
  const [showPopup, setShowPopup] = useState(false);
  const { userId, setUserId } = useContext(UserContext);
  const [index, setIndex] = useState(0);
  const [friendList, setFriendList] = useState([]); // 存放所有好友資訊
  const [page, setPage] = useState(0);
  const itemsPerPage = 6; // 每頁顯示的卡片數量
  const handleWorld = () => navigate('/world');
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/get-cookie`, { withCredentials: true });
        if (response.data?.id) {
          setUserId(response.data.id);
        } else {
          console.error("未获取到用户 ID");
          alert("你還沒登入！！")
          handleWorld();
        }
      } catch (error) {
        console.error("获取 Cookie 失败:", error);
      }
    };
    fetchUserData();
  }, []);


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
    });
  }, [friend_images]);

  const loadData = async () => {
    try {
      console.log("Fetching friends for userId:", userId);
      const response = await axios.post(`${apiUrl}/api/friend`, { userId,index });
      console.log(response.data)
      setPage(Math.floor((response.data.count) /itemsPerPage));
      console.log(page)
      const friendData = response.data.newUInfo.map((friend, index) => ({
        nickname: friend.nickname,
        bio_count: friend.bio_count,
        createdAt: response.data.newFInfo[index]?.createdAt || "未知日期",
        photoURL: friend.photoURL || friend_test, // 頭像
      }));

      setFriendList(friendData); // 更新好友列表
      console.log("Fetched friends:", friendData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    if (!userId) return; // 🔥 确保 userId 存在才执行 API 请求
    loadData();
  }, [userId]); // 🔥 确保 userId 有值后再执行
  useEffect(() => {
    loadData();
    console.log("index");
  }, [index]);

  const friend_styles = {
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)', // 每行两列
      rowGap: '10px',
      columnGap: '60px',
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
      // scale: '0.9',
    },
  };

  const navigate = useNavigate();

  const handleNavigate = () => {
    setShowPopup(true); // 點擊圖片時顯示彈窗
  };
  const handleIndex = (count) => {
    if (count === 0) {
      if (index > 0)
        setIndex(index - 1);
    }
    else {
      if (index < page)
        setIndex(index + 1);
    }
    console.log(index);
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
      <main className="friend-content">
        {isImagesLoaded ? (
          <div className="friend" style={friend_styles.gridContainer}>
            {friendList.map((friend, index) => (
              <div className="friend" key={index} style={friend_styles.gridItem}>
                {/* 顯示對應的 friend_images */}
                <img src={friend_images[index % friend_images.length]} alt={`Friend ${index + 1}`} style={friend_styles.image} />

                {/* 顯示每個好友的資訊 */}
                <div className="friend-info">
                  <img src={friend.photoURL} alt={`Friend ${index + 1}`} className="friend_test" />
                  <h3 className="friend-info-name">{friend.nickname}</h3>
                  <p className="friend-info-numabr">菌種數量：{friend.bio_count}</p>
                  <p className="friend-info-date">交友日期：{friend.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>加载中...</p>
        )}
      </main>

      {/* Back_page */}
      {index > page && (
      <div className="back_page">
        <img
          src={next_icon}
          alt="切到上一頁"
          onClick={() => handleIndex(0)} // 點擊才執行
        />
      </div>)}
      {/* Next_page */}
      {index < page && (
        <div className="next_page">
          <img
            src={next_icon}
            alt="切到下一頁"
            onClick={() => handleIndex(1)}
            
          />
        </div>
      )}


      {/* Footer */}
      <div className="footer">
        <img src={addFriend_icon} alt="加入好友" onClick={handleNavigate} />
      </div>

      {showPopup && <AddFriend onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Friend;
