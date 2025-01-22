import "../css/Question.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "./Header.js";
import back_icon from "../question/back_btn.svg";
import last from "../question/back_to_frount_btn.svg";

const question_ids = ["10", "15", "20", "25", "30"];

const Question = () => {
  const navigate = useNavigate();
  const [buttonStates, setButtonStates] = useState({
    P1_A: false,
    P1_B: false,
    P2_A: false,
    P2_B: false,
  });

  const [progress, setProgress] = useState(0);
  const [question, setQuestion] = useState("");
  const [splitSentence, setSplitSentence] = useState([]);
  const bar_images = [
    "progress_bar_1.svg",
    "progress_bar_2.svg",
    "progress_bar_3.svg",
    "progress_bar_4.svg",
    "progress_bar_5.svg",
  ];

  useEffect(() => {
    // 初始化加载第一题
    loadQuestion(0);
  }, []);

  const loadQuestion = async (currentProgress) => {
    try {
      const response = await fetch("http://localhost:5000/api/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question_id: question_ids[currentProgress],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setQuestion(data.question_list.question);
        setSplitSentence(data.question_list.answers.split(", "));
      } else {
        const errorData = await response.json();
        console.error("请求失败：", errorData.error);
        alert("请求失败：" + errorData.error);
      }
    } catch (error) {
      console.error("网络错误：", error);
      alert("网络错误，请稍后再试！");
    }
  };

  const handleClick = async(question, option) => {
    setButtonStates((prevState) => ({
      ...prevState,
      [`${question}_${option}`]: !prevState[`${question}_${option}`],
    }));
    if (question === "P2") {
      await handleNextQuestion();
    }
  };

  const handleNextQuestion = async () => {
    if (progress >= question_ids.length - 1) {
      navigate("/reward");
      return;
    }

    setProgress((prevProgress) => {
      const newProgress = prevProgress + 1;
      loadQuestion(newProgress);
      return newProgress;
    });

    setButtonStates({
      P1_A: false,
      P1_B: false,
      P2_A: false,
      P2_B: false,
    });
  };

  const handleBack = () => {
    navigate("/culture");
  };

  const handleBackQuestion = () => {
    if (progress === 0) return;
    setProgress((prevProgress) => {
      loadQuestion(prevProgress - 1);
      return Math.max(prevProgress - 1, 0);
    });

    setButtonStates({
      P1_A: false,
      P1_B: false,
      P2_A: false,
      P2_B: false,
    });
  };

  return (
    <div className="question">
      <Header images={["world_btn.svg", "wall_btn.svg", "culture_ul_btn.svg"]} />

      <div className="progress-bar">
        { <img src={bar_images[progress]} alt="目前进度" />}
      </div>

      <div className="back">
        <img src={back_icon} alt="回上一页" onClick={handleBack} />
      </div>

      <div className="backQuestion">
        <img
          src={last}
          alt="回上一题"
          onClick={handleBackQuestion}
          style={{ cursor: progress === 0 ? "not-allowed" : "pointer" }}
        />
      </div>

      <main className="content">
        <div className="row mb-4 P1">
          <h1 className="col-12">Q{progress + 1}: {question}</h1>
          <div className="col-6 P1_A">
            <button
              className={buttonStates.P1_A ? "button-selected" : "button-default"}
              onClick={() => handleClick("P1", "A")}
            >
              {splitSentence[0]}
            </button>
          </div>
          <div className="col-6 P1_B">
            <button
              className={buttonStates.P1_B ? "button-selected" : "button-default"}
              onClick={() => handleClick("P1", "B")}
            >
              {splitSentence[1]}
            </button>
          </div>
        </div>

        <div className="row P2">
          <h1
            className="col-12"
            style={{
              color: buttonStates.P1_A || buttonStates.P1_B ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
            }}
          >
            Q{progress + 1}: 呈上題，您認為另一玩家會如何選擇？
          </h1>
          <div className="col-6 P2_A">
            <button
              className={buttonStates.P2_A ? "button-selected" : "button-default"}
              onClick={() => handleClick("P2", "A")}
              disabled={!buttonStates.P1_A && !buttonStates.P1_B}
            >
              {splitSentence[0]}
            </button>
          </div>
          <div className="col-6 P2_B">
            <button
              className={buttonStates.P2_B ? "button-selected" : "button-default"}
              onClick={() => handleClick("P2", "B")}
              disabled={!buttonStates.P1_A && !buttonStates.P1_B}
            >
              {splitSentence[1]}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Question;
