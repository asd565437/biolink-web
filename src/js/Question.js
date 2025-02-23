import "../css/Question.css";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { SocketContext, UserContext } from "../App"; // 引入全域 Socket 上下文
import Header from "./Header.js";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
let answerP1 = {}
let answerP2 = {}
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
  const [bothAnswered, setBothAnswered] = useState(false);

  const bar_images = [
    "/question/progress_bar_1.svg",
    "/question/progress_bar_2.svg",
    "/question/progress_bar_3.svg",
    "/question/progress_bar_4.svg",
    "/question/progress_bar_5.svg",
  ];

  // 监听 socket 事件，获取题目 ID
  useEffect(() => {
    if (!socket || !roomId) return;

    // 监听服务器返回的题目
    socket.on("question-ids", (ids) => {
      setQuestionIds(ids);
    });

    socket.on("both-answered", (data) => {
        setBothAnswered(true);
        console.log("答對題數："+data.totalCorrect)
        console.log("生成日期："+data.createdAt)
        console.log("bioId："+data.bio_id)
        console.log("培養員名字："+data.nicknames[data.players[0]]+"/"+data.nicknames[data.players[1]])
      return () => {
        socket.off("both-answered");
      };
    });

    window.addEventListener("beforeunload", () => {
      socket.emit("leave-room", roomId, userId.userId);
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

  useEffect(() => {
    if (bothAnswered) {
        navigate("/reward");
    }
}, [bothAnswered, navigate]);

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

    answerP1[progress] = buttonStates.P1_A ? "A" : "B";
    answerP2[progress] = buttonStates.P2_A ? "A" : "B";
    if (progress >= questionIds.length - 1) {
      console.log(userId.userId)
      socket.emit("submit_question", { roomId, userId: userId.userId, answers:{answerP1,answerP2} });
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
        <img src={"/question/back_btn.svg"} alt="回上一題" onClick={handleBackQuestion} />
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

        <img src={"/reward/check.png"} alt="確認答案" onClick={handleNextQuestion} />
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
