const path = require("node:path");
const { SlashCommandBuilder, EmbedBuilder, ThumbnailBuilder } = require("discord.js");
const { fetchAnilist, createMediaQuery } = require(path.join(__dirname, "../../lib/anilist/test"));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anilist")
    .setDescription("AniList API")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("search AniList")
        .addStringOption((option) => 
          option
            .setName("type")
            .setDescription("the search type")
            .setRequired(true)
            .setChoices(
              {
                name: "ANIME",
                value: "anime",
              },
              {
                name: "MANGA",
                value: "manga",
              },
              {
                name: "CHARACTER",
                value: "character",
              },
              {
                name: "STAFF",
                value: "staff",
              },
              {
                name: "USER",
                value: "user",
              },
              {
                name: "STUDIO",
                value: "studio",
              },
            )
        )
        .addStringOption((option) => 
          option
            .setName("query")
            .setDescription("the search query")
            .setRequired(true)
        ),
    ),
  async execute(interaction) {
    /* 
    NSFW
     -> search for media with autocomplete

    create helper method to turn relevant fields of response into fields of embed
      specify key of the response, etc

    create two different embeds with the button to switch between them
    
    */

    // interaction.deferReply();
    const search = interaction.options.getString("query");
    const type = interaction.options.getString("type");

    const startTime = Date.now();
    const res = await fetchAnilist(createMediaQuery(search, type));

    const data = Object.values(res)[0];

    const title = data.title?.english ?? data.title?.romaji ?? data.title?.native;
    const name = data.name?.full ?? data.name?.native ?? data.name;

    const hasDescription = data.description ?? data.about;
    const hasImage = data.coverImage ?? data.image ?? data.avatar;

    // add color for embeds that have images
    const collapsedEmbed = {
      title: title ?? name,
      description: hasDescription ? (data.description ?? data.about).substring(0, 256) + "..." : null,
      url: data.siteUrl,
      footer : {
        text: `Fetched ${type.toUpperCase()} in ${Date.now() - startTime} ms`,
        iconURL: "https://cdn.discordapp.com/attachments/975191225340686377/1297388691458625639/icon.png"
      },
      thumbnail: {
        url: hasImage ? Object.values(data.coverImage ?? data.image ?? data.avatar)[0] : null
      }
    }

    const expandedEmbed = {
      ...collapsedEmbed,
      description: hasDescription ? (data.description ?? data.about).substring(0, 4096) + "..." : null,
    }

        // const expandedEmbed = new EmbedBuilder()
    //   .setColor() // average color of thumbnail from graphql api
    //   .setDescription()
    //   .setFields()
    //   .setFooter()
    //   .setImage() // difference between this and thumbnail?
    //   .setThumbnail()
    //   .setTimestamp() // what is this?
    //   .setTitle()
    //   .setURL()

    interaction.editReply({
      embeds: [collapsedEmbed]
    });
  }
}
