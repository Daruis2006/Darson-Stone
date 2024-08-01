const fs = require('fs');
const fetch = require('node-fetch');

module.exports = {
  config: {
    name: "stats",
    aliases: ["stats","s"],
    version: "1.3",
    author: "pharouk",// please don't change the credit
    role: 0,
    shortDescription: {
      en: "Displays bot statistics."
    },
    category: "box chat",
    guide: {
      en: "Use {p}stats to display bot statistics."
    }
  },
  onStart: async function ({ api, event, usersData, threadsData }) {
    try {
      // Check if the message includes the command "stats"
      if (!event.body.toLowerCase().includes("stats")) {
        return;
      }

      const loadingMessage = "𝗪𝗔𝗜𝗧 𝗕𝗢𝗦𝗦 \n[🟢⚪🔵]";
      const loadingResponse = await api.sendMessage(loadingMessage, event.threadID);

      // Get users and threads
      const allUsers = await usersData.getAll();
      const allThreads = await threadsData.getAll();

      // Calculate uptime
      const uptimeInSeconds = process.uptime();
      const days = Math.floor(uptimeInSeconds / 86400);
      const hours = Math.floor((uptimeInSeconds % 86400) / 3600);
      const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
      const seconds = Math.floor(uptimeInSeconds % 60);
      const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // Get current date
      const currentDate = new Date();
      const day = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
      const date = currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const time = currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      // Image URL
      const imageLink = "https://i.ibb.co/DgbYC3n/image.jpg";
      let fileName;

      // Download the image
      try {
        const response = await fetch(imageLink);
        const buffer = await response.buffer();
        fileName = 'stats_image.jpg';
        fs.writeFileSync(fileName, buffer);
      } catch (imageError) {
        console.error("Failed to download image:", imageError);
        fileName = null;
      }

      // List of random quotes
      const quotes = [
        { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
        { quote: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
        { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
        { quote: "Get busy living or get busy dying.", author: "Stephen King" },
        { quote: "You have within you right now, everything you need to deal with whatever the world can throw at you.", author: "Brian Tracy" }
      ];

      // Randomly choose a quote
      const { quote, author } = quotes[Math.floor(Math.random() * quotes.length)];

      // Build the final message
      const messageBody = `𝗛𝗨𝗡𝗧𝗘𝗥»🛄 𝗦𝗧𝗔𝗧𝗦 \n__________________________\n` +
                          `📊 |𝗨𝗣𝗧𝗜𝗠𝗘:${uptimeString}\n_________________________\n` +
                          `📅 𝗖𝗨𝗥𝗥𝗘𝗡𝗧»𝗗𝗔𝗧𝗘: ${day}, ${date}\n____________________________\n` +
                          `🕒 𝗖𝗨𝗥𝗥𝗘𝗡𝗧»𝗧𝗜𝗠𝗘: ${time}\n______________________________\n` +
                          `👥 𝗧𝗢𝗧𝗔𝗟 𝗨𝗦𝗘𝗥: ${allUsers.length}\n_____________________________\n` +
                          `💬 𝗧𝗢𝗧𝗔𝗟 𝗧𝗛𝗥𝗘𝗔𝗗𝗦: ${allThreads.length}\n_______________________________\n` +
                          `💡 𝗥𝗔𝗡𝗗𝗢𝗠 𝗤𝗨𝗢𝗧𝗘:\n"${quote}" \n 𝗔𝗨𝗧𝗛𝗢𝗥: 👑${author}👑`;

      // Get the information of the user who triggered the command
      const senderID = event.senderID;
      const senderName = (await usersData.get(senderID)).name || "User";

      // Build the message with user mention
      const taggedMessage = {
        body: `𝗛𝗘𝗟𝗟𝗢 𝗕𝗢𝗦𝗦 :@${senderName}\n\n${messageBody}`,
        mentions: [{ tag: `@${senderName}`, id: senderID }]
      };

      // Add the image as an attachment if successfully downloaded
      if (fileName) {
        taggedMessage.attachment = fs.createReadStream(fileName);
      }

      // Send the final message
      await api.sendMessage(taggedMessage, event.threadID);

    } catch (error) {
      console.error("Error fetching statistics:", error);
      api.sendMessage("An error occurred while retrieving the statistics 💢", event.threadID);
    }
  }
}
