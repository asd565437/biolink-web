import "./css/Register.css";
import React, { useState, useRef, useEffect } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"; // 確保 URL 不為 undefined

function Register() {
    const navigate = useNavigate();
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [nickName, setNickName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isVisible, setIsVisible] = useState([false, false]);

    // 切換密碼可見性
    const toggleVisibility = (index) => {
        setIsVisible(prev => prev.map((item, i) => (i === index ? !item : item)));
    };

    // 註冊成功後導向
    const handleNavigate = (id, account) => {
        navigate('/photo', { state: { id, account } });
    };

    const handleSuccess = () => {
        navigate('/world', { state: { popup: true } });
    };

    // **處理 Google 註冊**
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            if (!user.email) {
                alert("Google 登入失敗，未獲取 Email");
                return;
            }

            const requestData = {
                account: user.email,
                nickName: user.displayName || "GoogleUser",  // 防止 undefined
                password: "google_generated_password",
                googleLogin: true,
                photoUrl: user.photoURL || ""
            };
            const response = await axios.post(`${apiUrl}/api/register`, requestData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 200) {
                alert("註冊成功!");
                handleSuccess();
            } else {
                alert("註冊失敗：" + (response.data.error || "未知錯誤"));
            }
        } catch (error) {
            console.error("Google 註冊錯誤：", error.response?.data || error.message);
            alert("Google 註冊錯誤：" + (error.response?.data?.error || "請稍後再試"));
        }
    };

    // **處理一般註冊**
    const handleRegister = async () => {
        // **前端驗證**
        if (!account.trim() || !password || !nickName.trim() || !confirmPassword) {
            console.log(!account.trim())
            console.log(!password)
            console.log(!nickName.trim())
            console.log(!confirmPassword)
            alert("請填寫所有必填欄位！");
            return;
        }

        if (password.length < 6) {
            alert("密碼長度至少為 6 個字元！");
            return;
        }

        if (password !== confirmPassword) {
            alert("密碼與確認密碼不一致！");
            return;
        }

        const requestData = {
            account: account.trim(), // 確保去除空白
            nickName: nickName.trim(),
            password,
            googleLogin: false
        };

        try {

            const response = await axios.post(`${apiUrl}/api/register`, requestData, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 200) {
                alert("註冊成功!");
                handleNavigate(response.data.user.id, account.trim());
                console.log(response.data.user.id)
            } else {
                alert("註冊失敗：" + (response.data.error || "未知錯誤"));
            }
        } catch (error) {
            alert("註冊失敗：" + (error.response?.data?.error || "請稍後再試！"));
        }
    };

    return (
        <div className="login-container">

            <div className="black-overlay-register"></div> {/* 新增的黑色遮罩層 */}

            <Link to="/">
                <div className="login-logo">
                    <img src="/logo_small.svg" alt="Logo" />
                </div>
            </Link>

            <div className="login_text">
                <img src="/register_title.svg" alt="Logo" className="register_title"/>
            </div>

            <div className="login-box-register">
                <div className="input-container-register">
                    <input
                        type="text"
                        placeholder="暱稱(最多3個字)"
                        maxLength={10}
                        value={nickName}
                        onChange={(e) => setNickName(e.target.value)}
                    />
                    <img src="/user_icon.svg" alt="Name Icon" />
                </div>

                <div className="input-container-register">
                    <input
                        type="email"
                        placeholder="電子郵件"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                    />
                    <img src="/mail_icon.svg" alt="Email Icon" />
                </div>

                <div className="input-container-register">
                    <input
                        type={isVisible[0] ? 'text' : 'password'}
                        placeholder="密碼 (至少6字元)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <img src="/key_icon.svg" alt="Password Icon" />
                    <img
                        src={isVisible[0] ? "/remove_red_eye_not.svg" : "/remove_red_eye.svg"}
                        alt="檢視密碼"
                        onClick={() => toggleVisibility(0)}
                        id="RegisterPasswordEye"
                    />
                </div>

                <div className="input-container-register">
                    <input
                        type={isVisible[1] ? 'text' : 'password'}
                        placeholder="確認密碼"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRegister();
                        }}
                    />
                    <img src="/key_icon.svg" alt="Password Icon" />
                    <img
                        src={isVisible[1] ? "/remove_red_eye_not.svg" : "/remove_red_eye.svg"}
                        alt="檢視密碼"
                        onClick={() => toggleVisibility(1)}
                        id="RegisterPasswordEye2"
                    />
                </div>

                <div className="button-register">
                    <img src="/next_step.svg" alt="" onClick={handleRegister} />
                </div>

                <div className="other-login-register">
                    <img src="/other_way_register.svg" alt="" className="other_way_login" />
                    <div className="other-login-icons-register">
                        <img src="/google_btn.svg" alt="Google 註冊" onClick={handleGoogleLogin} />
                    </div>
                </div>

                <div className="register-login">
                    <Link to="/login"><img src="/have.svg" alt="" /></Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
