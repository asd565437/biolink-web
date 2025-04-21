import "../css/Photo.css";
import React, { useState } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import photo_title from '../photo/photo_title.svg';
import photo_check from '../photo/photo_check.svg';
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
function Photo() {
    const navigate = useNavigate();
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const location = useLocation();
    const account = location.state?.account || "未知用户"; // 避免 state 为空时报错
    const id = location.state?.id || "未知用户"; // 避免 state 为空时报错
    const photoImage = (index) => {
        return require(`../photo/photo_${index}.svg`);
    };

    const handleNavigate = () => {
        navigate('/world', { state: { popup: true } });
    };

    const handlePhotoClick = (index) => {
        setSelectedPhoto((prevSelected) => (prevSelected === index ? null : index));
    };

    const handlePhoto = async () => {
        try {
            // 將Google登錄信息保存到Firebase Authentication
            const response = await fetch(`${apiUrl}/api/photo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    account: id,
                    photoURL: `../photo/photo_${selectedPhoto}.svg`
                }),
            });

            if (response.ok) {
                alert("註冊成功!");
                await axios.post(`${apiUrl}/set-cookie`, {
                    account: account,
                }, { withCredentials: true });
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
            <div className="black-overlay-photo"></div> {/* 新增的黑色遮罩層 */}
            
            <Link to="/"><div className="login-logo">
                <img src="/logo_small.svg" alt="Logo" />
            </div></Link>

            <div className="photo_title">
                <img src={photo_title} alt="photo_title" />
            </div>

            <div className="photo-box-register">
            {[0, 1].map((rowIndex) => (
                    <div className='rows' key={rowIndex}>
                        {Array(3).fill(null).map((_, colIndex) => {
                            const photoIndex = rowIndex * 3 + colIndex + 1;
                            return (
                                <div
                                    className={`photo_box ${selectedPhoto === photoIndex ? 'selected' : ''}`}
                                    key={photoIndex}
                                    onClick={() => handlePhotoClick(photoIndex)} // 點擊事件
                                >
                                    <img src={photoImage(photoIndex)} alt={`${photoIndex}號`} />
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div>
                    <div
                        className='checkPhoto'
                        onClick={handlePhoto}
                    >
                        <img src={photo_check}></img>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Photo;
