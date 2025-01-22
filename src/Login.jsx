import "./css/Login.css";
import { auth, googleProvider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

function Login() {
    const navigate = useNavigate();
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [eyeIcon, setEyeIcon] = useState("/remove_red_eye.svg"); // 控制圖像切換

    const toggleVisibility = () => {
        setIsVisible((prev) => !prev); // 不需要嵌套 `prev => !prev`
        setEyeIcon((prevIcon) =>
            prevIcon === "/remove_red_eye.svg"
              ? "/remove red eye_not.svg"
              : "/remove_red_eye.svg"
          ); // 切換圖像
    };

    const handleNavigate = () => {
        navigate('/world');
    };

    // 處理Google登入
    const handleGoogleLogin = async () => {
        try {
            // 使用 Google 登录
            const result = await signInWithPopup(auth, googleProvider);

            // 获取 Google 用户信息
            const user = result.user;
            console.log("Google 登录成功:", user);

            // 可以将用户的 email、nickname 等信息设置到 state
            setEmail(user.email);
            setPassword("google-auth-pass");  // 这可以是任意密码，具体需求视项目而定

            // 调用后端接口进行注册或登录
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user.email,
                    password: "google_generated_password",  // 这里的密码不重要，实际项目可替换
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("登入成功", data);
                alert("登入成功!");
                handleNavigate();  // 跳转到主页
            } else {
                const errorData = await response.json();
                console.error("登入失敗：", errorData.error);
                alert("登入失敗：" + errorData.error);
            }

        } catch (error) {
            console.error("Google 登入錯誤：", error);
            alert("Google 登入失敗，請稍後再試！");
        }
    };


    const handleLogin = async () => {
        if (!email || !password) {
            alert("登入失敗：請輸入帳號密碼");
            return;
        }
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("登入成功", data);
                handleNavigate();
            } else {
                const errorData = await response.json();
                console.error("登入失敗：", errorData.error);
                alert("登入失敗：" + errorData.error);
            }
        } catch (error) {
            console.error("網路錯誤：", error);
            alert("網路錯誤，請稍後再試！");
        }
    };


    return (
        <div className="login-container">
            {/* Logo */}
            <Link to="/"><div className="login-logo">
                <img src="/logo_small.svg" alt="Logo" />
            </div></Link>

            <div className="login_text">
                <img src="/login_title.svg" alt="login" />
            </div>

            {/* 白色遮罩 */}
            <div className="login-box-login">

                {/* Email 輸入框 */}
                <div className="input-container-login">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <img src="/mail_icon.svg" alt="" className="icon" />
                </div>

                {/* 密碼輸入框 */}
                <div className="input-container-login">
                    <input
                        type={isVisible ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <img src="key_icon.svg" alt="" className="icon" />
                    <img src={eyeIcon} alt="Check Password" id="LoginPasswordEye" onClick={toggleVisibility} />
                </div>

                {/* 記住帳號 和 忘記密碼 */}
                <div className="rememberOforgot">
                    <img src="/remember.svg" alt="" id="remember" />
                    {/* <img src="/忘記密碼？.png" alt="" id="forgot" /> */}
                </div>

                {/* 登入按鈕 */}
                <div className="button-login" onClick={handleLogin}>
                    <img src="/login_btn.svg" alt="" />
                </div>

                {/* 其他登入方式 */}
                <div className="other-login-login">
                    <img src="/other_way_login.svg" alt="" />
                    <div className="other-login-icons-login">
                        <img src="/google_btn.svg" alt="Google Login" onClick={handleGoogleLogin} />
                    </div>
                </div>

                {/* 註冊 */}
                <div className="register">
                    <Link to="/register"><img src="/never.svg" alt="" id="register" /></Link>
                </div>

            </div>
        </div>
    );
}

export default Login;
