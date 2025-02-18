const admin = require("firebase-admin");

// 初始化 Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "biolink-auth.firebaseapp.com", // 替換為你的 Firebase 專案 ID
});

const db = admin.firestore();

// 要存入 Firestore 的資料
const data = {
  bio_id: "",         // Bio Number ID，請確保這是唯一識別碼
  bio_name: "",       // Bio 名稱
  trainer_name: "",   // 訓練員名稱
  birth: "",          // 出生日期
  imageURL: "",       // 圖片 URL
  correctCount: ""    // 修正後的 correctCount
};

// 存入 Firestore（假設 collection 名為 "users"）
db.collection("bio")
  .add(data)
  .then((docRef) => {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });
