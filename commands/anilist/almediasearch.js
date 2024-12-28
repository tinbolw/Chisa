const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const striptags = require('striptags');
const { AnilistRequest } = require(path.join(__dirname, '../../lib/test'));
const { BinaryEmbed } = require(path.join(__dirname, '../../lib/embed/common'));
const { searchMedia } = require(path.join(__dirname, '../../lib/api/anilist/searches'));

// https://stackoverflow.com/a/35467449
function HEXToVBColor(rrggbb) {
  var bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
  return parseInt(bbggrr, 16);
}

module.exports = {
  data: new SlashCommandBuilder()
  // todo convert to general anilist search
    .setName('almediasearch')
    .setDescription('Search for media using AniList.')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The type of the media')
        .setRequired(true)
        .setChoices([{ name: 'ANIME', value: 'Anime' }, { name: 'MANGA', value: 'Manga' }]),
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
    //editReply
    const searchType = interaction.options.getString('type');
    const searchTitle = interaction.options.getString('title');
    const searchNSFW = interaction.options.getBoolean('nsfw') ?? false;
    const request = new AnilistRequest();
    await request.request(searchType, { id: Number(searchTitle), isAdult: searchNSFW, type: searchType.toUpperCase() });
    const response = request.response;
    let description = striptags(response.description);
    let embedPayload = {
      title: response.title.english || response.title.romaji || response.title.native,
      description: description.substring(0, 257) + '...',
      url: response.siteUrl,
      image: { url: response.coverImage[Object.keys(response.coverImage)[Object.keys(response.coverImage).length - 2]] },
      color: HEXToVBColor(response.coverImage.color),
      footer: { text: `Fetched ${searchType.toUpperCase()} in ${request.timeElapsed} ms`, iconURL: 'https://cdn.discordapp.com/attachments/975191225340686377/1297388691458625639/icon.png' },
    }
    
    let expandedFields = [
      {name:'Status', value:response.status, inline:true},
      {name:'Format', value:response.format, inline:true},
      {name:'Popularity', value:response.popularity, inline:true},
      {name:'Mean Score', value:response.meanScore, inline:true},
      ...(response.episodes !== 1 && response.episodes)?[{ name: "Episodes", value: String(response.episodes), inline: true }]:[],
      ...response.episodes?[{ name: `${Math.floor(response.duration / 60) === 0 ? `Episode ` : ``}Duration`, value: `${Math.floor(response.duration / 60) === 0 ? `${response.duration} min` : `${Math.floor(response.duration / 60)} hr ${Math.floor(response.duration % 60)} min`}`, inline: true }] : [],
      // Manga
      ...response.chapters?[{name:'Chapters', value:String(response.chapters)}]:[],
      ...response.volumes?[{name:'Volumes', value:String(response.volumes)}]:[],
      {name:'Start Date', value:`${response.startDate.month}/${response.startDate.day}/${response.startDate.year}`, inline:true},
      ...(!response.endDate.month && !response.endDate.month && !response.endDate.month)?[]:[{name:'End Date', value:`${response.endDate.month}/${response.endDate.day}/${response.endDate.year}`, inline:true}]
    ]
    const collapsedEmbed = new EmbedBuilder(embedPayload);
    const expandedEmbed = new EmbedBuilder(
      {
        ...embedPayload,
        description: description.substring(0, 4097),
        fields: expandedFields
      }
    );
    const embed = new BinaryEmbed(interaction, collapsedEmbed, expandedEmbed, 'Expand', 'Collapse');
    await embed.init();
  },
  async autocomplete(interaction) {
    const nsfw = interaction.options.getBoolean('nsfw') ?? false;
    const mediaType = await interaction.options.getString('type');
    const mediaTitle = await interaction.options.getString('title');
    // todo possible ability for "choose media type" to clear itself when media type is selected
    const results = mediaType ? await searchMedia(mediaType.toUpperCase(), mediaTitle, nsfw) : ['Choose a media type first.'];
    await interaction.respond(results);
  }
}
