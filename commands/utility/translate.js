// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const { translate } = require("@vitalets/google-translate-api");
// const fs = require('fs');
// const path = require("node:path");

// var isos = fs.readFileSync(path.join(__dirname, "../../resources/isos.json"));
// isos = JSON.parse(isos);
// const langs = isos.map(function (lang) { return lang.name });
// const autocorrect = require("autocorrect")({
//   words: langs,
// });

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("translate")
//     .setDescription("Translate text")
//     .addStringOption(option => 
//       option.setName('text')
//         .setDescription('The text to translate')
//         .setRequired(true))
//     .addStringOption(option => 
//       option.setName('language')
//         .setDescription('Language to translate to')
//         .setAutocomplete(true)),
//   async autocomplete(interaction) {
//     const language = interaction.options.getString('language');
//     const filtered = langs.filter(choice => choice.toUpperCase().startsWith(language.toUpperCase())).slice(0,25);
//     await interaction.respond(
//       filtered.map(choice => ({ name: choice, value: choice })),
//     );
//   },
//   async execute(interaction) {
//     var text = interaction.options.getString('text');
//     var to = interaction.options.getString('language') == undefined ? 'en' : interaction.options.getString('language');
//     if ((isos.map(function (lang) { return lang.iso }).indexOf(to) == -1)) to = isos.find(o => o.name == autocorrect(to)).iso;
//     text = await translate(text, { to: to });
//     const embed = new EmbedBuilder()
//       .setTitle(`${isos.find(o => o.iso == text.raw.src).name} => ${isos.find(o => o.iso == to).name}`)
//       .setFields([
//         {
//           name: isos.find(o => o.iso == text.raw.src).name,
//           value: text.raw.sentences[0].orig
//         },
//         {
//           name: isos.find(o => o.iso == to).name,
//           value: text.text
//         }
//       ])
//     interaction.reply({ embeds: [embed] });
//   },
// };