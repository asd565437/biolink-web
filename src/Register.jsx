import "./css/Register.css";
import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickName, setNickName] = useState("");
    const [isVisible, setIsVisible] = useState([false, false]);
    const [eyeIcon, setEyeIcon] = useState(["/remove_red_eye.svg", "/remove_red_eye.svg"]); // 控制圖像切換
    const [confirmPassword, setConfirmPassword] = useState("");

    // 切换密码显示状态
    const toggleVisibility = (index) => {
        setIsVisible((prev) =>
            prev.map((item, i) => (i === index ? !item : item))
        );
        // 切換對應的圖標
        setEyeIcon((prev) =>
            prev.map((icon, i) =>
                i === index
                    ? icon === "/remove_red_eye.svg"
                        ? "/remove red eye_not.svg"
                        : "/remove_red_eye.svg"
                    : icon
            )
        );
    };

    const handleNavigate = () => {
        navigate('/login');
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const tempEmail = result.user.email;
            const tempNickName = result.user.displayName;
            const tempPassword = "google_generated_password"; // 默认 Google 登录密码
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: tempEmail,
                    nickName: tempNickName,
                    password: tempPassword,
                }),
            });

            if (response.ok) {
                alert("註冊成功!");
                handleNavigate();
            } else {
                const errorData = await response.json();
                alert("註冊失敗：" + errorData.error);
            }
        } catch (error) {
            alert("網路錯誤，請稍後再試！");
            console.error(error);
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !nickName || !confirmPassword) {
            alert("請輸入所有必填欄位！");
            return;
        }

        if (password !== confirmPassword) {
            alert("密碼與確認密碼不一致！");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    nickName,
                    password,
                }),
            });

            if (response.ok) {
                alert("註冊成功!");
                handleNavigate();
            } else {
                const errorData = await response.json();
                alert("註冊失敗：" + errorData.error);
            }
        } catch (error) {
            alert("網路錯誤，請稍後再試！");
            console.error(error);
        }
    };

    return (
        <div className="login-container">
            <Link to="/"><div className="login-logo">
                <img src="/logo_small.svg" alt="Logo" />
            </div></Link>

            <div className="login_text">
                <img src="/register_title.svg" alt="Logo" />
            </div>

            <div className="login-box-register">
                <div className="input-container-register">
                    <input
                        type="text"
                        placeholder="Name"
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                    />
                    <img src="/user_icon.svg" alt="Name Icon" />
                </div>

                <div className="input-container-register">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <img src="/mail_icon.svg" alt="Email Icon" />
                </div>

                <div className="input-container-register">
                    <input
                        type={isVisible[0] ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <img src="/key_icon.svg" alt="Password Icon" />
                    <img
                        src={eyeIcon[0]}
                        alt="Check Password"
                        id="RegisterPasswordEye"
                        onClick={() => toggleVisibility(0)}
                    />
                </div>

                <div className="input-container-register">
                    <input
                        type={isVisible[1] ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <img src="/key_icon.svg" alt="Password Icon" />
                    <img
                        src={eyeIcon[1]}
                        alt="Check Password"
                        id="RegisterPasswordEye2"
                        onClick={() => toggleVisibility(1)}
                    />
                </div>

                <div className="button-register">
                    <img src="/register_btn.svg" alt="" onClick={handleRegister} />
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
