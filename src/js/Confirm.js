import "../css/Confirm.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Header from "./Header.js";
import axios from "axios";
import confirm_back from "../confirm/confirm_back.svg";
import confirm_test from "../confirm/confirm_test.svg";
//import confirm_photo from "../confirm/confirm_photo.svg";
import confirm_photo from "../confirm/joguman.svg";
import confirm_photo_box from "../confirm/confirm_photo_box.svg";
import confirm_start from "../confirm/confirm_start.svg";
import { SocketContext, UserContext } from "../App"; // 引入全域 Socket 上下文
const apiUrl = process.env.REACT_APP_API_URL;

const Confirm = () => {
    const location = useLocation();
    const friendId = location.state?.friendId || "未知用戶";
    const [invitations, setInvitations] = useState([]);
    const [photo, setPhoto] = useState(confirm_test);
    const [userName, setuserName] = useState("菌男霉女");
    const navigate = useNavigate();
    const socket = useContext(SocketContext); // 使用全域 socket
    const userId = useContext(UserContext);

    useEffect(() => {
        const handleFriend = async () => {
            try {
                const response = await axios.post(`${apiUrl}/api/get-friend-info`, {
                    id: friendId,
                });

                let photoURL = response.data.player?.photoURL;
                setuserName(response.data.player?.nickName)
                if (photoURL) {
                    // ✅ 移除 `../`，確保相對路徑正確
                    photoURL = photoURL.replace(/^(\.\.\/)+/, "");

                    if (!photoURL.startsWith("http")) {
                        // ✅ 將相對路徑轉換為 Public 資料夾的完整路徑
                        photoURL = `${process.env.PUBLIC_URL}/${photoURL}`;
                    }

                    setPhoto(photoURL);
                    console.log("設定圖片 URL:", photoURL);
                } else {
                    console.warn("未找到好友圖片，使用預設圖片");
                    setPhoto(confirm_test);
                }
            } catch (error) {
                console.error("取得好友資訊失敗:", error);
                alert("請求失敗：" + (error.response?.data?.error || error.message));
            }
        };

        handleFriend();
    }, [friendId]); // ✅ 只有 friendId 變更時才請求 API

    useEffect(() => {
        if (!socket || !userId.userId) return;

        const sendInvite = (toUserId) => {
            if (!socket) {
                console.error("Socket.IO 未連線，無法發送邀請");
                return;
            }
            console.log(`發送邀請給 ${toUserId}`);
            socket.on("joined-room", ({ users, roomId }) => {
                console.log("以下用戶已加入房間:", users);
                if (users.includes(userId.userId)) {
                    navigate(`/question/${roomId}`);
                }
            });
            socket.emit("invite", { from: userId.userId, to: toUserId });
        };
        sendInvite(friendId)
    }, [socket, userId.userId]); // ✅ 只有 socket 連線成功後才監聽事件


    return (
        <div className="confirm">
            <Header images={["world_btn.svg", "wall_btn.svg", "culture_ul_btn.svg"]} />
            <main className="content">
                <img src={confirm_back} alt="confirm_back" className="confirm_back" onClick={() => navigate(-1)} />
                <h1 className="confirm_title">您將與&nbsp;{userName}&nbsp;進行闖關</h1>
                <div className="confirm_photo_area">
                    <img src={confirm_photo_box} alt="confirm_photo_box" className="confirm_photo_box" />
                    <img src={confirm_photo} alt="confirm_photo" className="confirm_photo" />
                    {/* <img src={photo} alt="confirm_photo" className="confirm_photo" /> //正確版 */}
                </div>
                <img src={confirm_start} alt="confirm_start" className="confirm_start" />
            </main>
        </div>
    );
};

export default Confirm;
