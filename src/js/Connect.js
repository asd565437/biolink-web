import "../css/Connect.css"; // 引入样式文件
import { useNavigate } from 'react-router-dom';
import React, {useState,useContext,useEffect } from 'react';
import Header from "./Header.js";
import connect_title from '../connect/connect_title.svg';
import connect_finish from '../connect/connect_finish.svg';
import connect_finish_small from '../connect/connect_finish_small.svg';
import { UserContext } from "../App"; // 引入全局 Socket 上下文
const Connect = () => {
  const navigate = useNavigate();
  const userId = useContext(UserContext); // 使用全局 socket
  const [friendId, setFriendId] = useState('');
  const [imgSrc, setImgSrc] = useState(window.innerWidth >= 600 ? connect_finish : connect_finish_small);
  const handleInputChange = (e) => {
    setFriendId(e.target.value);
  };
  useEffect(() => {
    const handleResize = () => {
      const newSrc = window.innerWidth >= 600 ? connect_finish : connect_finish_small;
      setImgSrc(newSrc);
    };

    // 一開始就判斷一次（以防手機預設載入錯誤）
    handleResize();

    // 加入 resize 監聽
    window.addEventListener('resize', handleResize);

    // 離開時移除監聽
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = () => {
    if (friendId.trim()) {
      if(userId.userId==friendId)
      {
        alert('不可以邀請自己喔！');
      }
      else
      {
        navigate('/confirm', { state: { friendId }});
      }
    } else {
      alert('請輸入好友 ID！');
    }
  };

  return (
    <div className="connect">
      {/* Header 组件 */}
      <Header images={['world_btn.svg', 'wall_btn.svg', 'culture_ul_btn.svg']} />
      {/* Content 部分 */}
      <main className="content">
        <p className="connect_title fontType">請輸入想要共同完成關卡的好友ID</p>

        <input
          type="text"
          value={friendId}
          onChange={handleInputChange}
          // placeholder="輸入好友ID"
          className="friend-input fontType"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
        }}
        />

        <img src={imgSrc} alt="connect_finish" className="connect_finish" onClick={handleSubmit} />
      </main>
    </div>
  );
};

export default Connect;
