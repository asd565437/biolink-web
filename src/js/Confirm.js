import "../css/Confirm.css"; 
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header.js";
import confirm_title from '../confirm/confirm_title.svg';
import confirm_back from '../confirm/confirm_back.svg';
import confirm_test from '../confirm/confirm_test.svg';
import confirm_start from '../confirm/confirm_start.svg';
import axios from "axios";
import { io } from "socket.io-client";
const apiUrl = process.env.REACT_APP_API_URL;

const Confirm = () => {
    const [userId, setUserId] = useState("0507"); // 初始化 userId
    const location = useLocation();
    const friendId = location.state?.friendId || "未知用户"; // 避免 state 为空时报错
    const [invitations, setInvitations] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCookie = async () => {
          try {
            const response = await axios.get(`${apiUrl}/get-cookie`, {
              withCredentials: true,
            });
            console.log(response.data.account)
            console.log(response.data.id)
            setUserId(response.data.id)
          } catch (error) {
            console.error("獲取 Cookie 失敗:", error);
          }
        };
        fetchCookie();
      }, []);
    useEffect(() => {
        console.log("创建 Socket.IO 连接...");
        const socket = io("https://biolink-zsl3.onrender.com");

        socket.on("connect", () => {
            console.log("Socket.IO 连接成功");
            socket.emit("register", userId);
        });

        socket.on("invite", (data) => {
            console.log(`收到邀请: ${data.from} -> ${data.to}`);
            setInvitations((prev) => [...prev, data.from]);
        });

        return () => {
            console.log("断开 Socket.IO 连接");
            socket.disconnect();
        };
    }, [friendId]); 

    // 发送好友邀请
    const sendInvite = (toUserId) => {
        console.log(`发送邀请给 ${toUserId}`);
        const socket = io("https://biolink-zsl3.onrender.com");
        socket.emit("invite", { from: userId, to: toUserId });
    };

    return (
        <div className="confirm">
            <Header images={['world_btn.svg', 'wall_btn.svg', 'culture_ul_btn.svg']} />
            <main className="content">
                <img src={confirm_back} alt="confirm_back" className="confirm_back" onClick={() => navigate(-1)} />
                <img src={confirm_title} alt="confirm_title" className="confirm_title" />
                <img src={confirm_test} alt="confirm_test" className="confirm_test" />
                <img src={confirm_start} alt="confirm_start" className="confirm_start" onClick={() => sendInvite(friendId)} />
                <h3>收到的好友邀请：</h3>
                {invitations.length > 0 ? invitations.map((invite, index) => (
                    <p key={index}>{invite} 邀请了你</p>
                )) : <p>暂无邀请</p>}
            </main>
        </div>
    );
};

export default Confirm;
