const fs = require("fs");
const mammoth = require("mammoth");

// 讀取 Word 檔案並轉換為 JSON
async function convertDocxToJson(inputPath, outputPath) {
    try {
        // 讀取 `.docx` 文件內容
        const { value } = await mammoth.extractRawText({ path: inputPath });

        // 分割內容並解析問題與選項
        const lines = value.split("\n").map(line => line.trim()).filter(line => line !== "");
        const questions = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const parts = line.split("？"); // 使用 `？` 來分割問題與選項
            if (parts.length === 2) {
                const question = parts[0] + "？";
                const options = parts[1].split(",").map(opt => opt.trim());
                questions.push({ question, options });
            }
        }

        // 轉換為 JSON 並儲存
        fs.writeFileSync(outputPath, JSON.stringify(questions, null, 4), "utf-8");
        console.log(`✅ 轉換成功！JSON 文件已儲存至：${outputPath}`);
    } catch (error) {
        console.error("❌ 轉換失敗:", error);
    }
}

// 指定輸入與輸出文件路徑
const inputDocx = "question.docx"; // 確保 .docx 文件放在同一個資料夾
const outputJson = "question.json";

// 執行轉換
convertDocxToJson(inputDocx, outputJson);
