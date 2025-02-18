import "../css/Confirm.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Header from "./Header.js";
import axios from "axios";
import confirm_title from "../confirm/confirm_title.svg";
import confirm_back from "../confirm/confirm_back.svg";
import confirm_test from "../confirm/confirm_test.svg";
import confirm_start from "../confirm/confirm_start.svg";
import { SocketContext, UserContext } from "../App"; // 引入全局 Socket 上下文
const apiUrl = process.env.REACT_APP_API_URL;

const Confirm = () => {
    const location = useLocation();
    const friendId = location.state?.friendId || "未知用户";
    const [invitations, setInvitations] = useState([]);
    const [photo, setPhoto] = useState(confirm_test);
    const navigate = useNavigate();
    const socket = useContext(SocketContext); // 使用全局 socket
    const userId = useContext(UserContext);
    useEffect(() => {
        const handleFriend = async () => {
            try {
                const response = await axios.post(`${apiUrl}/api/get-friend-info`, {
                    id: friendId,
                });
    
                console.log("收到的好友信息:", response.data); // ✅ 先打印数据看看
                const photoURL = response.data.player?.photoURL;
    
                if (photoURL) {
                    setPhoto(photoURL);
                    console.log("设置图片 URL:", photoURL);
                } else {
                    console.warn("没有找到好友图片，使用默认图片");
                    setPhoto(confirm_test);
                }
            } catch (error) {
                console.error("获取好友信息失败:", error);
                alert("请求失败：" + (error.response?.data?.error || error.message));
            }
        };
    
        handleFriend();
    }, [friendId]); // ✅ 只有 friendId 变化时才请求 API
    
    useEffect(() => {
        if (!socket || !userId.userId) return;
    
        console.log("注册 Socket.IO 用户:", userId.userId);
        socket.emit("invite-friend", userId.userId,friendId);
    
        const handleInvite = (data) => {
            console.log(`收到邀请: ${data.from} -> ${data.to}`);
            setInvitations((prev) => [...prev, data.from]);
        };
    
        socket.on("invited", handleInvite);
    
        return () => {
            console.log("卸载组件，移除 Socket 监听");
            socket.off("invite", handleInvite);
        };
    }, [socket, userId.userId]); // ✅ 只有 socket 连接成功后才监听事件
    

    return (
        <div className="confirm">
            <Header images={["world_btn.svg", "wall_btn.svg", "culture_ul_btn.svg"]} />
            <main className="content">
                <img src={confirm_back} alt="confirm_back" className="confirm_back" onClick={() => navigate(-1)} />
                <img src={confirm_title} alt="confirm_title" className="confirm_title" />
                <img src={photo} alt="confirm_test" className="confirm_test" />
                <img src={confirm_start} alt="confirm_start" className="confirm_start"  />
            </main>
        </div>
    );
};

export default Confirm;
