import fs from "fs";
import axios from "axios";
import { Midjourney } from "midjourney";

const downloadImage = async (url, filepath) => {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

const main = async () => {
  const client = new Midjourney({
    ServerId: "1319896292025045052", // 替换为你的 ServerId
    ChannelId: "1319896292624826441", // 替换为你的 ChannelId
    SalaiToken: "MTMxOTg5NDk5NjI1MzY3MTQ4Nw.GTfQ_h.pLPTNYwakfRwk4-38LbMJfag1wz7PRVxNt2mDI", // 替换为你的 SalaiToken
    Debug: true,
    Ws: true,
  });

  try {
    await client.Connect();

    const Imagine = await client.Imagine("A little pink elephant", (uri, progress) => {
      console.log("Imagine progress:", progress);
    });

    console.log("Imagine result:", Imagine);

    // 选择某一张图片进行放大处理
    const selectedIndex = 1; // 选择第 1 张图片（索引从 1 开始）
    const Upscale = await client.Upscale({
      index: selectedIndex,
      msgId: Imagine.id,
      hash: Imagine.hash,
      flags: Imagine.flags,
      loading: (uri, progress) => {
        console.log("Upscale progress:", progress);
      },
    });

    console.log("Upscale result:", Upscale);

    if (Upscale.uri) {
      const imageUrl = Upscale.uri;
      const outputPath = `./output/little_pink_elephant_${selectedIndex}.jpg`; // 保存单张图片

      // 确保输出目录存在
      if (!fs.existsSync("./output")) {
        fs.mkdirSync("./output");
      }

      console.log("Downloading image...");
      await downloadImage(imageUrl, outputPath);
      console.log(`Image saved to ${outputPath}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
