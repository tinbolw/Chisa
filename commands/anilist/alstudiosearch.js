// const {
//   SlashCommandBuilder,
//   EmbedBuilder,
//   ActionRowBuilder,
//   ButtonBuilder,
//   ButtonStyle,
// } = require("discord.js");
// const gqlr = require("graphql-request");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("alstudiosearch")
//     .setDescription("Search for a studio using AniList."),
//   async execute(interaction) {
//     const name = interaction.options._hoistedOptions[0].value;
//     //TODO Allow searching by id instead of name?
//     // AniList api slug
//     const query = gqlr.gql`
//     {
//       Studio(search : "${name}") {
//         name
//         media (sort:POPULARITY_DESC) {
//           nodes {
//             title {
//               english
//             }
//           }
//         }
//         favourites
//         siteUrl
//       }
//     }
//     `;
//     const response = await gqlr.request("https://graphql.anilist.co/", query)
//       .then(async (response) => {
//         return response;
//       })
//       .catch((err) => {
//         const errorEmbed = new EmbedBuilder()
//           .setTitle('Error:')
//           .setDescription(`Error: ${err.response.status} ${err.response.errors[0].message}`);
//         interaction.editReply({ embeds: [errorEmbed] });
//         return;
//       });
//     var fields = [{
//       name: "Favourites",
//       value: `${response.Studio.favourites}`,
//       inline: true,
//     }];
//     // formatting top 5 notable anime
//     var top5 = 'Notable Works:\n';
//     var i = 0;
//     while (i<5) {
//       top5 += response.Studio.media.nodes[i].title.english + "\n";
//       i++;
//     }
//     // Regex formatting to remove html fragments from description
//     const shortEmbed = new EmbedBuilder()
//       .setTitle(response.Studio.name)
//       .setDescription(top5)
//       .setURL(response.Studio.siteUrl)
//       .setImage(`https://img.anili.st/media/${response.Studio.id}`);
//     const longEmbed = new EmbedBuilder()
//       .setTitle(response.Studio.name)
//       .setDescription(top5)
//       .setURL(response.Studio.siteUrl)
//       .setImage(`https://img.anili.st/media/${response.Studio.id}`)
//       .setFields(fields);
//     const expandButton = new ActionRowBuilder().addComponents(
//       new ButtonBuilder()
//         .setCustomId("expand")
//         .setLabel("More")
//         .setStyle(ButtonStyle.Primary)
//     );
//     const shrinkButton = new ActionRowBuilder().addComponents(
//       new ButtonBuilder()
//         .setCustomId("shrink")
//         .setLabel("Less")
//         .setStyle(ButtonStyle.Primary)
//     );
//     const reply = await interaction.editReply({
//       embeds: [shortEmbed],
//       components: [expandButton],
//     });
//     const filter = (filteredInteraction) =>
//       (filteredInteraction.customId === 'expand' || filteredInteraction.customId === 'shrink') &&
//       filteredInteraction.user.id === interaction.user.id;
//     function generateButton() {
//       reply
//         .awaitMessageComponent({
//           filter: filter,
//           idle: 30000,
//           componentType: 2,
//         })
//         .then(async (buttonInteraction) => {
//           // only defers to ensure it works on slow phone
//           await buttonInteraction.deferUpdate();
//           buttonInteraction.editReply({
//             embeds: [buttonInteraction.customId === 'shrink' ? shortEmbed : longEmbed],
//             components: [buttonInteraction.customId === 'shrink' ? expandButton : shrinkButton],
//           });
//           generateButton();
//           // catch idle
//         }).catch((e) => {
//           // prevents bot from stopping if reply was deleted
//           if ((`${e}`).indexOf('idle') != -1) {
//             interaction.editReply({
//               components: []
//             });
//           } else {
//             console.log('reply was deleted');
//           }
//         });
//     }
//     generateButton();
//   },
// };
