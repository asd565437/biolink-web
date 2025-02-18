import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

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

const apiUrl = process.env.REACT_APP_API_URL;

// **创建全局 Context**
export const SocketContext = createContext(null);
export const UserContext = createContext(null); // 用于存储 userId

function App() {
    const [headerImages, setHeaderImages] = useState([
        "world_btn.png",
        "wall_ul_btn.png",
        "culture_btn.png",
    ]);
    const [title, setTitle] = useState("Biolink");
    const [userId, setUserId] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        document.title = title;
    }, [title]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/get-cookie`, {
                    withCredentials: true,
                });
                console.log("获取到的用户 ID:", response.data.id);
                setUserId(response.data.id);
            } catch (error) {
                console.error("获取 Cookie 失败:", error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (!userId) return; // 只有当 userId 不为空时才建立连接

        console.log("创建全局 Socket.IO 连接...");
        const newSocket = io(apiUrl, {
            transports: ["websocket"],
            withCredentials: true,
        });

        newSocket.on("connect", () => {
            console.log("Socket.IO 连接成功:", newSocket.id);
            newSocket.emit("register", userId);
        });

        newSocket.on("disconnect", () => {
            console.log("Socket.IO 断开连接");
        });
        newSocket.on("invite", handleInvite);
        const handleInvite = (data) => {
            console.log(data)
            console.log(`收到邀請: ${data.from} -> ${data.to}`);
        };
        setSocket(newSocket); // 存储全局 socket 实例

        return () => {
            console.log("清理 Socket.IO 连接");
            newSocket.disconnect();
        };
    }, [userId]);

    return (
        <UserContext.Provider value={{userId,setUserId}}> {/* 提供 userId 全局状态 */}
            <SocketContext.Provider value={socket}> {/* 提供 Socket 全局状态 */}
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/wall" element={<Showcase setHeaderImages={setHeaderImages} />} />
                        <Route path="/friend" element={<Friend setHeaderImages={setHeaderImages} />} />
                        <Route path="/addFriend" element={<AddFriend />} />
                        <Route path="/confirmFriend" element={<ConfirmFriend />} />
                        <Route path="/connect" element={<Connect setHeaderImages={setHeaderImages} />} />
                        <Route path="/confirm" element={<Confirm setHeaderImages={setHeaderImages} />} />
                        <Route path="/invite" element={<Invite setHeaderImages={setHeaderImages} />} />
                        <Route path="/culture" element={<Culture setHeaderImages={setHeaderImages} />} />
                        <Route path="/question" element={<Question setHeaderImages={setHeaderImages} />} />
                        <Route path="/reward" element={<Reward />} />
                        <Route path="/world" element={<World setHeaderImages={setHeaderImages} />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/photo" element={<Photo />} />
                    </Routes>
                </Router>
            </SocketContext.Provider>
        </UserContext.Provider>
    );
}

export default App;
