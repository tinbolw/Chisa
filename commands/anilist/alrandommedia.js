const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { randomMedia, generateMediaEmbed } = require('../../lib/anilistgql');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alrandommedia')
    .setDescription('Get a random media using AniList.')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The type of the media')
        .setRequired(true)
        .setChoices([{ name: 'anime', value: 'ANIME' }, { name: 'manga', value: 'MANGA' }]),
    ).addBooleanOption(option =>
      option.setName('nsfw')
      // likely will not add an option to search for only NSFW content.
        .setDescription('Whether or not to include NSFW content.'),
    ),
  async execute(interaction) {
    const mediaType = interaction.options.getString('type');
    const nsfw = interaction.options.getBoolean('nsfw') ?? false;
    const startTime = Date.now();
    const data = await randomMedia(mediaType, nsfw);
    const timeElapsed = Date.now() - startTime;
    interaction.editReply({ embeds: [generateMediaEmbed(data, false, timeElapsed, mediaType)] });
  },
};
