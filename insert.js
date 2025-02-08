import { initializeApp } from "firebase/app";
import { getFirestore, writeBatch, doc } from "firebase/firestore";

// Firebase 配置
export const firebaseConfig = {
    apiKey: "AIzaSyBEBOvR5IsLUspq0AGF12wQWXA69-XpBxI",//你的API金鑰
    authDomain: "biolink-auth.firebaseapp.com",//你的專案ID.firebaseapp.com
    projectId: "biolink-auth",//你的專案ID
    storageBucket: "biolink-auth.firebasestorage.app",//你的專案ID.appspot.com
    messagingSenderId: "507593072695",//你的訊息發送者ID
    appId: "1:507593072695:web:d6e8d53729083bc7d91fb2"//你的應用程式ID
  };
// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 批量插入問答數據
const questions =[
  {
      "question": "面對搞笑短片，您更喜歡？",
      "options": [
          "迷因剪輯",
          "實境惡搞"
      ]
  },
  {
      "question": "如果能成為超能力者，您希望能？",
      "options": [
          "瞬間傳送",
          "隱身"
      ]
  },
  {
      "question": "假如世界上只剩下兩種動物，您會選擇養？",
      "options": [
          "邊境牧羊犬",
          "哈士奇"
      ]
  },
  {
      "question": "如果只能收集一種物品，您會選？",
      "options": [
          "可愛的聖誕裝飾",
          "特別設計的陶器"
      ]
  },
  {
      "question": "在有趣的影片中，您更想模仿？",
      "options": [
          "搞笑表演",
          "雙人合作遊戲"
      ]
  },
  {
      "question": "如果參加趣味比賽，您會更想？",
      "options": [
          "扮成聖誕老人",
          "模仿電影角色"
      ]
  },
  {
      "question": "如果搞笑影片的主角是您，您會更喜歡哪種情節？",
      "options": [
          "被整蠱的搞笑情節",
          "巧妙的幽默回擊"
      ]
  },
  {
      "question": "如果要參加拍攝挑戰，您會選？",
      "options": [
          "一天內完成100個挑戰",
          "完成最荒謬的造型拍攝"
      ]
  },
  {
      "question": "您更喜歡聽別人講的？",
      "options": [
          "職場出糗故事",
          "日常生活尷尬事"
      ]
  },
  {
      "question": "您更會因為什麼笑到停不下來？",
      "options": [
          "動物的可愛反應",
          "人類的笨拙行為"
      ]
  },
  {
      "question": "面對親密朋友的搞笑舉動，您會選擇？",
      "options": [
          "默默記錄下來",
          "直接加入搞笑"
      ]
  },
  {
      "question": "如果能參加一次特殊活動，您更希望？",
      "options": [
          "主持一場大笑派對",
          "成為惡作劇計畫的一部分"
      ]
  },
  {
      "question": "如果只能用表情包來溝通，您會選擇？",
      "options": [
          "萌系表情包",
          "沙雕表情包"
      ]
  },
  {
      "question": "面對有趣的選項，您更想拍？",
      "options": [
          "極限挑戰影片",
          "迷因搞笑影片"
      ]
  },
  {
      "question": "您會選擇參加？",
      "options": [
          "只有動物參與的嘉年華",
          "只有美食的競賽活動"
      ]
  },
  {
      "question": "如果有機會穿越成搞笑角色，您會？",
      "options": [
          "扮演被捉弄的倒楣鬼",
          "成為出其不意的惡作劇大師"
      ]
  },
  {
      "question": "在笑話比拼中，您更喜歡？",
      "options": [
          "冷笑話挑戰",
          "反應慢半拍的笑點"
      ]
  },
  {
      "question": "假如生活中突然發生有趣事，您更會？",
      "options": [
          "立即分享給朋友",
          "默默回味自己偷笑"
      ]
  },
  {
      "question": "面對有趣的生活細節，您會更常？",
      "options": [
          "寫下有趣的點滴",
          "拍成短片分享"
      ]
  },
  {
      "question": "如果只能和一人分享秘密，您會選？",
      "options": [
          "最好的朋友",
          "愛人"
      ]
  },
  {
      "question": "在感情中，您更重視？",
      "options": [
          "信任",
          "浪漫"
      ]
  },
  {
      "question": "假如戀愛出現爭執，您更希望？",
      "options": [
          "及時溝通化解",
          "給彼此時間冷靜"
      ]
  },
  {
      "question": "遇到矛盾時，您更想要？",
      "options": [
          "理性解釋",
          "直接擁抱和解"
      ]
  },
  {
      "question": "如果發現對方有可疑行為，您會？",
      "options": [
          "試探性地詢問",
          "暗中觀察"
      ]
  },
  {
      "question": "假如伴侶偏好不合，您更願意？",
      "options": [
          "彼此退讓一半",
          "固守自己原則"
      ]
  },
  {
      "question": "假如情侶喜好不同，您更會？",
      "options": [
          "嘗試接受彼此不同",
          "尋找共同興趣"
      ]
  },
  {
      "question": "面對爭執，您會更先？",
      "options": [
          "冷靜說出自己的感受",
          "觀察對方反應再說"
      ]
  },
  {
      "question": "如果伴侶送了不實用的禮物，您會？",
      "options": [
          "默默接受",
          "開心但稍作建議"
      ]
  },
  {
      "question": "假如伴侶對您不重視，您更可能？",
      "options": [
          "直接提出不滿",
          "默默觀察變化"
      ]
  }
]

const batch = writeBatch(db);

questions.forEach((item, index) => {
  const questionRef = doc(db, "question", `${index + 1}`);
  batch.set(questionRef, item);
});

batch.commit()
  .then(() => console.log("Batch insert successful!"))
  .catch(error => console.error("Batch insert failed:", error));