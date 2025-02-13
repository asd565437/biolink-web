import "../css/Reward.css";
import { useNavigate } from 'react-router-dom';
import reward_title from '../reward/reward_title.svg';
import strain from '../reward/strain.svg';
import check from '../reward/check.svg';

const Reward = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/connect');
      };

    return(
        <div className="reward">
            <img src={reward_title} alt="標題" className="reward_title" />
            <img src={strain} alt="新菌種" className="strain" />
            <img src={check} alt="確認按鈕" className="check" onClick={handleBack} />
        </div>
    );
}

export default Reward;

