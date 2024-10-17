const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// TODO IF TAG DISCRIMINATOR DOES NOT EXIST, DO NOT INCLUDE

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get avatar of a user'),  
  async execute (interaction) {
    const args = interaction.options._hoistedOptions;
    let user = args.length == 0 ? interaction.user : args[0].user;
    const avatarEmbed = new EmbedBuilder()
      .setImage(`${user.displayAvatarURL()}?size=2048`)
      .setTitle(user.tag);
    interaction.editReply({
      embeds: [avatarEmbed]
    });
  }
}
