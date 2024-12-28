const { SlashCommandBuilder } = require('discord.js');
const path = require('node:path');
const { searchMedia } = require(path.join(__dirname, '../../lib/api/anilist/searches'));
const { fetchMedia } = require(path.join(__dirname, '../../lib/api/anilist/fetches'));
const { createEmbed } = require(path.join(__dirname, '../../lib/embed/anilist'));
const { binaryActionRow, binaryCollector } = require(path.join(__dirname, '../../lib/embed/common'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('almediasearchold')
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
    const searchType = interaction.options.getString('type');
    const searchTitle = interaction.options.getString('title');
    const searchNSFW = interaction.options.getBoolean('nsfw') ?? false;
    const mediaData = await fetchMedia(searchType, searchTitle, searchNSFW);
    const embed = await createEmbed(mediaData, false, searchType);
    const expandedEmbed = await createEmbed(mediaData, true, searchType);
    const actionRow = binaryActionRow(false, 'Collapse', 'Expand');
    const expandedActionRow = binaryActionRow(true, 'Collapse', 'Expand');
    await interaction.editReply({embeds: [embed], components:[actionRow]});
    binaryCollector(interaction, false, {embeds:[embed], components:[actionRow]}, {embeds:[expandedEmbed], components:[expandedActionRow]});
    // await createEmbedHandler(interaction);
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
