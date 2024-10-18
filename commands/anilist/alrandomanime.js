// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const gqlr = require("graphql-request");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("alrandomanime")
//     .setDescription("generate a random anime using AniList"),
//   async execute(interaction) {
//     let score = interaction.options._hoistedOptions.length == 0 ? 0 : interaction.options._hoistedOptions[0].value;
//     async function generate(page) {
//         let query = gqlr.gql`
//         {
//             Page(page: ${page}) {
//                 media(averageScore_greater: ${score}){
//                   id
//                 }
//             }
//         }
//         `;
//         return gqlr.request('https://graphql.anilist.co/', query).then((response) => {
//         return response.Page.media;
//     });
//     }

//     //TODO page 16 over score 80 might not exist
//     var rand = Math.floor(Math.random()*16);
//     var animes = await generate(rand);
//     interaction.editReply(`https://anilist.co/anime/${animes[Math.floor(Math.random()*animes.length)].id}`);
//   },
// };
