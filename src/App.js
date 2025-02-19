import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import "./css/Invite.css";
import Showcase from "./js/Showcase";
import Friend from "./js/Friend";
import AddFriend from "./js/AddFriend";
import ConfirmFriend from "./js/ConfirmFriend";
import Connect from "./js/Connect";
import Confirm from "./js/Confirm";
import Invite from "./js/Invite";
import Culture from "./js/Culture";
import Question from "./js/Question";
import Reward from "./js/Reward";
import Home from "./pages/Home";
import World from "./pages/World";
import Login from "./Login";
import Register from "./Register";
import Photo from "./js/Photo";
import invite_box from "./invite/invite_box.png";
import invite_test from "./invite/invite_test.svg";
import invite_yes from "./invite/invite_yes.png";
import invite_no from "./invite/invite_no.png";

const apiUrl = process.env.REACT_APP_API_URL;

export const SocketContext = createContext(null);
export const UserContext = createContext(null);
export const ModalContext = createContext(null);


const GlobalModal = ({ content, onClose, handleStart, handleReturn, friendId }) => {
    const [nickName, setNickName] = useState();

    useEffect(() => {
        if (nickName) return;

        const handleFriend = async () => {
            try {
                const response = await axios.post(`${apiUrl}/api/get-friend-info`, {
                    id: friendId,
                });
                setNickName(response.data.player?.nickName);
            } catch (error) {
                console.error("取得好友資訊失敗:", error);
                alert("請求失敗：" + (error.response?.data?.error || error.message));
            }
        };

        handleFriend();
    }, [friendId]);

    if (!content) return null;

    return (
        <div className="invite">
            <div className="invite-content">
                <img src={invite_box} alt="invite_box" className="invite_box" />
                <p className="invite_title">{nickName}&emsp;邀請您一起進行培養菌種</p>
                <img src={invite_test} alt="invite_test" className="invite_test" />
                <img src={invite_yes} alt="invite_yes" className="invite_yes" onClick={() => { handleStart(); onClose(); }} />
                <img src={invite_no} alt="invite_no" className="invite_no" onClick={onClose} />
            </div>
        </div>
    );
};


function App() {
    const [userId, setUserId] = useState(null);
    const [socket, setSocket] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    const [userName, setUserName] = useState(null);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/get-cookie`, {
                    withCredentials: true,
                });
                setUserId(response.data.id);
            } catch (error) {
                console.error("获取 Cookie 失败:", error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const newSocket = io(apiUrl, { transports: ["websocket"], withCredentials: true });
        newSocket.on("connect", () => newSocket.emit("register", userId));
        newSocket.on("disconnect", () => console.log("Socket.IO 断开连接"));
        newSocket.on("invite", (data) => {
            setUserName(data.from);
            setModalContent(() => (
                <ModalWrapper friendId={data.from} roomId={data.roomId} onClose={() => setModalContent(null)} />
            ));
        });
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            <SocketContext.Provider value={socket}>
                <ModalContext.Provider value={{ setModalContent }}>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/wall" element={<Showcase />} />
                            <Route path="/friend" element={<Friend />} />
                            <Route path="/addFriend" element={<AddFriend />} />
                            <Route path="/confirmFriend" element={<ConfirmFriend />} />
                            <Route path="/connect" element={<Connect />} />
                            <Route path="/confirm" element={<Confirm />} />
                            <Route path="/invite" element={<Invite />} />
                            <Route path="/culture" element={<Culture />} />
                            <Route path="/question" element={<Question />} />
                            <Route path="/reward" element={<Reward />} />
                            <Route path="/world" element={<World />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/photo" element={<Photo />} />
                            <Route path="/question/:roomId" element={<Question />} />
                        </Routes>
                        {modalContent}
                    </Router>
                </ModalContext.Provider>
            </SocketContext.Provider>
        </UserContext.Provider>
    );
}

const ModalWrapper = ({ friendId, onClose, roomId }) => {
    const { userId } = useContext(UserContext); // 确保正确获取 userId
    const navigate = useNavigate();
    const { socket,setSocket} = useContext(SocketContext);
    const newSocket = socket;
    newSocket.once("joined-room", ({ users, roomId }) => {
        console.log("以下用戶已加入房間:", users);
        if (users.includes(userId.userId)) {
            navigate(`/question/${roomId}`);
        }
    });
    setSocket(newSocket);
    const handleStart = () => {
        onClose();
        if (socket) {
            socket.emit("accept-invite", { userId, friendId, roomId });
        }
    };

    return (
        <GlobalModal
            content={userId}
            onClose={onClose}
            handleStart={handleStart}
            handleReturn={onClose}
            friendId={friendId}
        />
    );
};



export default App;