const { SlashCommandBuilder } = require('discord.js');
const { randomMedia } = require('../../lib/api/anilistgql');
const { generateMediaEmbed, generateButtonRow } = require('../../lib/embed/anilistEmbeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alrandommedia')
    .setDescription('Get a random media using AniList.')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The type of the media')
        .setRequired(true)
        .setChoices([{ name: 'anime', value: 'ANIME' }, { name: 'manga', value: 'MANGA' }]),
    )
    .addBooleanOption(option =>
      option.setName('nsfw')
        // likely will not add an option to search for only NSFW content.
        .setDescription('Whether or not to include NSFW content.'),
    ),
  async execute(interaction) {
    var expanded = false;
    const mediaType = interaction.options.getString('type');
    const nsfw = interaction.options.getBoolean('nsfw') ?? false;
    const fetchData = await randomMedia(mediaType, nsfw);
    const data = fetchData.data;
    const response = await interaction.editReply({ embeds: [generateMediaEmbed(data, false, fetchData.timeElapsed, mediaType)], components: [generateButtonRow(expanded)] });
    createCollector();

    async function createCollector() {
      const collectorFilter = i => i.user.id === interaction.user.id;
      try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
        if (confirmation.customId === 'changeEmbedState') {
          expanded = !expanded;
          await confirmation.update({ embeds: [generateMediaEmbed(data, expanded, fetchData.timeElapsed, mediaType)], components: [generateButtonRow(expanded)] });
          createCollector();
        }
      } catch (e) {
        // timeout, usually
        await interaction.editReply({ components: [] });
      }
    }
  },
};
