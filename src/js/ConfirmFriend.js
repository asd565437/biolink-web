import "../css/ConfirmFriend.css"; // 引入样式文件
import { useNavigate, useLocation } from 'react-router-dom';
import confirmFriend_back from '../confirmFriend/confirmFriend_back.svg';
import confirmFriend_box from '../confirmFriend/confirmFriend_box.png';
import confirmFriend_photo from '../confirm/confirm_photo.svg';
import confirmFriend_photo_box from "../confirm/confirm_photo_box.png";
import confirmFriend_yes from '../confirmFriend/confirmFriend_yes.png';
import confirmFriend_no from '../confirmFriend/confirmFriend_no.png';
import { useEffect, useState ,useContext } from "react";
import { SocketContext, UserContext } from "../App"; // 引入全域 Socket 上下文
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const ConfirmFriend = ({ friendId ,onClose, onBack }) => {
    const navigate = useNavigate();
    const [userName, setuserName] = useState("菌男霉女");
    const [photo, setPhoto] = useState(confirmFriend_photo);
    const location = useLocation();
    const socket = useContext(SocketContext); // 使用全域 socket
    const userId = useContext(UserContext);


    const sendInvite = (toUserId) => {
        onClose();
        if (!socket) {
            console.error("Socket.IO 未連線，無法發送邀請");
            return;
        }
        console.log(`發送邀請給 ${toUserId}`);
        socket.emit("add_friend", { from: userId.userId, to: toUserId });
    };

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
                    setPhoto(confirmFriend_photo);
                }
            } catch (error) {
                console.error("取得好友資訊失敗:", error);
                alert("請求失敗：" + (error.response?.data?.error || error.message));
            }
        };

        handleFriend();
    }, [friendId]); // ✅ 只有 friendId 變更時才請求 API
    return (
        <div className="confirmFriend">
            <div className="confirmFriend-content">
                <img src={confirmFriend_back} alt="confirmFriend_back" className="confirmFriend_back" onClick={onBack} />
                <img src={confirmFriend_box} alt="confirmFriend_box" className="confirmFriend_box" />
                <p className="confirmFriend_title">您確認將&nbsp;{userName}&nbsp;加入為好友嗎？</p>

                <div className="confirmFriend_photo_area">
                    <img src={confirmFriend_photo_box} alt="confirmFriend_photo_box" className="confirmFriend_photo_box" />
                    <img src={photo} alt="confirmFriend_photo" className="confirmFriend_photo" /> {/* 存取玩家的頭像 */}
                </div>

                <img src={confirmFriend_yes} alt="confirmFriend_yes" className="confirmFriend_yes" onClick={() => sendInvite(friendId)} />
                <img src={confirmFriend_no} alt="confirmFriend_no" className="confirmFriend_no" onClick={onClose} />
            </div>
        </div>
    );
};

export default ConfirmFriend;