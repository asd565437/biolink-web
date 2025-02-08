import "../css/Connect.css"; // 引入样式文件
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Header from "./Header.js";
import connect_title from '../connect/connect_title.svg';
import connect_finish from '../connect/connect_finish.svg';

const Connect = () => {
  const navigate = useNavigate();

  const [friendId, setFriendId] = useState('');

  const handleInputChange = (e) => {
    setFriendId(e.target.value);
  };

  const handleSubmit = () => {
    if (friendId.trim()) {
      navigate('/confirm', { state: { friendId }});
      // alert(`好友 ID 為：${friendId}`);
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
