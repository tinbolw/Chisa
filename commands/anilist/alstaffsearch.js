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
//     .setName("alstaffsearch")
//     .setDescription("Search for staff using AniList."),
//   async execute(interaction) {
//     const name = interaction.options._hoistedOptions[0].value;
//     //TODO Allow searching by id instead of name?
//     // AniList api slug
//     const query = gqlr.gql`
//     {
//       Staff (search : "${name}") {
//         name {
//           full
//         }
//         description
//         dateOfBirth {
//           year
//           month
//           day
//         }
//         dateOfDeath {
//           year
//           month
//           day
//         }
//         age
//         yearsActive
//         primaryOccupations
//         gender
//         homeTown
//         bloodType
//         favourites
//         image {
//           large
//         }
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
//         interaction.editReply({embeds: [errorEmbed]});
//         return;
//       });
//       // object keys are the six extra entries when embed is expanded
//     var fields = [];
//     var keys = Object.keys(response.Staff);
//     keys.splice(0,2);
//     keys.splice(2, 1);
//     keys.splice(-2,2);
//     // adding fields dynamically, formatting startDate => Start date
//     for (let i of keys) {
//       fields.push({
//         name: (i.replace(/([A-Z])/g, " $1")).charAt(0).toUpperCase() + i.replace(/([A-Z])/g, " $1").slice(1),
//         value: '',
//         inline: true,
//       });
//     }
//     var months = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];
//     // setting field values, special cases for start/end dates and runtime
//     fields.forEach(function (v, i) {
//       if (i <= 1) {
//         if (response.Staff[keys[i]].year == null) {
//           v.value = 'Unknown';
//         } else {
//           v.value = `${months[response.Staff[keys[i]].month - 1] == undefined ? '' : months[response.Staff[keys[i]].month - 1] + ' '}${response.Staff[keys[i]].day == null ? '' : response.Staff[keys[i]].day + ' '}${response.Staff[keys[i]].year == null ? '' : response.Staff[keys[i]].year}`
//         }
//       } else {
//         if (response.Staff[keys[i]] === null) {
//           v.value = 'Unknown';
//         } else {
//           v.value = `${response.Staff[keys[i]]}`;
//         }
//       }
//     });
//     // Regex formatting to remove html fragments from description
//     const shortEmbed = new EmbedBuilder()
//       .setTitle(response.Staff.name.full)
//       .setDescription(response.Staff.description.replace(new RegExp("\<(.*?)\>", "g"), "").substr(0, 512) + "...")
//       .setURL(response.Staff.siteUrl)
//       .setImage(response.Staff.image.large);
//     const longEmbed = new EmbedBuilder()
//       .setTitle(response.Staff.name.full)
//       .setDescription(response.Staff.description.replace(new RegExp("\<(.*?)\>", "g"), "").length > 4096? response.Staff.description.replace(new RegExp("\<(.*?)\>", "g"), "").substr(0, 4093) + '...' : response.Staff.description.replace(new RegExp("\<(.*?)\>", "g"), "").substr(0,4096))
//       .setURL(response.Staff.siteUrl)
//       .setImage(response.Staff.image.large)
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
//       .awaitMessageComponent({
//         filter: filter,
//         idle: 30000,
//         componentType: 2,
//       })
//       .then(async (buttonInteraction) => {
//         // only defers to ensure it works on slow phone
//         await buttonInteraction.deferUpdate();
//         buttonInteraction.editReply({
//           embeds: [buttonInteraction.customId === 'shrink' ? shortEmbed : longEmbed],
//           components: [buttonInteraction.customId === 'shrink' ? expandButton : shrinkButton],
//         });
//         generateButton();
//         // catch idle
//       }).catch((e) => {
//         // prevents bot from stopping if reply was deleted
//         if ((`${e}`).indexOf('idle') != -1) {
//           interaction.editReply({
//             components: []
//           });
//         } else {
//           console.log('reply was deleted');
//         }
//       });
//     }
//     generateButton();
//   },
// };
