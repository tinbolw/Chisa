const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require("node:path");

module.exports = {
    data: new SlashCommandBuilder()
      .setName('collectstickers')
      .setDescription('Collect guild stickers'),
    async execute (interaction) {
      if (interaction.user.id != '266413889682407428') {
        interaction.editReply('You mayn\'t do this!');
      } else {
        const guild = await interaction.guild;
        if (guild.available) {
          const stickers = await interaction.guild.stickers.fetch();
  
          const backupFolderPath = path.join(__dirname, "../../backup/stickers");
          if (!fs.existsSync(backupFolderPath)) {
            fs.mkdirSync(backupFolderPath, {recursive: true});
          }
  
          fs.writeFileSync(path.join(backupFolderPath, `${guild.id}.json`), JSON.stringify(stickers));
          return interaction.editReply(`Backed up ${stickers.size} stickers.`);
        }
        return interaction.editReply("Failure");
      }
    }
}