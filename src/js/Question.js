import "../css/Question.css";
import { useNavigate,useParams } from "react-router-dom";
import React, { useEffect, useState,useContext } from "react";
import { SocketContext, UserContext } from "../App";
import Header from "./Header.js";
import back_icon from "../question/back_btn.svg";
import check from "../question/check_answer.svg";

const apiUrl = process.env.REACT_APP_API_URL;
const numbers = Array.from({ length: 251 }, (_, i) => i + 1);
for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
}
const question_ids = numbers.slice(0, 5);

const Question = () => {
  const { roomId } = useParams();
  console.log(roomId)
  const socket = useContext(SocketContext);
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
    if (!socket || !roomId) return;

    socket.on("joined-room", ({ userId }) => {
        console.log(`${userId} 加入了房间 ${roomId}`);
    });

    return () => {
        socket.off("joined-room");
    };

}, [socket, roomId]);
  useEffect(() => {
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
        setQuestion(data.question.question);
        setSplitSentence(data.question.answers.split(", "));
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

  const handleClick = (question, option) => {
    setButtonStates((prevState) => {
      const newState = { ...prevState };

      if (question === "P1") {
        newState.P1_A = option === "A" ? !prevState.P1_A : false;
        newState.P1_B = option === "B" ? !prevState.P1_B : false;
      }

      if (question === "P2") {
        newState.P2_A = option === "A" ? !prevState.P2_A : false;
        newState.P2_B = option === "B" ? !prevState.P2_B : false;
      }

      return newState;
    });

    if (question === "P2") {
      setIsMaskVisible(false);
    }
  };

  const handleNextQuestion = async () => {
    if (progress >= question_ids.length - 1) {
      navigate("/reward");
      return;
    }

    const newProgress = progress + 1;
    await loadQuestion(newProgress);
    setProgress(newProgress);

    setButtonStates({
      P1_A: false,
      P1_B: false,
      P2_A: false,
      P2_B: false,
    });

    setIsMaskVisible(true);
  };

  const handleBackQuestion = async () => {
    if (progress === 0) {
      navigate("/connect");
      return;
    }

    const newProgress = progress - 1;
    await loadQuestion(newProgress);
    setProgress(newProgress);

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
        <img src={bar_images[progress]} alt="目前進度" />
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
            Q{progress + 1}: 承上題，您認為另一玩家會如何選擇？
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
