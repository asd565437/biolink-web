import "../css/Reward.css";
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import reward_title from '../reward/reward_title.svg';
import strain from '../reward/strain.svg';
import test_pic from '../reward/test.jpg';
import check from '../reward/check.png';
import strain_name_box from '../reward/strain_name_box.png';
import strain_name_finish from '../reward/strain_name_finish.png';

const Reward = () => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [strainName, setStrainName] = useState("");
    const [strainImage, setStrainImage] = useState(test_pic); // 初始圖片
    const location = useLocation();
    const imageURL = location.state?.URL || false; // 如果沒有數據則給預設值
    const handleBack = () => {
        setShowPopup(true);
    };
      useEffect(() => {
        if (imageURL) {
            setStrainName(imageURL);
        }
      }, [imageURL]);

    const handleNameSubmit = () => {
        if (strainName.trim() === "") {
            alert("請輸入菌種名稱");
            return;
        }
        alert(`已成功命名為：${strainName}`);
        setShowPopup(false);
        navigate('/world');
    };

    return (
        <div className="reward">
            <img src={reward_title} alt="標題" className="reward_title" />
            <div className="strain-box" style={{ backgroundImage: `url(${strainImage})` }}></div>
            <img src={check} alt="確認按鈕" className="check" onClick={handleBack} />

            {showPopup && (
                <div className="strainName-popup">
                    <div className="strainName-popup-content">
                        <img src={strain_name_box} alt="strain_name_box" className="strain_name_box" />
                        <input
                            type="text"
                            placeholder="輸入菌種名稱"
                            value={strainName}
                            onChange={(e) => setStrainName(e.target.value)}
                            className="strainName-input"
                        />
                        <img src={strain_name_finish} alt="strain_name_finish" className="strain_name_finish" onClick={handleNameSubmit} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reward;

