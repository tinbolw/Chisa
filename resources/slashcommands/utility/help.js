const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require("node:path");
const config = require(path.join(__dirname, "../../../package.json"));
const getSlashCommands = require(path.join(__dirname, "../../management/getslashcommands.js"));

//!! FIX LENGTH OF DESC NOW 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Commands and other info'),
  async execute (interaction) {
    var guildCommands = await getSlashCommands.guild();
    var globalCommands = await getSlashCommands.global();
    var fields = [
      {
        name: "__Slash Commands (Guild)__",
        value: "",
        inline: true,
      },
      {
        name: "__Slash Commands (Global)__",
        value: "",
        inline: true,
      },
    ];
    for (i in guildCommands) {
      fields[0].value +=
        `[\`\`${guildCommands[i].name}\`\`](${"https://a.com"} '${
          guildCommands[i].description
        }')` + "\n";
    }
    for (i in globalCommands) {
      fields[1].value +=
        `[\`\`${globalCommands[i].name}\`\`](${"https://a.com"} '${
          globalCommands[i].description
        }')` + "\n";
    }
    const embed = new EmbedBuilder()
      .setTitle('Commands')
      .setFields(fields)
      .setFooter({text: "Page 1 | Version " + config.version});
    interaction.editReply({embeds: [embed]});
  },
};
