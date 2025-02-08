import "../css/Confirm.css"; // 引入样式文件
import { useNavigate } from 'react-router-dom';
import Header from "./Header.js";
import confirm_title from '../confirm/confirm_title.svg';
import confirm_back from '../confirm/confirm_back.svg';
import confirm_test from '../confirm/confirm_test.svg';
import confirm_start from '../confirm/confirm_start.svg';

const Confirm = () => {
    const navigate = useNavigate();

    const handleStartQuiz = () => {
        navigate('/question');
        //alert("開始問答！");
    };

    return (
        <div className="confirm">
            {/* Header 组件 */}
            <Header images={['world_btn.svg', 'wall_btn.svg', 'culture_ul_btn.svg']} />
            {/* Content 部分 */}
            <main className="content">
                <img src={confirm_back} alt="confirm_back" className="confirm_back" onClick={() => navigate(-1)} />
                <img src={confirm_title} alt="confirm_title" className="confirm_title" />
                <img src={confirm_test} alt="confirm_test" className="confirm_test" />
                <img src={confirm_start} alt="confirm_start" className="confirm_start" onClick={handleStartQuiz} />
            </main>
        </div>
    );
};

export default Confirm;

