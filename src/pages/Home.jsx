import React , { useEffect }from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../css/Home.css';
import Logo from '../home/logo_big.svg';
import Text from '../home/introduce.svg';
import Login from '../home/login.svg';
import Go from '../home/start_btn.svg';

function Home() {
    const navigate = useNavigate();
    return (

        <div id="container">
            {/* <img src={Bg} alt="" className="bg" /> */}
            <img src={Logo} alt="" className="logo" />
            <img src={Text} alt="" className="text" />
            <Link to="/login"><img src={Login} alt="" className="login" /></Link>
            <img src={Go} alt="" className="go" onClick={() => navigate("/world")} />
        </div>
    )
}

export default Home