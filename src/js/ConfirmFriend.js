import "../css/ConfirmFriend.css"; // 引入样式文件
import { useNavigate, useLocation } from 'react-router-dom';
import confirmFriend_back from '../confirmFriend/confirmFriend_back.svg';
import confirmFriend_box from '../confirmFriend/confirmFriend_box.png';
import confirmFriend_photo from '../confirm/confirm_photo.svg';
import confirmFriend_photo_box from "../confirm/confirm_photo_box.png";
import confirmFriend_yes from '../confirmFriend/confirmFriend_yes.png';
import confirmFriend_no from '../confirmFriend/confirmFriend_no.png';
import { useEffect, useState } from "react";

const ConfirmFriend = ({ onClose, onBack }) => {
    const navigate = useNavigate();
    const userName = "菌男霉女"; // 先用固定Name，之後可改成動態獲取
    const [invitations, setInvitations] = useState([]);
    const location = useLocation();
    const friendId = location.state?.friendId || "未知用户"; // 避免 state 为空时报错

    const handleInvite = () => {
        navigate('/invite');
    };

    return (
        <div className="confirmFriend">
            <div className="confirmFriend-content">
                <img src={confirmFriend_back} alt="confirmFriend_back" className="confirmFriend_back" onClick={onBack} />
                <img src={confirmFriend_box} alt="confirmFriend_box" className="confirmFriend_box" />
                <p className="confirmFriend_title">您確認將&nbsp;{userName}&nbsp;加入為好友嗎？</p>

                <div className="confirmFriend_photo_area">
                    <img src={confirmFriend_photo_box} alt="confirmFriend_photo_box" className="confirmFriend_photo_box" />
                    <img src={confirmFriend_photo} alt="confirmFriend_photo" className="confirmFriend_photo" /> {/* 存取玩家的頭像 */}
                </div>

                <img src={confirmFriend_yes} alt="confirmFriend_yes" className="confirmFriend_yes" onClick={onClose} />
                <img src={confirmFriend_no} alt="confirmFriend_no" className="confirmFriend_no" onClick={handleInvite} />
            </div>
        </div>
    );
};

export default ConfirmFriend;