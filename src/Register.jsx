import "./css/Register.css";
import React, { useState } from 'react';
import { auth, googleProvider } from './firebase'; // 從firebase.js中導入初始化的auth和googleProvider
import { signInWithPopup } from 'firebase/auth'; // 導入Firebase的認證方法
import { Link, useNavigate } from 'react-router-dom';
const apiUrl = process.env.REACT_APP_API_URL;

function Register() {
    const navigate = useNavigate();
    const [account, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickName, setNickName] = useState("");
    const [isVisible, setIsVisible] = useState([false, false]);
    const [eyeIcon, setEyeIcon] = useState(["/remove_red_eye.svg", "/remove_red_eye.svg"]); // 控制圖標切換
    const [confirmPassword, setConfirmPassword] = useState("");

    // 切換密碼顯示狀態
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

    const handleNavigate = (id) => {
        navigate('/photo', { state: { id } });
    };
    const handleSucess = (username) => {
        navigate('/world');
    };

    // 處理Google登錄
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider); // 使用Firebase的signInWithPopup方法進行Google登錄
            console.log(result)
            const user = result.user;
            const tempEmail = user.email;
            const tempNickName = user.displayName;
            const photoUrl = user.photoURL;
            // 將Google登錄信息保存到Firebase Authentication
            const response = await fetch(`${apiUrl}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    account: tempEmail,
                    nickName: tempNickName,
                    password: "google_generated_password", // 預設Google登錄密碼
                    googleLogin: true,
                    photoUrl: photoUrl
                }),
            });

            if (response.ok) {
                alert("註冊成功!");
                handleSucess();
            } else {
                const errorData = await response.json();
                alert("註冊失敗：" + errorData.error);
            }
        } catch (error) {
            alert("網路錯誤，請稍後再試！");
            console.error(error);
        }
    };

    // 處理註冊
    const handleRegister = async () => {
        if (!account || !password || !nickName || !confirmPassword) {
            alert("請填寫所有必填項！");
            return;
        }

        if (password !== confirmPassword) {
            alert("密碼和確認密碼不一致！");
            return;
        }

        try {
            // 將Google登錄信息保存到Firebase Authentication
            const response = await fetch(`${apiUrl}/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    account: account,
                    nickName: nickName,
                    password: password, // 預設Google登錄密碼
                    googleLogin: false
                }),
            });

            if (response.ok) {
                alert("註冊成功!");
                const data = await response.json();
                handleNavigate(data.user.id);
                console.log(data.user.id)
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
                        placeholder="暱稱"
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
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <img src="/mail_icon.svg" alt="Email Icon" />
                </div>

                <div className="input-container-register">
                    <input
                        type={isVisible[0] ? 'text' : 'password'}
                        placeholder="密碼"
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
                        placeholder="確認密碼"
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
