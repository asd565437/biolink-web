import "./css/Register.css";
import React, { useState } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

function Register() {
    const navigate = useNavigate();
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [nickName, setNickName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isVisible, setIsVisible] = useState([false, false]);

    // 切换密码可见性
    const toggleVisibility = (index) => {
        setIsVisible(prev => prev.map((item, i) => (i === index ? !item : item)));
    };

    // 处理注册成功的跳转
    const handleNavigate = (id) => {
        navigate('/photo', { state: { id } });
    };

    const handleSuccess = () => {
        navigate('/world');
    };

    // 处理 Google 注册
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            console.log("Google 用户信息:", user);

            const response = await axios.post(`${apiUrl}/api/register`, {
                account: user.email,
                nickName: user.displayName,
                password: "google_generated_password",
                googleLogin: true,
                photoUrl: user.photoURL
            }, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("服务器响应:", response.data);

            if (response.status === 200) {
                alert("注册成功!");
                handleSuccess();
            } else {
                console.error("注册失败：", response.data.error);
                alert("注册失败：" + response.data.error);
            }
        } catch (error) {
            console.error("Google 注册错误：", error.response?.data || error.message);
            alert("Google 注册失败，请稍后再试！");
        }
    };

    // 处理普通注册
    const handleRegister = async () => {
        if (!account || !password || !nickName || !confirmPassword) {
            alert("请填写所有必填项！");
            return;
        }

        if (password !== confirmPassword) {
            alert("密码和确认密码不一致！");
            return;
        }

        try {
            console.log("发送注册请求", { account, nickName, password, googleLogin: false });

            const response = await axios.post(`${apiUrl}/api/register`, {
                account,
                nickName,
                password,
                googleLogin: false
            }, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("服务器响应:", response.data);

            if (response.status === 200) {
                alert("注册成功!");
                handleNavigate(response.data.user.id);
            } else {
                console.error("注册失败：", response.data.error);
                alert("注册失败：" + response.data.error);
            }
        } catch (error) {
            console.error("网络错误：", error.response?.data || error.message);
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
                <img src="/register_title.svg" alt="Logo" />
            </div>

            <div className="login-box-register">
                <div className="input-container-register">
                    <input
                        type="text"
                        placeholder="昵称"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                    />
                    <img src="/user_icon.svg" alt="Name Icon" />
                </div>

                <div className="input-container-register">
                    <input
                        type="email"
                        placeholder="电子邮件"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                    />
                    <img src="/mail_icon.svg" alt="Email Icon" />
                </div>

                <div className="input-container-register">
                    <input
                        type={isVisible[0] ? 'text' : 'password'}
                        placeholder="密码"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <img src="/key_icon.svg" alt="Password Icon" />
                    <img
                        src={isVisible[0] ? "/remove_red_eye_not.svg" : "/remove_red_eye.svg"}
                        alt="Check Password"
                        id="RegisterPasswordEye"
                        onClick={() => toggleVisibility(0)}
                    />
                </div>

                <div className="input-container-register">
                    <input
                        type={isVisible[1] ? 'text' : 'password'}
                        placeholder="确认密码"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <img src="/key_icon.svg" alt="Password Icon" />
                    <img
                        src={isVisible[1] ? "/remove_red_eye_not.svg" : "/remove_red_eye.svg"}
                        alt="Check Password"
                        id="RegisterPasswordEye2"
                        onClick={() => toggleVisibility(1)}
                    />
                </div>

                <div className="button-register">
                    <img src="/next_step.svg" alt="" onClick={handleRegister} />
                </div>

                <div className="other-login-register">
                    <img src="/other_way_login.svg" alt="" />
                    <div className="other-login-icons-register">
                        <img src="/google_btn.svg" alt="Google Login" onClick={handleGoogleLogin} />
                    </div>
                </div>

                <div className="register-login">
                    <Link to="/login"><img src="/have.svg" alt="" id="register" /></Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
