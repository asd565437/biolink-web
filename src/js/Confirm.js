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
    useEffect(()=>{
        const handleFriend = async () => {
            try {
                const response = await axios.post(`${apiUrl}/api/get-friend-info`, {
                    id: friendId,
                });
                setPhoto(response.data.player.photoURL)
                console.log(photo);
            } catch (error) {
                if (error.response) {
                    // 服务器返回错误
                    alert("邀請失敗：" + error.response.data.error);
                    console.error("响应错误:", error.response.data);
                } else {
                    // 网络错误或其他问题
                    alert("请求失败：" + error.message);
                    console.error("请求失败:", error);
                }
            }            
        };
        handleFriend();
    })
    useEffect(() => {
        if (!socket) return;
        socket.on("invite", (data) => {
            console.log(`收到邀请: ${data.from} -> ${data.to}`);
            setInvitations((prev) => [...prev, data.from]);
        });

        return () => {
            socket.off("invite");
        };
    }, [socket]);

    useEffect(() => {
        sendInvite(friendId);
    }, [socket]);

    const sendInvite = (toUserId) => {
        if (!socket) {
            console.error("Socket.IO 未连接，无法发送邀请");
            return;
        }
        console.log(`发送邀请给 ${toUserId}`);
        socket.emit("invite", { from: userId.userId, to: toUserId });
    };

    return (
        <div className="confirm">
            <Header images={["world_btn.svg", "wall_btn.svg", "culture_ul_btn.svg"]} />
            <main className="content">
                <img src={confirm_back} alt="confirm_back" className="confirm_back" onClick={() => navigate(-1)} />
                <img src={confirm_title} alt="confirm_title" className="confirm_title" />
                <img src={photo} alt="confirm_test" className="confirm_test" />
                <img src={confirm_start} alt="confirm_start" className="confirm_start"  />
                <h3>收到的好友邀请：</h3>
                {invitations.length > 0 ? invitations.map((invite, index) => (
                    <p key={index}>{invite} 邀請了你</p>
                )) : <p>邀请</p>}
            </main>
        </div>
    );
};

export default Confirm;
