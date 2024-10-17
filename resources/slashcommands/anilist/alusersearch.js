const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const gqlr = require("graphql-request");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("alusersearch")
    .setDescription("Search for a user on AniList."),
  async execute(interaction) {
    const name = interaction.options._hoistedOptions[0].value;
    //TODO Allow searching by id instead of name?
    // AniList api slug
    const query = gqlr.gql`
    {
      User(search: "${name}") {
        name
        about
        siteUrl
        id
        statistics {
          anime {
            count
            minutesWatched
          }
          manga {
            count
          }
        }
        avatar {
          large
          medium
        }
      }
    }
    `;
    const response = await gqlr.request("https://graphql.anilist.co/", query)
      .then(async (response) => {
        return response;
      })
      .catch((err) => {
        const errorEmbed = new EmbedBuilder()
          .setTitle('Error:')
          .setDescription(`Error: ${err.response.status} ${err.response.errors[0].message}`);
        interaction.editReply({embeds: [errorEmbed]});
        return;
      });
      // object keys are the six extra entries when embed is expanded
    var fields = [
      {
      name: 'Animes Watched',
      value: `${response.User.statistics.anime.count}`,
      inline: true
    },
    {
      name: 'Total Minutes Watched',
      value: `${response.User.statistics.anime.minutesWatched}`,
      inline: true
    }, 
    {
      name: 'Mangas Read',
      value: `${response.User.statistics.manga.count}`,
      inline: true
    },
    {
      name: 'Favorites',
      value: `[Link](${response.User.siteUrl}/favorites)`,
      inline: true
    }
  ];
    // Regex formatting to remove html fragments from description
    const shortEmbed = new EmbedBuilder()
      .setTitle(response.User.name)
      .setDescription(response.User.about.replace(new RegExp("\<(.*?)\>", "g"), "").substr(0, 512) + "...")
      .setURL(response.User.siteUrl)
      .setImage(response.User.avatar.large);
    const longEmbed = new EmbedBuilder()
      .setTitle(response.User.name)
      .setDescription(response.User.about.replace(new RegExp("\<(.*?)\>", "g"), "").length > 4096? response.User.about.replace(new RegExp("\<(.*?)\>", "g"), "").substr(0, 4093) + '...' : response.User.about.replace(new RegExp("\<(.*?)\>", "g"), "").substr(0,4096))
      .setURL(response.User.siteUrl)
      .setImage(response.User.avatar.large)
      .setFields(fields);
    const expandButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("expand")
        .setLabel("More")
        .setStyle(ButtonStyle.Primary)
    );
    const shrinkButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("shrink")
        .setLabel("Less")
        .setStyle(ButtonStyle.Primary)
    );
    const reply = await interaction.editReply({
      embeds: [shortEmbed],
      components: [expandButton],
    });
    const filter = (filteredInteraction) =>
      (filteredInteraction.customId === 'expand' || filteredInteraction.customId === 'shrink') &&
      filteredInteraction.user.id === interaction.user.id;
    function generateButton() {
      reply
      .awaitMessageComponent({
        filter: filter,
        idle: 30000,
        componentType: 2,
      })
      .then(async (buttonInteraction) => {
        // only defers to ensure it works on slow phone
        await buttonInteraction.deferUpdate();
        buttonInteraction.editReply({
          embeds: [buttonInteraction.customId === 'shrink' ? shortEmbed : longEmbed],
          components: [buttonInteraction.customId === 'shrink' ? expandButton : shrinkButton],
        });
        generateButton();
        // catch idle
      }).catch((e) => {
        // prevents bot from stopping if reply was deleted
        if ((`${e}`).indexOf('idle') != -1) {
          interaction.editReply({
            components: []
          });
        } else {
          console.log('reply was deleted');
        }
      });
    }
    generateButton();
  },
};
