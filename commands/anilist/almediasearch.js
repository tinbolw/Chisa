const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
const striptags = require('striptags');
const { fetchMedia, searchMedia } = require('../../lib/anilistgql');

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
    const response = await interaction.editReply(generateReplyOptions());
    createCollector();

    function generateReplyOptions() {
      const embed = new EmbedBuilder()
        .setTitle(data.title.english)
        .setDescription(`${striptags(data.description).substring(0, expanded ? 4094 : 257)}${expanded ? `` : `...`}`)
        .setURL(data.siteUrl)
        //? not sure if extraLarge is available for all anime, but if not, use last entry in
        //? coverImage instead
        .setImage(data.coverImage.extraLarge)
        .setColor(data.coverImage.color)
        .setFooter({ text: `Fetched in ${timeElapsed} ms | ${mediaType}`, iconURL: 'https://cdn.discordapp.com/attachments/975191225340686377/1297388691458625639/icon.png' });
      if (expanded) {
        let fields = [];
        //* due to the parsing requirements of nearly every field, assigning them dynamically is
        //* practically pointless due to the number of exceptions
        fields.push({ name: "Status", value: data.status.replaceAll('_', ' '), inline: true });
        fields.push({ name: "Format", value: data.format.replaceAll('_', ' '), inline: true });
        fields.push({ name: "Popularity", value: String(data.popularity), inline: true });
        if (data.episodes) { // parse out fields for manga, for which they do not exist
          fields.push({
            name: `${Math.floor(data.duration / 60) == 0 ? `Episode ` : ``}Duration`, value: `${Math.floor(data.duration / 60) == 0 ? `${data.duration} min` : `${Math.floor(data.duration / 60)} hr ${Math.floor(data.duration % 60)} min`}`, inline: true
          });
          if (data.episodes != 1) fields.push({ name: "Episodes", value: String(data.episodes), inline: true });
        }
        fields.push({ name: "Mean Score", value: String(data.meanScore), inline: true });
        fields.push({ name: "Start Date", value: `${data.startDate.month}/${data.startDate.day}/${data.startDate.year}`, inline: true });
        fields.push({ name: "End Date", value: `${data.endDate.month}/${data.endDate.day}/${data.endDate.year}`, inline: true });
        embed.setFields(fields);
      }
      return { embeds: [embed], components: [generateButtonRow()] };
    }

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
          await confirmation.update(generateReplyOptions());
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
