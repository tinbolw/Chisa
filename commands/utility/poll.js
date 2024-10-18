// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName('poll')
//     .setDescription('Create a poll'),
//   async execute(interaction) {
//     const data = interaction.options._hoistedOptions;
//     var embed = {
//       title: data[0].value,
//       fields: []
//     };
//     data.forEach((option, i) => {
//       if (option.name == 'title') return;
//       embed.fields.push(
//         {
//           name: `${emojis[i-1]}`,
//           value: `${option.value}`
//         }
//       );
//     });
//     const finalEmbed = new EmbedBuilder()
//       .setTitle(embed.title)
//       .setFields(embed.fields);
//     interaction.editReply({embeds: [finalEmbed]});
//     const reply = await interaction.fetchReply();
//     reply.embeds[0].fields.forEach((option, i) => {
//       reply.react(emojis[i]);
//     });
//   }
// }
