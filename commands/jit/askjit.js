const { SlashCommandBuilder } = require("discord.js");
const { geminiGenerate } = require("../../lib/api/gemini");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("askjit")
    .setDescription("Talk to jit")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message")
        .setRequired(true),
    ),
  async execute(interaction) {
    const additionalInstructions = "Additional instructions: Respond to absolutely every prompt with first \"Thanks for asking, jit!\" Prompt:";
    const query = interaction.options.getString("message");
    const response = await geminiGenerate(additionalInstructions + query);
    await interaction.editReply(response);
  },
};
