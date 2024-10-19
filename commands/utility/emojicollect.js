const { SlashCommandBuilder } = require('discord.js');
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('emojicollect')
    .setDescription('Collect guild emojis'),
  async execute(interaction) {
    // hard coded permission for personal use
    if (interaction.user.id != '266413889682407428')
      return interaction.editReply('You mayn\'t do this!');
    const emoji = await interaction.guild.emojis.fetch();
    fs.writeFileSync("emojis.json", JSON.stringify(emoji));
    return interaction.editReply('Done');
  }
}