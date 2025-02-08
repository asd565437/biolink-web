import "../css/AddFriend.css"; // 引入样式文件
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import ConfirmFriend from "./ConfirmFriend.js";
import addFriend_title from '../addFriend/addFriend_title.svg';
import addFriend_finish from '../addFriend/addFriend_finish.svg';


const AddFriend = ({ onClose }) => {
    const navigate = useNavigate();

    const [friendId, setFriendId] = useState("");
    const [showConfirmFriend, setShowConfirmFriend] = useState(false);

    const handleInputChange = (e) => {
        setFriendId(e.target.value);
    };

    const handleSubmit = () => {
        if (friendId.trim()) {
            setShowConfirmFriend(true);// 顯示確認好友介面
        } else {
            alert('請輸入好友 ID！');
        }
    };

    const handleBack = () => {
        setShowConfirmFriend(false); // 返回輸入ID畫面
    };

    return (
        <div className="addFriend" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                {/* <img src={addFriend_title} alt="好友標題" className="addFriend_title" />
                <input type="text" placeholder="" className="addFriend_input" onChange={handleInputChange} />
                <img src={addFriend_finish} alt="輸入完成" className="addFriend_finish" onClick={handleSubmit} /> */}

                {!showConfirmFriend ? (
                    <>
                        <img src={addFriend_title} alt="好友標題" className="addFriend_title" />
                        <input
                            type="text"
                            placeholder=""
                            className="addFriend_input"
                            onChange={handleInputChange}
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
