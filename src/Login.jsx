import "./css/Login.css";
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

function Login() {
    const navigate = useNavigate();
    const [account, setAccount] = useState("");  // 修正变量名
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [eyeIcon, setEyeIcon] = useState("/remove_red_eye.svg");

    // 切换密码显示/隐藏
    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
        setEyeIcon(prevIcon => prevIcon === "/remove_red_eye.svg"
            ? "/remove_red_eye_not.svg"
            : "/remove_red_eye.svg");
    };

    // 处理 Google 登录
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
                alert("登录成功!");
                
                // 设置 Cookie
                await axios.post(`${apiUrl}/set-cookie`, {
                    account: user.email
                }, { withCredentials: true });

                navigate('/world');
            } else {
                console.error("登录失败：", response.data.error);
                alert("登录失败：" + response.data.error);
            }
        } catch (error) {
            console.error("Google 登录错误：", error);
            alert("Google 登录失败，请稍后再试！");
        }
    };

    // 处理邮箱密码登录
    const handleLogin = async () => {
        if (!account || !password) {
            alert("请输入邮箱和密码");
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/api/login`, {
                account,
                password
            });

            if (response.status === 200) {
                alert("登录成功!");

                // 设置 Cookie
                await axios.post(`${apiUrl}/set-cookie`, {
                    account: account
                }, { withCredentials: true });

                navigate('/world');
            } else {
                console.error("登录失败：", response.data.error);
                alert("登录失败：" + response.data.error);
            }
        } catch (error) {
            console.error("网络错误：", error);
            alert("网络错误，请稍后再试！");
        }
    };

    return (
        <div className="login-container">
            <Link to="/">
                <div className="login-logo">
                    <img src="/logo_small.svg" alt="Logo" />
                </div>
            </Link>

            <div className="login_text">
                <img src="/login_title.svg" alt="login" />
            </div>

            <div className="login-box-login">
                <div className="input-container-login">
                    <input
                        type="email"
                        placeholder="电子邮件"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)} // 修正 setAccount
                    />
                    <img src="/mail_icon.svg" alt="" className="icon" />
                </div>

                <div className="input-container-login">
                    <input
                        type={isVisible ? 'text' : 'password'}
                        placeholder="密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <img src="/key_icon.svg" alt="" className="icon" />
                    <img src={eyeIcon} alt="Check Password" id="LoginPasswordEye" onClick={toggleVisibility} />
                </div>

                <div className="button-login" onClick={handleLogin}>
                    <img src="/login_btn.svg" alt="" />
                </div>

                <div className="other-login-login">
                    <img src="/other_way_login.svg" alt="" />
                    <div className="other-login-icons-login">
                        <img src="/google_btn.svg" alt="Google Login" onClick={handleGoogleLogin} />
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
