import "../css/AddFriend.css"; // 引入样式文件
import { useNavigate } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import ConfirmFriend from "./ConfirmFriend.js";
import addFriend_back from '../addFriend/addFriend_back.svg';
import addFriend_box from '../addFriend/addFriend_box.png';
import addFriend_finish from '../addFriend/addFriend_finish.png';
import { UserContext } from "../App"; // 引入全局 Socket 上下文

const AddFriend = ({ onClose }) => {
    const navigate = useNavigate();
    const userId = useContext(UserContext); // 使用全局 socket
    const [friendId, setFriendId] = useState("");
    const [showConfirmFriend, setShowConfirmFriend] = useState(false);

    const handleInputChange = (e) => {
        setFriendId(e.target.value);
    };

    const handleSubmit = () => {
        if (friendId.trim()) {
            if (userId.userId == friendId)
                alert('不可以邀請自己喔！');
            else
                setShowConfirmFriend(true);// 顯示確認好友介面
        } else {
            alert('請輸入好友 ID！');
        }
    };

    const handleBack = () => {
        setShowConfirmFriend(false); // 返回輸入ID畫面
    };

    return (
        <div className="addFriend">
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                {!showConfirmFriend ? (
                    <>
                        <img src={addFriend_back} alt="addFriend_back" className="addFriend_back" onClick={onClose} />
                        <img src={addFriend_box} alt="addFriend_box" className="addFriend_box" />
                        <input
                            type="text"
                            placeholder="輸入好友ID"
                            className="addFriend_input"
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSubmit();
                            }}
                        />
                        <img
                            src={addFriend_finish}
                            alt="輸入完成"
                            className="addFriend_finish"
                            onClick={handleSubmit}
                        />
                    </>
                ) : (
                    <ConfirmFriend friendId={friendId} onClose={onClose} onBack={handleBack} />
                )}
            </div>
        </div>
    );
};

export default AddFriend;
