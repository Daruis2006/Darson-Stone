const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ 🐐 | 𝗠𝗜-😇 ]"; // changing this wont change the goatbot V2 of list cmd it is just a decoyy

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "NTKhang | Aesther", // original author Kshitiz 
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `[💬»𝗠𝗜]\n[𝖬𝖺 𝗅𝗂𝗌𝗍𝖾 𝖺̀ 𝗏𝗈𝗍𝗋𝖾 𝖽𝗂𝗌𝗉𝗈𝗌𝗂𝗍𝗂𝗈𝗇]\n┏━━━━━━━━━┓`// rep𝙡ace with your name 

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += ` \n✦【 ${category.toUpperCase()} 】✦`;
const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 3).map((item) => `\n${item}|`);
            msg += ` ${cmds.join(" ".repeat(Math.max(1, 10 - cmds.join("").length)))}`;
          }

          msg += ``;
        }
      });

      const totalCommands = commands.size;
      msg += `\n\n🔖𝗧𝗢𝗧𝗔𝗟 𝗖𝗺𝗱 [${totalCommands}📑]\n\n𝖣𝖠𝖱𝖨𝖴𝖲:\n[𝗠𝗜]\n\n 𝖲𝗂 𝗏𝗈𝗎𝗌 𝗋𝖾𝗇𝖼𝗈𝗇𝗍𝗋𝖾𝗓 𝗎𝗇 𝗊𝗎𝖾𝗅𝖼𝗈𝗇𝗊𝗎𝖾 𝗉𝗋𝗈𝖻𝗅𝖾̀𝗆𝖾, 𝗏𝖾𝗎𝗂𝗅𝗅𝖾𝗓 𝖼𝗈𝗇𝗍𝖺𝖼𝗍𝖾𝗋 𝗆𝗈𝗇 𝗆𝖺𝗂̂𝗍𝗋𝖾.\ncallad]`;
      msg += ``;
      msg += ``; // its not decoy so change it if you want 

      const helpListImages = [
"https://i.ibb.co/FwS98Hn/image.jpg",
 "https://i.ibb.co/Hg2xPCj/image.jpg",     
  "https://i.ibb.co/TB64hhJ/image.jpg",
   "https://i.ibb.co/BBzvzck/image.jpg" ];

      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage),
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `𝗡𝗔𝗠𝗘\n────────────\n〉[ ${configCommand.name}]\[𝗜𝗡𝗙𝗢]\n--------------------------------------\n〉[𝘥𝘦𝘴𝘤𝘳𝘪𝘱𝘵𝘪𝘰𝘯]:\n▶︎${longDescription}\n〉🌐[𝘖𝘵𝘩𝘦𝘳-𝘯𝘢𝘮𝘦𝘴]:\n▶︎${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"} Other names in your group: Do not have\n〉[𝘝𝘦𝘳𝘴𝘪𝘰𝘯]:\n▶︎${configCommand.version || "1.0"}\n〉[𝘙𝘰𝘭𝘦]:\n▶︎${roleText}\n〉𝘛𝘪𝘮𝘦 𝘱𝘦𝘳 𝘤𝘰𝘮𝘮𝘢𝘯𝘥:\n ▶︎${configCommand.countDown || 1}s〉[𝘈𝘶𝘵𝘩𝘰𝘳]:\n▶︎${author}\𝗨𝗦𝗔𝗚𝗘\n────────────\n▶︎ ${usage}\n━━━━━━━━━━━━\n𝗛𝗨𝗡𝗧𝗘𝗥 𝗟𝗜𝗡𝗘»📑`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
}
