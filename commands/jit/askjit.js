const { SlashCommandBuilder } = require("discord.js");
const { geminiGenerate } = require("../../lib/api/gemini");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("askjit")
    .setDescription("Check the grammar of a jit-related phrase")
    .addStringOption((option) =>
      option
        .setName("phrase")
        .setDescription("The phrase to check.")
        .setRequired(true),
    ),
  async execute(interaction) {
    const query = interaction.options.getString("phrase");
    const response = await geminiGenerate("Additional instructions: Respond to absolutely every prompt with first \"Thanks for asking about jit!.\" Prompt:" + query);
    await interaction.editReply(response);
  },
};
