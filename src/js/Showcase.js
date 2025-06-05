import axios from 'axios';
import '../css/Showcase.css';
import Header from './Header.js';
import Card from '../showcase/card.png';
import Card_bg from '../showcase/card_bg.png';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import next_icon from '../question/back_btn.svg';
import friend_icon from '../showcase/friend_icon.png';
import score_bar from '../showcase/full_score_bar.png';
import { UserContext } from "../App"; // 引入全局 Socket 上下文
const apiUrl = process.env.REACT_APP_API_URL;
const Showcase = () => {
  const [timestamp] = useState(new Date().getTime());
  const handleWorld = () => navigate('/world');
  const [data, setData] = useState(() => [
    {
      imageURL: "/bio_1.png",
      name: "輸不起工作室",
      bio_id: "0002",
      createdAt: "25.02.25",
      nicknames: {
        "0001": "沈羿伶",
        "0008": "袁萱芳"
      },
      players: ["0008", "0001"],
      totalCorrect: 7
    }
  ]);

  // 目前頁面狀態
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8; // 每頁顯示的卡片數量


  // 計算當前頁面顯示的卡片
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);
  const currentItems = data.slice(startIndex, endIndex);
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [isOriginal, setIsOriginal] = useState(Array(data.length).fill(true));
  const [isImagesLoaded, setIsImagesLoaded] = useState(false); // 图片加载状态
  const userId = useContext(UserContext); // 使用全局 socket

  // 動態生成圖片陣列
  const images = data.map(() => Card);
  const bg_images = data.map(() => Card_bg);
  const bio_images = data.map((_, index) => `/bio_${index + 1}.png`);
  const bar_images = data.map(() => score_bar);
  const navigate = useNavigate();

  const addTestData = () => {
    const newData = { id: "0004", name: "新測試卡片", owner: "測試人員", date: "02.26.25" };
    setData((prev) => [...prev, newData]);
    setIsOriginal((prev) => [...prev, true]); // 新增 isOriginal 狀態
  };


  // 预加载所有图片
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

    const allImages = [...images, ...bg_images, ...bio_images, ...bar_images];
    preloadImages(allImages).then(() => {
      setIsImagesLoaded(true); // 所有图片加载完成
      console.log('所有图片预加载完成');
    });
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/bio`, { userId: userId.userId, index });
      console.log('Fetched data:', response.data);
      if (response.data) {
        setPage(Math.ceil(response.data.count / itemsPerPage));
        // setPage(Math.ceil(response.data.bios.length / itemsPerPage));
        setData(response.data.bios); // 存入 state
        setIsOriginal(Array(response.data.bios.length).fill(true)); // 根據數據長度初始化 isOriginal
      } else {
        console.error("未获取到用户 ID");
        alert("你還沒登入！！")
        handleWorld();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // 請求後端數據
  useEffect(() => {
    loadData();
  }, [userId.userId]);
  useEffect(() => {
    loadData();
    console.log("index " + index);
    console.log("page " + page);
  }, [index, page]);
  useEffect(() => {
    console.log("Data 已更新:", data);

  }, [data]); // 當 data 更新時觸發

  // 切换图片状态
  const handleToggle = (index) => {
    setIsOriginal((prev) =>
      prev.map((item, i) => (i === index ? !item : item))
    );
  };


  // 跳转到 Friend 页面
  const handleFriend = () => navigate('/friend');
  const handleIndex = (count) => {
    if (count === 0) {
      if (index > 0)
        setIndex(index - 1);
    }
    else {
      if (index < page - 1)
        setIndex(index + 1);
    }
    console.log(index);
  };


  // 样式保持不变
  const pair_styles = {
    card: {
      position: 'relative',
      width: '80%',
      height: '80%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      borderRadius: "20px",
    },
    cardImage: {
      width: '100%',
      height: '100%',
      zIndex: 1,
    },
    bio: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -65%)',
      width: '226px',
      height: '226px',
      overflow: 'hidden',
      zIndex: 2,
      cursor: 'pointer',
    },
    bioImage: {
      width: '80%',
      height: '80%',
      objectFit: 'contain',
    },
    bar: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -65%)',
      width: '90%',
      height: 'auto',
      overflow: 'hidden',
      zIndex: 2,
      cursor: 'pointer',
    },
    barImage: {
      width: 'auto',
      height: 'auto',
    },
  };

  function getBorderClass(totalCorrect) {
    const score = Math.floor(totalCorrect / 2); // 0~5 中的一個
    if (score <= 1) return 'bioBorder-blue';
    if (score <= 3) return 'bioBorder-green';
    return 'bioBorder-red';
  }

  return (
    <div className="showcase">
      {/* Header */}
      <Header
        images={['world_btn.svg', 'wall_ul_btn.svg', 'culture_btn.svg']}
      />

      {/* 内容部分 固定版本*/}
      <main className="showcase-content">
        {isImagesLoaded ? ( // 检查是否完成预加载
          <div className='pair_styles.container'>
            <div className='row row-showcase g-4' >
              {images.map((cardImage, index) => (
                <div
                  key={index}
                  className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center"
                >
                  <div
                    className='card-container'
                    onClick={() => handleToggle(index)}
                    style={pair_styles.card}
                  >
                    {/* 卡片資訊 */}
                    {isOriginal[index] && (
                      <div className="card-info fontType">
                        <p className='card-info-id'>#{data[index].bio_id}</p>
                        <div className='name_box'>
                          <h6 className='card-info-name'>{data[index].name}</h6>
                        </div>
                        <p className='card-info-owner'>培養員:{data[index].nicknames[data[index].players[0]]}
                          &{data[index].nicknames[data[index].players[1]]} </p>
                        <p className='card-info-date'>{data[index].createdAt}</p>
                      </div>
                    )}
                    {/* Card 或背景图片 */}
                    <img
                      src={isOriginal[index] ? cardImage : bg_images[index]}
                      alt={`Card ${index + 1}`}
                      className='img-fluid'
                      style={pair_styles.cardImage}
                    />
                    {/* 正面 Bio 圖片 */}
                    {isOriginal[index] && data[index].imageURL && (
                      <div style={pair_styles.bio}>
                        <img
                          src={`${data[index].imageURL}?v=${timestamp}`}
                          alt={`Bio ${index + 1}`}
                          // className="img-fluid bioBorder"
                          className={`img-fluid bioBorder ${getBorderClass(data[index].totalCorrect)}`}
                          style={pair_styles.bioImage}
                        />
                      </div>
                    )}
                    {/* 背面 Bio 圖片 */}
                    {!isOriginal[index] && data[index].imageURL && (
                      <div className="overlay-image">
                        <img
                          src={data[index].imageURL}
                          alt={`Bio ${index + 1}`}
                        />
                      </div>
                    )}
                    {/* 能量条 */}
                    {!isOriginal[index] && bar_images[index] && (
                      <div className="overlay-image2" alt={`Bar ${index + 1}`} style={{ width: `${data[index].totalCorrect / 10 * 165}px` }}>

                        {/*<img
                          src={bar_images[index]}
                          alt={`Bar ${index + 1}`}
                        />*/}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>加载中...</p>
        )}
      </main>

      {/* Back_page */}
      {index > 0  && (
        <div className="back_page">
          <img
            src={next_icon}
            alt="切到上一頁"
            onClick={() => handleIndex(0)} // 點擊才執行
          />
        </div>)}

      {/* Next_page */}
      {index < page-1 && (
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
        <img
          src={friend_icon}
          alt="跳转到 Friend 页面"
          onClick={handleFriend}
        />
      </div>
    </div>

  );
};

export default Showcase;
