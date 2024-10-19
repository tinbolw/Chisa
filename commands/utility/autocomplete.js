//! THIS COMMAND IS JUST FOR TESTING PURPOSES. IMPLEMENT FUNCTIONALITY INTO ANILIST COMMANDS.
const { SlashCommandBuilder } = require('discord.js');

const gqlr = require("graphql-request");

async function request(query) {
  const slug = gqlr.gql`
    {
      Page(page:1) {
        characters(search:"${query}") {
          name {
            full
          }
        }
      }
    }
  `;
  // media(search:"${query}") {
  //   title{
  //     english
  //     romaji
  //   }
  // }
  const response = await gqlr.request("https://graphql.anilist.co/", slug)
    .then(async (response) => {
      let result = []
      for (let i = 0; i < (response.Page.characters.length>25?25:response.Page.characters.length); i++) {
        result.push(response.Page.characters[i].name.full);
      }
      // console.log(response.Page.media);
      return result;
    })
    .catch((err) => {
      // const errorEmbed = new EmbedBuilder()
      //   .setTitle('Error:')
      //   .setDescription(`Error: ${err.response.status} ${err.response.errors[0].message}`);
      return ["Show me something! - Muhammad Ali"];
    });
  return response;
}



module.exports = {
  data: new SlashCommandBuilder()
    .setName('autocomplete')
    .setDescription('test the autocomplete!')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Phrase to search for')
        .setAutocomplete(true)),
  async autocomplete(interaction) {
    const query = interaction.options.getString('query');
    const result = await request(query);
    // const choices = [string + "!", string + "!?", string + "?"];
    // const filtered = choices.filter(choice => choice.startsWith(focusedValue));
    await interaction.respond(
      result.map(choice => ({ name: choice, value: choice })),
    );
  },
  async execute(interaction) {
    await interaction.reply(interaction.options.getString('query'));
  }
};