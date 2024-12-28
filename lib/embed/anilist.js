const { EmbedBuilder } = require('discord.js');
const striptags = require('striptags');

module.exports = {
  /**
   * 
   * @param {*} rawData 
   * @param {*} expanded 
   * @param {*} mediaType 
   * @returns 
   */
  createEmbed: function(rawData, expanded, mediaType) {
    const data = rawData.data;
    const timeElapsed = rawData.timeElapsed;
    if (data.status === 404) {
      return new EmbedBuilder()
        .setTitle('404')
        .setDescription('Not found.');
    }
    let description = striptags(data.description);
    description = `${description.substring(0, expanded ? 4097 : 257)}${expanded ? `` : `...`}`;
    const embed = new EmbedBuilder()
      .setTitle(data.title.english || data.title.romaji || data.title.native)
      .setDescription(description)
      .setURL(data.siteUrl)
      // in case extraLarge is null
      .setImage(data.coverImage[Object.keys(data.coverImage)[Object.keys(data.coverImage).length - 2]])
      .setColor(data.coverImage.color)
      // anilist icon
      .setFooter({ text: `Fetched in ${timeElapsed} ms | ${mediaType}`, iconURL: 'https://cdn.discordapp.com/attachments/975191225340686377/1297388691458625639/icon.png' });
      if (expanded) {
      //* due to the parsing requirements of nearly every field, assigning them dynamically is
      //* practically pointless due to the number of exceptions
      embed.addFields(
        { name: "Status", value: data.status.replaceAll('_', ' '), inline: true },
        { name: "Format", value: data.format.replaceAll('_', ' '), inline: true },
        { name: "Popularity", value: String(data.popularity), inline: true },
        // todo check if manga parsing works
        data.episodes?{ name: `${Math.floor(data.duration / 60) === 0 ? `Episode ` : ``}Duration`, value: `${Math.floor(data.duration / 60) === 0 ? `${data.duration} min` : `${Math.floor(data.duration / 60)} hr ${Math.floor(data.duration % 60)} min`}`, inline: true } : null,
        data.episodes !== 1?{ name: "Episodes", value: String(data.episodes), inline: true }:null,
        { name: "Mean Score", value: String(data.meanScore), inline: true },
        { name: "Start Date", value: `${data.startDate.month}/${data.startDate.day}/${data.startDate.year}`, inline: true },
        { name: "End Date", value: `${data.endDate.month}/${data.endDate.day}/${data.endDate.year}`, inline: true }
      );
    }
    return embed;
  }
}