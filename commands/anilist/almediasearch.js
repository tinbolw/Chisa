const { SlashCommandBuilder } = require('discord.js');
const { fetchMedia, searchMedia } = require('../../lib/api/anilistgql');
const { generateMediaEmbed, generateButtonRow } = require('../../lib/embed/anilistEmbeds');

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
    )
    .addBooleanOption(option =>
      option.setName('nsfw')
        .setDescription('Whether or not to include NSFW content.'),
    ),
  async execute(interaction) {
    let expanded = false;
    const nsfw = interaction.options.getBoolean('nsfw') ?? false;
    const mediaType = interaction.options.getString('type');
    const mediaTitle = interaction.options.getString('title');
    const fetchData = await fetchMedia(mediaType, mediaTitle, nsfw);
    const data = fetchData.data;
    // initialize embed and collector
    const response = await interaction.editReply({ embeds: [generateMediaEmbed(data, expanded, fetchData.timeElapsed, mediaType)], components: data.status === 404 ? null : [generateButtonRow(expanded)] });
    if (data.status !== 404) await createCollector();
// todo move to lib
    async function createCollector() {
      const collectorFilter = i => i.user.id === interaction.user.id;
      try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
        if (confirmation.customId === 'changeEmbedState') {
          expanded = !expanded;
          await confirmation.update({ embeds: [generateMediaEmbed(data, expanded, fetchData.timeElapsed, mediaType)], components: [generateButtonRow(expanded)] });
          await createCollector();
        }
      } catch (err) {
        if (err.message === "Collector received no interactions before ending with reason: time") { // collector timeout
          await interaction.editReply({ components: [] });
        } else {
          console.error(err);
        }
      }
    }
  },
  async autocomplete(interaction) {
    const nsfw = interaction.options.getBoolean('nsfw') ?? false;
    const mediaType = await interaction.options.getString('type');
    const mediaTitle = await interaction.options.getString('title');
    // catch searching for null media type
    // todo possible ability for "choose media type" to clear itself when media type is selected
    const results = mediaType ? await searchMedia(mediaType, mediaTitle, nsfw) : ['Choose a media type first.'];
    await interaction.respond(
      results.map(choice => ({ name: choice, value: choice }))
    );
  }
};
