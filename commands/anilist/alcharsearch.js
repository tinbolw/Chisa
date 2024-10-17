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
    .setName("alcharsearch")
    .setDescription("Search for a character using AniList."),
  async execute(interaction) {
    
    const name = interaction.options._hoistedOptions[0].value;
    async function search(name, more) {
      const query = gqlr.gql`
    {
      Character (search : "${name}") {
        name {
          full
        }
        description
        gender
        dateOfBirth {
          year
          month
          day
        }
        age
        bloodType
        favourites
        siteUrl
        image {
          large
        }
      }
    }
    `;
      return gqlr
        .request("https://graphql.anilist.co/", query)
        .then((response) => {
          // Spoiler formatting and length shortening
          var description = response.Character.description.replace(
            /~!/g,
            "SPOILER: ||"
          );
          
          description = description.replace(new RegExp("\<(.*?)\>", "g"), "");
          description = description.replace(/!~/g, "||");
          if (description.length > 4096) {
            // If description is trimmed mid spoiler, spoiler is shown
            // Added || to end to prevent, but might be worth looking into better method
            description = description.substr(0, 4091);
            description += "||...";
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
          var embedOptions = {
            url: response.Character.siteUrl,
            title: response.Character.name.full,
            description: description.substr(0, 507) + "...||",
            image: {
              url: response.Character.image.large,
            },
          };
          if (more) {
            embedOptions = {
              url: response.Character.siteUrl,
              title: response.Character.name.full,
              description: ``,
              fields: [
                {
                  name: "Gender",
                  value: ``,
                  inline: true,
                },
                {
                  name: "Birthday",
                  value: ``,
                  inline: true,
                },
                {
                  name: "Age\n",
                  value: ``,
                  inline: true,
                },
                {
                  name: "Blood Type",
                  value: ``,
                  inline: true,
                },
                {
                  name: "Favourites",
                  value: ``,
                  inline: true,
                },
              ],
              image: {
                url: response.Character.image.large,
              },
            };
            embedOptions.description = description;
            var keys = Object.keys(response.Character);
            keys.shift();
            keys.shift();
            keys.pop();
            for (i in embedOptions.fields) {
              if (i == 1) {
                if (response.Character[keys[i]].month == undefined) {
                  embedOptions.fields[i].value = "Unknown";
                } else {
                  var bDay = `
              ${months[response.Character[keys[i]].month - 1]} ${
                    response.Character[keys[i]].day
                  } ${response.Character[keys[i]].year}
              `;
                  bDay = bDay.replace("null", ``);
                  embedOptions.fields[i].value = bDay;
                }
              } else {
                try {
                  if (response.Character[keys[i]] === null) {
                    embedOptions.fields[i].value = "Unknown";
                  } else {
                    embedOptions.fields[i].value =
                      response.Character[keys[i]].toString();
                  }
                } catch (e) {}
              }
            }
          }
          const embed = new EmbedBuilder(embedOptions);
          if (more !== true) {
            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("lessChar")
                .setLabel("More")
                .setStyle(ButtonStyle.Primary)
            );
            return [embed, row];
          } else {
            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("moreChar")
                .setLabel("Less")
                .setStyle(ButtonStyle.Primary)
            );
            return [embed, row];
          }
        })
        .catch((err) => {
          const errorEmbed = new EmbedBuilder()
            .setTitle('Error:')
            .setDescription(`Error: ${err.response.status} ${err.response.errors[0].message}`)
          return [errorEmbed, null];
        });
    }
    // the current button true = "More" false = "Less"
    var mol = true;
    var responseOptions = await search(name);
    const reply = await interaction.editReply({
      embeds: [responseOptions[0]],
      components: responseOptions[1] == undefined ? null : [responseOptions[1]],
    });
    async function generateButton(options, moreOrLess) {
      const filter = (filteredInteraction) =>
        filteredInteraction.customId === moreOrLess == 0 ? "moreChar" : "lessChar" &&
        filteredInteraction.user.id === interaction.user.id;
      reply
        .awaitMessageComponent({
          filter: filter,
          idle: 30000,
          componentType: 2,
        })
        .then(async (buttonInteraction) => {
          responseOptions = await search(name, mol ? true : false);
          buttonInteraction.update({
            embeds: [responseOptions[0]],
            components: [responseOptions[1]],
          });
          mol = !mol;
          generateButton(responseOptions, mol);
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
    generateButton(responseOptions, mol);
  },
};
