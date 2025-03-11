import axios from 'axios';
import '../css/Showcase.css';
import Header from './Header.js';
import Card from '../showcase/card.png';
import Card_bg from '../showcase/card_bg.png';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import friend_icon from '../showcase/friend_icon.png';
import score_bar from '../showcase/full_score_bar.png';
import { UserContext } from "../App"; // 引入全局 Socket 上下文
const apiUrl = process.env.REACT_APP_API_URL;
const Showcase = () => {
  const [timestamp] = useState(new Date().getTime());
  // 手動輸入兩筆測試資料
  const [data, setData] = useState(() => [
    {
      imageURL:"/bio_1.png",
      name:"輸不起工作室",
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
  
  const [isOriginal, setIsOriginal] = useState(Array(data.length).fill(true));

  // const [data, setData] = useState([]); // 存放後端返回的卡片數據
  // const [isOriginal, setIsOriginal] = useState([]); // 每張卡片的狀態
  // const [isOriginal, setIsOriginal] = useState(Array(8).fill(true));
  const [isImagesLoaded, setIsImagesLoaded] = useState(false); // 图片加载状态
  const userId = useContext(UserContext); // 使用全局 socket

  // 動態生成圖片陣列
  const images = data.map(() => Card);
  const bg_images = data.map(() => Card_bg);
  const bio_images = data.map((_, index) => `/bio_${index + 1}.png`);
  const bar_images = data.map(() => score_bar);


  // 图片数组
  // const images = Array.from({ length: 8 }, () => Card);
  // const bg_images = Array.from({ length: 8 }, () => Card_bg);
  // const bio_images = Array.from({ length: 8 }, (_, index) => `/bio_${index + 1}.png`);
  // const bar_images = Array.from({ length: 8 }, () => score_bar);

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

  // 加载数据
  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       const response = await axios.post(`${apiUrl}/api/bio`, { userId :userId.userId });
  //       console.log('Fetched data:', response.data);
  //       return response.data;
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   }
  //   loadData();
  // }, []);

 // 請求後端數據
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/bio`, { userId: userId.userId });
        console.log('Fetched data:', response.data);

        if (response.data) {
          setData(response.data.bios); // 存入 state
          setIsOriginal(Array(response.data.bios.length).fill(true)); // 根據數據長度初始化 isOriginal
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    loadData();
  }, [userId.userId]);
  useEffect(() => {
    console.log("Data 已更新:", data);
  }, [data]); // 當 data 更新時觸發

  // 切换图片状态
  const handleToggle = (index) => {
    setIsOriginal((prev) =>
      prev.map((item, i) => (i === index ? !item : item))
    );
  };

  const navigate = useNavigate();

  // 跳转到 Friend 页面
  const handleFriend = () => navigate('/friend');


  // 样式保持不变
  const pair_styles = {
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      rowGap: '10px',
      columnGap: '35px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      position: 'relative',
      width: '100%',
      minWidth: '400px',
      height: '400px',
      marginTop: '45px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      borderRadius: "20px",
    },
    cardImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
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
      width: '100%',
      height: '100%',
      objectFit: 'cover',
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

  return (
    <div className="showcase">
      {/* Header */}
      <Header
        images={['world_btn.svg', 'wall_ul_btn.svg', 'culture_btn.svg']}
      />

      {/* 内容部分 固定版本*/}
      {/* <main className="showcase-content">
        {isImagesLoaded ? (
          <div className="pair_styles.container">
            <div className="row row-showcase g-0">
              {data.map((item, index) => (
                <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                  <div className="card-container" onClick={() => handleToggle(index)} style={pair_styles.card}>
                    {isOriginal[index] && (
                      <div className="card-info">
                        <p className="card-info-id">#{item.id}</p>
                        <div className="name_box">
                          <h6 className="card-info-name">{item.name}</h6>
                        </div>
                        <p className="card-info-owner">培養員: {item.owner}</p>
                        <p className="card-info-date">{item.date}</p>
                      </div>
                    )}
                    <img src={isOriginal[index] ? images[index] : bg_images[index]} alt={`Card ${index + 1}`} className="img-fluid" style={pair_styles.cardImage} />
                    {isOriginal[index] && bio_images[index] && (
                      <div style={pair_styles.bio}>
                        <img src={bio_images[index]} alt={`Bio ${index + 1}`} className="img-fluid" style={pair_styles.bioImage} />
                      </div>
                    )}
                    {!isOriginal[index] && bar_images[index] && (
                      <div className="overlay-image2">
                        <img src={bar_images[index]} alt={`Bar ${index + 1}`} className="img-fluid" />
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
      </main> */}

      {/* 内容部分 固定版本*/}
      <main className="showcase-content">
        {isImagesLoaded ? ( // 检查是否完成预加载
          <div className='pair_styles.container'>
            <div className='row row-showcase g-0' >
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
                      <div className="card-info">
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
                          className="img-fluid"
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
                          className="img-fluid"
                        />
                      </div>
                    )}
                    {/* 能量条 */}
                    {!isOriginal[index] && bar_images[index] && (
                      <div className="overlay-image2">
                        <img
                          src={bar_images[index]}
                          alt={`Bar ${index + 1}`}
                          className="img-fluid"
                        />
                        {/* <img 
                          src={bar_images[index]}
                          alt={`Bar ${index + 1}`}
                          className="img-fluid"
                          style={{ marginTop: '11%' }}
                        /> */}
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
