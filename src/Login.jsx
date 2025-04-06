import "./css/Login.css";
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

function Login() {
    const inputRef = useRef(null);

    useEffect(() => {
        const input = inputRef.current;
        if (input) {
            const handleKeyDown = (event) => {
                if (event.key === 'Enter') {
                    handleLogin();
                }
            };

            input.addEventListener('keydown', handleKeyDown);

            // 清除事件監聽（好習慣）
            return () => {
                input.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, []);
    const navigate = useNavigate();
    const [account, setAccount] = useState("");  // 修正變數名稱
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [eyeIcon, setEyeIcon] = useState("/remove_red_eye.svg");

    // 切換密碼顯示/隱藏
    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
        setEyeIcon(prevIcon => prevIcon === "/remove_red_eye.svg"
            ? "/remove_red_eye_not.svg"
            : "/remove_red_eye.svg");
    };

    // 處理 Google 登入
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const response = await axios.post(`${apiUrl}/api/login`, {
                account: user.email,
                password: "google_generated_password",
                googleLogin: true
            });
            if (response.status === 200) {
                alert("登入成功!");
                setIsLogin(true);
                // 設置 Cookie
                await axios.post(`${apiUrl}/set-cookie`, {
                    account: user.email,
                }, { withCredentials: true });
                navigate('/world', { state: { popup: true } });
            } else {
                console.error("登入失敗：", response.data.error);
                alert("登入失敗：" + response.data.error);
            }
        } catch (error) {
            console.error("Google 登入錯誤：", error);
            alert(error);
        }
    };

    // 處理電子郵件密碼登入
    const handleLogin = async () => {
        if (!account || !password) {
            alert("請輸入電子郵件與密碼");
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/login`, {
                account,
                password
            }, { withCredentials: true, validateStatus: status => status < 500 });

            if (response.status === 200) {
                alert("登入成功!");
                setIsLogin(true);
                // 設置 Cookie
                await axios.post(`${apiUrl}/set-cookie`, {
                    account: account
                }, { withCredentials: true });
                navigate('/world', { state: { popup: true } });
            } else {
                console.error("登入失敗：", response.data.error);
                alert("登入失敗：" + response.data.error);
            }
        } catch (error) {
            console.log(":(")
            console.error("網路錯誤：", error);
            alert("網路錯誤，請稍後再試！");
        }
    };


    return (
        <div className="login-container">
            <div className="black-overlay-login"></div> {/* 新增的黑色遮罩層 */}

            <Link to="/">
                <div className="login-logo">
                    <img src="/logo_small.svg" alt="Logo" />
                </div>
            </Link>

            <div className="login_text">
                <img src="/login_title.svg" alt="登入" />
            </div>

            <div className="login-box-login">
                <div className="input-container-login">
                    <input
                        type="email"
                        placeholder="電子郵件"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)} // 修正 setAccount
                    />
                    <img src="/mail_icon.svg" alt="" className="icon" />
                </div>

                <div className="input-container-login">
                    <input
                        type={isVisible ? 'text' : 'password'}
                        placeholder="密碼"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleLogin();
                        }}
                    />
                    <img src="/key_icon.svg" alt="" className="icon" />
                    <img src={eyeIcon} alt="檢視密碼" id="LoginPasswordEye" onClick={toggleVisibility} />
                </div>

                <div className="button-login" onClick={handleLogin}>
                    <img src="/login_btn.svg" alt="" />
                </div>

                <div className="other-login-login">
                    <img src="/other_way_login.svg" alt="" />
                    <div className="other-login-icons-login">
                        <img src="/google_btn.svg" alt="Google 登入" onClick={handleGoogleLogin} />
                    </div>
                </div>

                <div className="register">
                    <Link to="/register">
                        <img src="/never.svg" alt="" id="register" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
