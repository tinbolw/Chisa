const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");
const path = require("node:path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('collectemojis')
    .setDescription('Collect guild emojis'),
  async execute(interaction) {
    // hard coded permission for personal use
    if (interaction.user.id != '266413889682407428') {
      return interaction.editReply("You mayn\'t do this!");
    } else {
      const guild = await interaction.guild;
      if (guild.available) {
        const emojis = await interaction.guild.emojis.fetch();

        const backupFolderPath = path.join(__dirname, "../../backup/emojis");
        if (!fs.existsSync(backupFolderPath)) {
          fs.mkdirSync(backupFolderPath, {recursive: true});
        }

        fs.writeFileSync(path.join(backupFolderPath, `${guild.id}.json`), JSON.stringify(emojis));
        return interaction.editReply(`Backed up ${emojis.size} emojis.`);
      }
      return interaction.editReply("Failure");
    }
  }
}