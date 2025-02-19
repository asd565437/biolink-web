import "../css/Invite.css"; // 引入样式文件
import { useNavigate } from 'react-router-dom';
import Header from "./Header.js";
import invite_box from '../invite/invite_box.png';
import invite_test from '../invite/invite_test.svg';
import invite_yes from '../invite/invite_yes.png';
import invite_no from '../invite/invite_no.png';


const Invite = () => {
    const navigate = useNavigate();
    const userName = "菌男霉女"; // 先用固定Name，之後可改成動態獲取
    
    const handleStart = () => {
        navigate('/question');
    };

    const handleReturn = () => {
        navigate('/world');
    };

    return (
        <div className="invite">
            {/* Content 部分 */}
            <div className="invite-content">
                <img src={invite_box} alt="invite_box" className="invite_box" />
                <p className="invite_title">{userName}&emsp;邀請您一起進行培養菌種</p>
                <img src={invite_test} alt="invite_test" className="invite_test" />
                <img src={invite_yes} alt="invite_yes" className="invite_yes" onClick={handleStart}/>
                <img src={invite_no} alt="invite_no" className="invite_no" onClick={handleReturn} />
            </div>
        </div>
    );
};

export default Invite;

