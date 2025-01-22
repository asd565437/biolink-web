const bcrypt = require('bcrypt');
const { Midjourney } = require('midjourney');
const fs = require('fs');
const axios = require('axios');
const { getDb } = require('./db');
const express = require('express');
const router = express.Router();


const client = new Midjourney({
  ServerId: '1319896292025045052', // 替换为你的 ServerId
  ChannelId: '1319896292624826441', // 替换为你的 ChannelId
  SalaiToken: 'MTMxOTg5NDk5NjI1MzY3MTQ4Nw.GTfQ_h.pLPTNYwakfRwk4-38LbMJfag1wz7PRVxNt2mDI', // 替换为你的 SalaiToken
  Debug: true,
  Ws: true,
});

// 下载图像到服务器
const downloadImage = async (url, filepath) => {
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

// 生图 API
router.post('/generate-image', async (req, res) => {
  const { prompt } = req.body;

  // 验证输入
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: '請提供有效的 prompt 文本' });
  }

  try {
    // 连接 Midjourney 客户端
    await client.Connect();

    // 调用 Imagine 方法生成图像
    const Imagine = await client.Imagine(prompt, (uri, progress) => {
      console.log(`生成進度：${progress}`);
    });

    if (Imagine?.uri) {
      // 下载图片到本地
      const outputDir = './output';
      const outputPath = `${outputDir}/${Date.now()}_image.jpg`;

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      await downloadImage(Imagine.uri, outputPath);

      // 返回图像 URL
      return res.status(200).json({
        message: '圖片生成成功',
        prompt,
        imageUrl: Imagine.uri, // MidJourney 的图像 URL
        localPath: outputPath, // 本地存储路径
      });
    } else {
      return res.status(500).json({ error: '生成圖片失敗' });
    }
  } catch (error) {
    console.error('生成圖片時出錯:', error);
    res.status(500).json({ error: '生成圖片時出錯', details: error.message });
  }
});

router.get('/data', async (req, res) => {
  const db = getDb();
  try {
    const bios = await db.query('SELECT * FROM bios');
    const players = await db.query('SELECT * FROM player');
    const questions = await db.query('SELECT * FROM question');

    res.json({
      players: players.rows,
      bios: bios.rows,
      questions: questions.rows
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
router.get('/bios', async (req, res) => {
  const db = getDb();
  try {
    const bios = await db.query('SELECT * FROM bios');
    res.json({
      bios: bios.rows
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

router.get('/friend', async (req, res) => {
  const db = getDb();
  try {
    const friends = await db.query('SELECT * FROM friend');
    res.json({
      friend: friends.rows
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});
// 注册新用户
router.post('/register', async (req, res) => {
  const { email, password, nickName } = req.body;

  // 输入验证
  if (!email || !password || !nickName) {
    return res.status(400).json({ error: '請填寫所有必填欄位' });
  }

  const db = getDb();
  try {
    // 检查用户是否存在
    const existingUser = await db.query('SELECT * FROM player WHERE account = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: '帳號已存在' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入用户数据
    const query = `
      INSERT INTO player (account, nickname, password)
      VALUES ($1, $2, $3);
    `;
    await db.query(query, [email, nickName, hashedPassword]);
    res.status(201).json({ message: '註冊成功' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 输入验证
  if (!email || !password) {
    return res.status(400).json({ error: '請輸入帳號密碼' });
  }

  const db = getDb();
  try {
    // 查询用户数据
    const result = await db.query('SELECT * FROM player WHERE account = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: '帳號不存在' });
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: '密碼錯誤' });
    }

    // 返回成功消息
    res.status(200).json({
      message: '登入成功',
      user: {
        account: user.account,
        nickname: user.nickname
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/question', async (req, res) => {
  const { question_id } = req.body;

  const db = getDb();
  try {
    // 查询用户数据
    const result = await db.query('SELECT * FROM questions WHERE question_id = $1', [question_id]);
    const question = result.rows[0];
    if (!question) {
      return res.status(404).json({ error: '問題不存在' });
    }

    // 返回成功消息
    res.status(200).json({
      message: '登入成功',
      question_list: {
        question: question.question,
        answers: question.answers
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
