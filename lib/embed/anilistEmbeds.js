const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const striptags = require('striptags');

module.exports = {
  generateMediaEmbed: function (data, expanded, timeElapsed, mediaType) {
    // const notfoundEmbed = new EmbedBuilder()
    //   .setTitle('404')
    //   .setDescription('Not found.');
    const embed = new EmbedBuilder()
    // title precedence: english => romaji => native
      .setTitle(data.title.english || data.title.romaji || data.title.native)
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
    return embed;
  },
  generateButtonRow: function (expanded) {
    const changeEmbedStateButton = new ButtonBuilder()
      .setCustomId('changeEmbedState')
      .setStyle(ButtonStyle.Primary)
      .setLabel(expanded ? 'Collapse' : 'Expand');
    return new ActionRowBuilder()
      .addComponents(changeEmbedStateButton);
  }
}