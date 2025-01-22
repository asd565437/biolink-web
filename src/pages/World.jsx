import React from "react";
import '../css/World.css';
import Header from "../js/Header";
import { useData } from '../DataContext';

function World() {
    return (
        <div id="container">
            {/* {<img src={Bg} alt="" className="bg" />} */}
            <Header images={['world_ul_btn.svg',
                'wall_btn.svg',
                'culture_btn.svg' ]}/>
        </div>

    )
}

export default World
