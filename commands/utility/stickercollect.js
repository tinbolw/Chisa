const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
      .setName('stickercollect')
      .setDescription('Collect guild stickers'),
    async execute (interaction) {
      if (interaction.user.id != '266413889682407428') {
        interaction.editReply('You mayn\'t do this!');
      } else {
        const stickers = await interaction.guild.stickers.fetch();
        fs.writeFileSync("stickers.json", JSON.stringify(stickers));
        interaction.editReply('Done');
      }
    }
}