// const { EmbedBuilder } = require('discord.js')
// const fs = require("fs");
// const moment = require("moment-timezone");

// module.exports = {
//   run: async function (message) {
//     var statsJSON = fs.readFileSync(__dirname + "/dailymessagestats.json");
//     statsJSON = new Map(JSON.parse(statsJSON));
//     // Define image and video extensions
//     const ext = [".mp4", ".webm", ".mov", ".mkv", ".gif"];
//     const imgExt = [".png", ".jpg", ".jpeg", ".IMG", ".HEIC", ".webp"]
//     let tally = [
//       message.content == "" ||
//         (checkURL(message.content) &&
//           ext.concat(imgExt).some((end) => message.content.includes(end)))
//         ? 0
//         : 1,
//       0,
//       0,
//       0,
//     ];
//     function checkURL(url) {
//       try {
//         return Boolean(new URL(url));
//       } catch (e) {
//         return false;
//       }
//     }
//     for (var i = 0; i < (message.attachments.size > 0 ? message.attachments.size : 1); i++) {
//       let attachment = Array.from(message.attachments.entries())?.[i]?.[1];
//       let type = attachment?.contentType === undefined ? '' : attachment.contentType;
//       // if (attachment === undefined && !checkURL(message.content)) return;
//       if (type.includes("video") || (checkURL(message.content) && message.content.includes(".mp4"))) {
//         tally[1]++;
//       } else if ((type.includes("image") && !type.includes("gif")) || (checkURL(message.content) && imgExt.some((end) => message.content.includes(end)))) {
//         tally[2]++;
//       } else if (
//         type == "image/gif" ||
//         (checkURL(message.content) && message.content.includes(".gif"))
//       ) {
//         tally[3]++;
//       }
//     }
//     var data = {};
//     for (let i in tally) {
//       let types = ["messages", "videos", "images", "gifs"];
//       data[types[i]] =
//         statsJSON.get(message.author.id)?.[types[i]] == undefined
//           ? 0 + tally[i]
//           : statsJSON.get(message.author.id)?.[types[i]] + tally[i];
//     }
//     statsJSON.set(message.author.id, data);
//     fs.writeFileSync(
//       __dirname + "/dailymessagestats.json",
//       JSON.stringify([...statsJSON])
//     );
//   },
//   embed: async function (guildmembers) {
//     var statsJSON = fs.readFileSync(__dirname + "/dailymessagestats.json");
//     statsJSON = new Map(JSON.parse(statsJSON));
//     var sorted = []
//     statsJSON.forEach((message, id) => {
//       sorted.push({
//         id: id,
//         total: Object.values(message).reduce((part, a) => part + a, 0)
//       });
//     });
//     sorted.sort((a, b) => { return b.total - a.total });
//     let fields = []
//     for (let i = 1; i < (statsJSON.size >= 6 ? 6 : statsJSON.size + 1); i++) fields.push({ name: `${i}. ${guildmembers.get(sorted[i - 1].id).user.tag}`, value: `${JSON.stringify(statsJSON.get(sorted[i - 1].id)).replaceAll(/["{}]/g, ' ').replaceAll(/[:]/g, ': ')}` });
//     let embed = new EmbedBuilder()
//       // set timezone to one 1 hour behind to prevent time from being one day off
//       .setTitle(`Message Stats for ${moment.tz('Pacific/Pitcairn').format('MM/DD')}`)
//       .setFields(fields);
//     return embed;
//   }
// };
