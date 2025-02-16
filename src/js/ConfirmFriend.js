import "../css/ConfirmFriend.css"; // 引入样式文件
import { useNavigate,useLocation } from 'react-router-dom';
import confirmFriend_back from '../confirmFriend/confirmFriend_back.svg';
import confirmFriend_box from '../confirmFriend/confirmFriend_box.png';
import confirmFriend_test from '../confirmFriend/confirmFriend_test.svg';
import confirmFriend_yes from '../confirmFriend/confirmFriend_yes.png';
import confirmFriend_no from '../confirmFriend/confirmFriend_no.png';
import { useEffect, useState } from "react";

const ws = new WebSocket("ws://localhost:8080");

const ConfirmFriend = ({  onClose, onBack }) => {
    const navigate = useNavigate();
    const userName = "菌男霉女"; // 先用固定Name，之後可改成動態獲取
    const [invitations, setInvitations] = useState([]);
    const location = useLocation();
    const friendId = location.state?.friendId || "未知用户"; // 避免 state 为空时报错

    const handleInvite = () => {
        navigate('/invite');
    };

    useEffect(() => {
        // 连接 WebSocket 并注册用户
        console.log(friendId)
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "register", friendId }));
        };

        // 监听邀请消息
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "invite") {
                setInvitations((prev) => [...prev, data.from]);
            }
        };

        return () => {
            ws.close();
        };
    }, [friendId]);

    const sendInvite = (toUserId) => {
        ws.send(JSON.stringify({ type: "invite", from: friendId, to: friendId }));
    };
    return (
        <div className="confirmFriend">
            <div className="confirmFriend-content">
                <img src={confirmFriend_back} alt="confirmFriend_back" className="confirmFriend_back" onClick={onBack} />
                <img src={confirmFriend_box} alt="confirmFriend_box" className="confirmFriend_box" />
                <p className="confirmFriend_title">您確認將 {userName} 加入為好友嗎？</p>
                <img src={confirmFriend_test} alt="confirmFriend_test" className="confirmFriend_test" />
                <img src={confirmFriend_yes} alt="confirmFriend_yes" className="confirmFriend_yes" onClick={onClose} />
                <img src={confirmFriend_no} alt="confirmFriend_no" className="confirmFriend_no" onClick={handleInvite} />
            </div>
        </div>
    );
};

export default ConfirmFriend;