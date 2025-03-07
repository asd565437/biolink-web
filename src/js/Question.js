import "../css/Question.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import { SocketContext, UserContext } from "../App"; // 引入全域 Socket 上下文
import Header from "./Header.js";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;
let answerP1 = new Array();
let answerP2 = new Array();

const Question = () => {
  const [nickName, setNickName] = useState();
  const { roomId } = useParams();
  const socket = useContext(SocketContext);
  const userId = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const friendId = location.state?.friendId || "未知用户"; // 避免 state 为空时报错

  const handleFriendName = async (friendId) => {
    try {
      console.log(friendId)
        const response = await axios.post(`${apiUrl}/api/get-friend-name`, {
            id: friendId,
        });
        setNickName(response.data.player?.nickName);
    } catch (error) {
        console.error("取得好友資訊失敗:", error);
        alert("請求失敗：" + (error.response?.data?.error || error.message));
    }
  };

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
  const [born, setBorn] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

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
    
    handleFriendName(friendId);
    
    // 监听服务器返回的题目
    socket.on("question-ids", (ids) => {
      setQuestionIds(ids);
    });

    socket.on("both-answered", (data) => {
      setBothAnswered(true);
      console.log("答對題數：" + data.totalCorrect)
      console.log("生成日期：" + data.createdAt)
      console.log("bioId：" + data.bio_id)
      console.log("培養員名字：" + data.nicknames[data.players[0]] + "/" + data.nicknames[data.players[1]])
      console.log("playerIds：" + data.players[0] + "/" + data.players[1])
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
    socket.on("grenarate_success", (URL) => {
      setShowOverlay(false); 
      console.log(URL)
      navigate("/reward", { state: { URL } }); // 30 秒後隱藏
    });
    // 发送请求获取题目 ID
    socket.emit("get-question-ids", roomId);

    return () => {
      socket.off("question-ids");
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (born) {
      setShowOverlay(true);
    }
  }, [born, navigate]);

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

    // if (question === "P2") {
    //   setIsMaskVisible(false);
    // }

  };

  useEffect(() => {
    // 當 P1 和 P2 都至少選擇了一個選項時，顯示遮罩
    if ((buttonStates.P1_A || buttonStates.P1_B) && (buttonStates.P2_A || buttonStates.P2_B)) {
      setIsMaskVisible(false);
    } else {
      setIsMaskVisible(true);
    }
  }, [buttonStates]); // 監聽 buttonStates 的變化
  

  const handleNextQuestion = async () => {
    if (!(buttonStates.P1_A || buttonStates.P1_B) || !(buttonStates.P2_A || buttonStates.P2_B)) {
      return;
    }
    
    answerP1[progress] = buttonStates.P1_A ? "A" : "B";
    answerP2[progress] = buttonStates.P2_A ? "A" : "B";

    if (progress >= questionIds.length - 1) {

      socket.emit("submit_question", { roomId, userId: userId.userId, answers: { answerP1, answerP2 } });
      setBorn(true);
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
      { showOverlay && 
      <div className="birth_overlay">
        <img src={"/question/question_wait.svg"} alt="等待一下" id="question_wait" />
        <div className="dot-container">
          <img src={"/question/dot.png"} alt="." id="dot1" />
          <img src={"/question/dot.png"} alt="." id="dot2" />
          <img src={"/question/dot.png"} alt="." id="dot3" />
        </div>
      </div>
      }

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
            style={{
              cursor:
                (buttonStates.P1_A || buttonStates.P1_B) &&
                  (buttonStates.P2_A || buttonStates.P2_B)
                  ? "pointer"
                  : "not-allowed",
            }}
          >
          </div>
        )}

        <img
          src={isMaskVisible ? "/question/uncheck.png" : (progress === 4 ? "/question/birth.png" : "/question/check1.png")}
          alt="確認答案"
          // onClick={handleNextQuestion}
          onClick={() => {
            if ((buttonStates.P1_A || buttonStates.P1_B) && (buttonStates.P2_A || buttonStates.P2_B)) {
              handleNextQuestion();
            }
          }}
        />

      </div>

      <main className="content">
        <div className="row row-question mb-4 P1">
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

        <div className="row row-question P2">
          <h1
            className="col-12"
            style={{
              color: buttonStates.P1_A || buttonStates.P1_B ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
            }}
          >
            Q{progress + 1}: 承上題，您認為{nickName}會如何選擇？
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
