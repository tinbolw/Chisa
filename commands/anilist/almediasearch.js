const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const { fetchMedia, searchMedia, generateMediaEmbed } = require('../../lib/anilistgql');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('almediasearch')
    .setDescription('Search for media using AniList.')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The type of the media')
        .setRequired(true)
        .setChoices([{ name: 'anime', value: 'ANIME' }, { name: 'manga', value: 'MANGA' }]),
    )
    .addStringOption(option =>
      option.setName('title')
        .setDescription('The title of the media')
        .setRequired(true)
        .setAutocomplete(true),
    ),
  async execute(interaction) {
    var expanded = false;
    const mediaType = interaction.options.getString('type');
    const mediaTitle = interaction.options.getString('title');
    const startTime = Date.now();
    const data = await fetchMedia(mediaType, mediaTitle);
    const timeElapsed = Date.now() - startTime;
    // initialize embed and collector
    const response = await interaction.editReply({ embeds: [generateMediaEmbed(data, expanded, timeElapsed, mediaType)], components: [generateButtonRow()] });
    createCollector();

    function generateButtonRow() {
      const changeEmbedStateButton = new ButtonBuilder()
        .setCustomId('changeEmbedState')
        .setStyle(ButtonStyle.Primary)
        .setLabel(expanded ? 'Collapse' : 'Expand');
      return new ActionRowBuilder()
        .addComponents(changeEmbedStateButton);
    }

    async function createCollector() {
      const collectorFilter = i => i.user.id === interaction.user.id;
      try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
        if (confirmation.customId === 'changeEmbedState') {
          expanded = !expanded;
          await confirmation.update({ embeds: [generateMediaEmbed(data, expanded, timeElapsed, mediaType)], components: [generateButtonRow()] });
          createCollector();
        }
      } catch (e) {
        // timeout, usually
        await interaction.editReply({ components: [] });
      }
    }

  },
  async autocomplete(interaction) {
    const mediaType = await interaction.options.getString('type');
    const mediaTitle = await interaction.options.getString('title');
    // catch searching for nonexistent media type
    const results = mediaType ? await searchMedia(mediaType, mediaTitle) : ['Choose a media type first.'];
    await interaction.respond(
      results.map(choice => ({ name: choice, value: choice }))
    );
  }
};
