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
    .setName("almangasearch")
    .setDescription("Search for a manga using AniList."),
  async execute(interaction) {
    const name = interaction.options._hoistedOptions[0].value;
    //TODO Allow searching by id instead of name?
    // AniList api slug
    const query = gqlr.gql`
    {
      Media (search : "${name}" type:MANGA) {
        title {
          english
        }
        description
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        status
        format
        popularity
        coverImage {
          extraLarge
        }
        siteUrl
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
    var fields = [];
    var keys = Object.keys(response.Media);
    keys.splice(0,2);
    keys.splice(-2,2);
    // adding fields dynamically, formatting startDate => Start date
    for (let i of keys) {
      fields.push({
        name: (i.replace(/([A-Z])/g, " $1")).charAt(0).toUpperCase() + i.replace(/([A-Z])/g, " $1").slice(1),
        value: '',
        inline: true,
      });
    }
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    // setting field values, special cases for start/end dates and runtime
    fields.forEach(function (v, i) {
      if (i <= 1) {
        v.value = `${months[response.Media[keys[i]].month - 1] == undefined ? '' : months[response.Media[keys[i]].month - 1] + ' '}${response.Media.day == null ? '' : response.Media.day == null + ' '}${response.Media[keys[i]].year}`
      } else {
        v.value = `${response.Media[keys[i]]}`;
      }
    });
    // Regex formatting to remove html fragments from description
    const shortEmbed = new EmbedBuilder()
      .setTitle(response.Media.title.english)
      .setDescription(response.Media.description.replace(new RegExp("\<(.*?)\>", "g"), "").substr(0, 512) + "...")
      .setURL(response.Media.siteUrl)
      .setImage(response.Media.coverImage.extraLarge);
    const longEmbed = new EmbedBuilder()
      .setTitle(response.Media.title.english)
      .setDescription(response.Media.description.replace(new RegExp("\<(.*?)\>", "g"), "").length > 4096? response.Media.description.replace(new RegExp("\<(.*?)\>", "g"), "").substr(0, 4093) + '...' : response.Media.description.replace(new RegExp("\<(.*?)\>", "g"), "").substr(0,4096))
      .setURL(response.Media.siteUrl)
      .setImage(response.Media.coverImage.extraLarge)
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
