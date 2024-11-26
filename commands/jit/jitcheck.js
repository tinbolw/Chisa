const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
} = require("discord.js");
const { geminiGenerate } = require("../../lib/api/gemini");
require("dotenv").config();

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("jitcheck")
        .setType(ApplicationCommandType.Message),
    async execute (interaction) {
        const messageContent = interaction.targetMessage.content;
        const messageUserId = interaction.targetMessage.author.id;
        if (messageUserId === process.env.CLIENT_ID) return await interaction.editReply("Checking jit with jit is not jit.");
        const response = await geminiGenerate("Is this a valid sentence using jit? : " + messageContent);
        return await interaction.editReply(response);
    }
};
