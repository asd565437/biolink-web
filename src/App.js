import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Showcase from './js/Showcase';
import Friend from './js/Friend';
import AddFriend from './js/AddFriend';
import ConfirmFriend from './js/ConfirmFriend';
import Connect from './js/Connect';
import Confirm from './js/Confirm';
import Invite from './js/Invite';
import Culture from './js/Culture';
import Question from './js/Question';
import Reward from './js/Reward';
import Home from './pages/Home';
import World from './pages/World';
import Login from './Login';
import Register from './Register';
import Photo from './js/Photo';

function App() {
    const [headerImages, setHeaderImages] = useState([
        'world_btn.png', 
        'wall_ul_btn.png', 
        'culture_btn.png'
    ]); // 默认图片数组
    const [title, setTitle] = useState('Biolink');

    useEffect(() => {
        document.title = title;
    }, [title]);
    return (
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/wall" element={<Showcase setHeaderImages={setHeaderImages}/>} />
                    <Route path="/friend" element={<Friend setHeaderImages={setHeaderImages}/>} />
                    <Route path="/addFriend" element={<AddFriend />} />
                    <Route path="/confirmFriend" element={<ConfirmFriend />} />
                    <Route path="/connect" element={<Connect setHeaderImages={setHeaderImages}/>} />
                    <Route path="/confirm" element={<Confirm setHeaderImages={setHeaderImages}/>} />
                    <Route path="/invite" element={<Invite setHeaderImages={setHeaderImages}/>} />
                    <Route path="/culture" element={<Culture setHeaderImages={setHeaderImages}/>} />
                    <Route path="/question" element={<Question setHeaderImages={setHeaderImages}/>} />
                    <Route path="/reward" element={<Reward />} />
                    <Route path="/world" element={<World setHeaderImages={setHeaderImages}/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/photo" element={<Photo />}/>
                </Routes>
            </Router>
    );
}

export default App;
