// const { SlashCommandBuilder } = require('discord.js');
// const fs = require("fs");

// module.exports = {
//     data: new SlashCommandBuilder()
//       .setName('emojicollect')
//       .setDescription('Collect emojis'),
//     async execute (interaction) {
//       if (interaction.user.id != '266413889682407428') {
//         interaction.editReply('Insufficient permissions.');
//       } else {
//         const emoji = await interaction.guild.emojis.fetch();
//         fs.writeFileSync("emojis.json", JSON.stringify(emoji));
//         interaction.editReply('Done');
//       }
//     }
// }