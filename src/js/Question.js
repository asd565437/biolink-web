import "../css/Question.css";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { SocketContext, UserContext } from "../App"; // 引入全域 Socket 上下文
import Header from "./Header.js";
import progress_bar_1 from "../question/progress_bar_1.svg";
import progress_bar_2 from "../question/progress_bar_2.svg";
import progress_bar_3 from "../question/progress_bar_3.svg";
import progress_bar_4 from "../question/progress_bar_4.svg";
import progress_bar_5 from "../question/progress_bar_5.svg";
import back_icon from "../question/back_btn.svg";
import check from "../reward/check.png";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

const Question = () => {
  const { roomId } = useParams();
  const socket = useContext(SocketContext);
  const userId = useContext(UserContext);
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
  const [questionIds, setQuestionIds] = useState([]);

  const bar_images = [
    progress_bar_1,
    progress_bar_2,
    progress_bar_3,
    progress_bar_4,
    progress_bar_5,
  ];

  // 监听 socket 事件，获取题目 ID
  useEffect(() => {
    if (!socket || !roomId) return;

    // 监听服务器返回的题目
    socket.on("question-ids", (ids) => {
      setQuestionIds(ids);
    });

    window.addEventListener("beforeunload", () => {
      socket.emit("leave-room", roomId , userId.userId);
  });
  socket.on("room-left", (roomId) => {
    console.log(`Successfully left room: ${roomId}`);
});
    // 发送请求获取题目 ID
    socket.emit("get-question-ids", roomId);

    return () => {
      socket.off("question-ids");
    };
  }, [socket, roomId]);

  // ✅ 当 questionIds 更新后，再加载第一道题
  useEffect(() => {
    if (questionIds.length > 0) {
      loadQuestion(0);
    }
  }, [questionIds]);

  const loadQuestion = async (currentProgress) => {
    if (questionIds.length === 0 || currentProgress >= questionIds.length) return;

    try {
      const response = await axios.post(`${apiUrl}/api/question`, {
        question_id: questionIds[currentProgress],
      });

      setQuestion(response.data.question.question);
      setSplitSentence(response.data.question.answers.split(", "));
    } catch (error) {
      console.error("获取问题失败：", error);
      alert("获取问题失败，请稍后再试！");
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
    if (progress >= questionIds.length - 1) {
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
        <img src={back_icon} alt="回上一題" onClick={handleBackQuestion} />
      </div>

      <div className="checkAnswer">
        {isMaskVisible && (
          <div
            className="mask"
            style={{
              backgroundColor:
                (buttonStates.P1_A || buttonStates.P1_B) &&
                  (buttonStates.P2_A || buttonStates.P2_B)
                  ? "rgba(0, 0, 0, 0)"
                  : "rgba(0, 0, 0, 0.5)",
              cursor:
                (buttonStates.P1_A || buttonStates.P1_B) &&
                  (buttonStates.P2_A || buttonStates.P2_B)
                  ? "pointer"
                  : "not-allowed",
              borderRadius: "60px",
            }}
          ></div>
        )}

        <img src={check} alt="確認答案" onClick={handleNextQuestion} />
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
