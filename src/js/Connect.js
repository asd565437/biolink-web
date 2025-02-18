import "../css/Connect.css"; // 引入样式文件
import { useNavigate } from 'react-router-dom';
import React, {useState,useContext } from 'react';
import Header from "./Header.js";
import connect_title from '../connect/connect_title.svg';
import connect_finish from '../connect/connect_finish.svg';
import { UserContext } from "../App"; // 引入全局 Socket 上下文
const Connect = () => {
  const navigate = useNavigate();
  const userId = useContext(UserContext); // 使用全局 socket
  const [friendId, setFriendId] = useState('');
  const handleInputChange = (e) => {
    setFriendId(e.target.value);
  };

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
        <img src={connect_title} alt="connect_title" className="connect_title" />

        <input
          type="text"
          value={friendId}
          onChange={handleInputChange}
          // placeholder="輸入好友 ID"
          className="friend-input"
        />

        <img src={connect_finish} alt="connect_finish" className="connect_finish" onClick={handleSubmit} />
      </main>
    </div>
  );
};

export default Connect;
