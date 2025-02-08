import "../css/ConfirmFriend.css"; // 引入样式文件
import { useNavigate,useLocation } from 'react-router-dom';
import confirmFriend_back from '../confirmFriend/confirmFriend_back.svg';
import confirmFriend_test from '../confirmFriend/confirmFriend_test.svg';
import confirmFriend_add from '../confirmFriend/confirmFriend_add.svg';
import { useEffect, useState } from "react";

const ws = new WebSocket("ws://localhost:8080");

const ConfirmFriend = ({  onClose, onBack }) => {
    const navigate = useNavigate();
    const [invitations, setInvitations] = useState([]);
    const location = useLocation();
    const friendId = location.state?.friendId || "未知用户"; // 避免 state 为空时报错
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
                <img src={confirmFriend_test} alt="confirmFriend_test" className="confirmFriend_test" />
                <img
                    src={confirmFriend_add}
                    alt="確認加入"
                    className="confirmFriend_add"
                    onClick={onClose} // 點擊後關閉視窗
                />
            </div>
        </div>
    );
};

export default ConfirmFriend;