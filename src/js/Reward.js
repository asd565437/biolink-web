import "../css/Reward.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reward_title from '../reward/reward_title.svg';
import strain from '../reward/strain.svg';
import check from '../reward/check.svg';
import strain_name_box from '../reward/strain_name_box.png';
import strain_name_finish from '../reward/strain_name_finish.png';

const Reward = () => {
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [strainName, setStrainName] = useState("");

    const handleBack = () => {
        setShowPopup(true);
    };

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
            <img src={strain} alt="新菌種" className="strain" />
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
                        <button onClick={handleNameSubmit}>輸入完成</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reward;

