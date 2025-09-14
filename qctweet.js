const axios = require("axios");

module.exports = async (sock, msg, args, { isOwner }) => {
  const name = args[0];
  const tweetText = args.slice(1, -1).join(" ");
  const username = args[args.length - 1];

  if (!name || !tweetText || !username) {
    return sock.sendMessage(msg.from, {
      text: "⚠️ Format salah!\nContoh: .qctweet Ditzz \"Jangan terlalu berharap\" Ditzx"
    }, { quoted: msg });
  }

  try {
    await sock.sendMessage(msg.from, { react: { text: "⏳", key: msg.key } });

    const url = `https://api.siputzx.my.id/api/m/tweet?profile=https%3A%2F%2Ffiles.catbox.moe%2Fr2oyr8.png&name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&tweet=${encodeURIComponent(tweetText)}&image=null&theme=dark&retweets=16000&quotes=1500&likes=532000&client=Twitter%20for%20iPhone`;

    const response = await axios.get(url, { responseType: "arraybuffer" });

    await sock.sendMessage(
      msg.from,
      {
        image: Buffer.from(response.data, "binary"),
        caption: `🐦 Tweet dari ${name} (@${username})`
      },
      { quoted: msg }
    );

    await sock.sendMessage(msg.from, { react: { text: "✅", key: msg.key } });

  } catch (err) {
    console.error("❌ Error di plugin qctweet:", err.message);
    await sock.sendMessage(msg.from, { react: { text: "❌", key: msg.key } });
    await sock.sendMessage(msg.from, {
      text: "⚠️ Gagal generate tweet, coba lagi!"
    }, { quoted: msg });
  }
};