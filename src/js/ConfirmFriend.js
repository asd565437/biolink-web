import "../css/ConfirmFriend.css"; // 引入样式文件
import { useNavigate, useLocation } from "react-router-dom";
import confirmFriend_back from "../confirmFriend/confirmFriend_back.svg";
import confirmFriend_box from "../confirmFriend/confirmFriend_box.png";
import confirmFriend_test from "../confirmFriend/confirmFriend_test.svg";
import confirmFriend_yes from "../confirmFriend/confirmFriend_yes.png";
import confirmFriend_no from "../confirmFriend/confirmFriend_no.png";
import { useEffect, useState, useRef } from "react";

const ConfirmFriend = ({ onClose, onBack }) => {
    const navigate = useNavigate();
    const userName = "菌男霉女"; // 先用固定Name，之后可改成动态获取
    const [invitations, setInvitations] = useState([]);
    const location = useLocation();
    const friendId = location.state?.friendId || "未知用户"; // 避免 state 为空时报错
    // 使用 useRef 来存储 WebSocket 实例，避免重复创建连接
    const ws = useRef(null);

    useEffect(() => {
        // 仅在组件首次挂载时创建 WebSocket 连接
        console.log("出")
        if (!ws.current) {
            ws.current = new WebSocket("wss://biolink-zsl3.onrender.com");

            ws.current.onopen = () => {
                console.log("WebSocket 连接成功");
                ws.current.send(JSON.stringify({ type: "register", userId: friendId }));
            };

            ws.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "invite") {
                    setInvitations((prev) => [...prev, data.from]);
                }
            };

            ws.current.onerror = (error) => {
                console.error("WebSocket 连接错误:", error);
            };

            ws.current.onclose = () => {
                console.log("WebSocket 连接关闭");
            };
        }

        // 组件卸载时关闭 WebSocket 连接
        return () => {
            if (ws.current) {
                ws.current.close();
                ws.current = null;
            }
        };
    }, []); // 依赖为空数组，确保 WebSocket 仅创建一次

    // 发送好友邀请
    const sendInvite = (toUserId) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: "invite", from: friendId, to: toUserId }));
            console.log(`已发送邀请给 ${toUserId}`);
        } else {
            console.error("WebSocket 连接未打开");
        }
    };

    return (
        <div className="confirmFriend">
            <div className="confirmFriend-content">
                <img
                    src={confirmFriend_back}
                    alt="confirmFriend_back"
                    className="confirmFriend_back"
                    onClick={onBack}
                />
                <img src={confirmFriend_box} alt="confirmFriend_box" className="confirmFriend_box" />
                <p className="confirmFriend_title">您确认将 {userName} 加入为好友吗？</p>
                <img src={confirmFriend_test} alt="confirmFriend_test" className="confirmFriend_test" />
                <img src={confirmFriend_yes} alt="confirmFriend_yes" className="confirmFriend_yes" onClick={onClose} />
                <img src={confirmFriend_no} alt="confirmFriend_no" className="confirmFriend_no" onClick={() => sendInvite(friendId)} />
            </div>
        </div>
    );
};

export default ConfirmFriend;
