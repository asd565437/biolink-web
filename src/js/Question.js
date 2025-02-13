import "../css/Question.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "./Header.js";
import back_icon from "../question/back_btn.svg";
import check from "../question/check_answer.svg";
const apiUrl = process.env.REACT_APP_API_URL;
const numbers = Array.from({ length: 251 }, (_, i) => i + 1); // 生成 1~30 的数组
for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]]; // 交换
}
const question_ids = numbers.slice(0, 5); // 取前 5 个
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
  const [isMaskVisible, setIsMaskVisible] = useState(true);

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
      const response = await fetch(`${apiUrl}/api/question`, {
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

  const handleClick = async (question, option) => {
    setButtonStates((prevState) => {
      const newState = { ...prevState };

      // 确保P1_A和P1_B互斥
      if (question === "P1") {
        if (option === "A") {
          newState.P1_A = !prevState.P1_A;  // 切换P1_A的状态
          newState.P1_B = false;  // 如果P1_A被选中，P1_B设为默认
        } else if (option === "B") {
          newState.P1_B = !prevState.P1_B;  // 切换P1_B的状态
          newState.P1_A = false;  // 如果P1_B被选中，P1_A设为默认
        }
      }

      if (question === "P2") {
        if (option === "A") {
          newState.P2_A = !prevState.P2_A;  // 切换P2_A的状态
          newState.P2_B = false;  // 如果P2_A被选中，P2_B设为默认
        } else if (option === "B") {
          newState.P2_B = !prevState.P2_B;  // 切换P2_B的状态
          newState.P2_A = false;  // 如果P2_B被选中，P2_A设为默认
        }
      }

      return newState;
    });

    if (!(buttonStates.P1_A || buttonStates.P1_B)) {
      setButtonStates((prevState) => ({
        ...prevState,
        P2_A: false,
        P2_B: false,
      }));
    }

    if (!(buttonStates.P2_A || buttonStates.P2_B)) {
      setIsMaskVisible(true);
    }

    if (question === "P2") {
      setIsMaskVisible(false);
    }
  };

  const handleNextQuestion = () => {
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

    setIsMaskVisible(true);
  };

  const handleBack = () => {
    navigate("/connect");
  };

  const handleBackQuestion = () => {
    if (progress === 0) {
      handleBack();
      return;
    }

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

    setIsMaskVisible(true);
  };

  return (
    <div className="question">
      <Header images={["world_btn.svg", "wall_btn.svg", "culture_ul_btn.svg"]} />

      <div className="progress-bar">
        {<img src={bar_images[progress]} alt="目前进度" />}
      </div>

      <div className="back">
        <img
          src={back_icon}
          alt="回上一題"
          onClick={handleBackQuestion}
        />
      </div>

      <div className="checkAnswer">
        {isMaskVisible && (
          <div
            className="mask"
            style={{
              backgroundColor:
                (buttonStates.P1_A || buttonStates.P1_B) && (buttonStates.P2_A || buttonStates.P2_B)
                  ? "rgba(0, 0, 0, 0)"
                  : "rgba(0, 0, 0, 0.5)",
              cursor:
                (buttonStates.P1_A || buttonStates.P1_B) && (buttonStates.P2_A || buttonStates.P2_B)
                  ? "pointer" : "not-allowed",
              borderRadius: "60px",
            }}
          ></div>
        )}

        <img
          src={check}
          alt="確認答案"
          onClick={handleNextQuestion}
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
