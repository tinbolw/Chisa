const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get the avatar of a user')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('The target user.')
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user') ?? interaction.user;
    const avatarEmbed = new EmbedBuilder()
      .setImage(`${user.displayAvatarURL()}?size=2048`) // ? not sure if there is a way to get large size other than this
      .setTitle(user.tag);
    interaction.editReply({
      embeds: [avatarEmbed]
    });
  }
}
