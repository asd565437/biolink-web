import "../css/Reward.css";
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import reward_title from '../reward/reward_title.svg';
import test_pic from '../reward/test.jpg';
import check from '../reward/check.png';
import strain_name_box from '../reward/strain_name_box.png';
import strain_name_finish from '../reward/strain_name_finish.png';
import { SocketContext, UserContext } from "../App"; // 引入全域 Socket 上下文

const Reward = () => {
  const [timestamp] = useState(new Date().getTime());
  const navigate = useNavigate();
  const userId = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);
  const [strainName, setStrainName] = useState("");
  const [strainImage, setStrainImage] = useState(test_pic); // 初始圖片
  const socket = useContext(SocketContext);
  const location = useLocation();
  const imageURL = location.state?.URL || false; // 如果沒有數據則給預設值
  const bio_id = location.state?.bio_id || false; // 如果沒有數據則給預設值
  const handleBack = () => {
    setShowPopup(true);
  };
  useEffect(() => {
    if (imageURL) {
      setStrainImage(imageURL + "?v=" + timestamp);
    }
  }, [imageURL]);


  useEffect(() => {
    socket.on("updateText", (newText) => {
      setStrainName(newText);
      console.log(strainName);
    });
    socket.once("both-submit", (strainName) => {
      alert(`已成功命名為：${strainName}`);
      setShowPopup(false);
      navigate('/world');
    });

    return () => {
      socket.off("updateText");
    };
  }, []);
  const handleChange = (e) => {
    const newText = e.target.value;
    socket.emit("editText", newText);
  };

  const handleNameSubmit = () => {
    if (strainName.trim() === "") {
      alert("請輸入菌種名稱");
      return;
    }
    socket.emit("submit_name", { userId: userId.userId, bio_id, strainName });
  };

  return (
    <div className="reward">
      <img src={reward_title} alt="標題" className="reward_title" />
      <div className="strain-box" style={{ backgroundImage: `url(${strainImage}` }}></div>
      <img src={check} alt="確認按鈕" className="check" onClick={handleBack} />

      {showPopup && (
        <div className="strainName-popup">
          <div className="strainName-popup-content">
            <img src={strain_name_box} alt="strain_name_box" className="strain_name_box" />
            <input
              type="text"
              placeholder="輸入菌種名稱"
              value={strainName}
              onChange={handleChange}
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

