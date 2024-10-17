const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require("node:path");
const package = require(path.join(__dirname, "../../package.json"));
const getSlashCommands = require(path.join(__dirname, "../../lib/getslashcommands.js"));

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
    //* bandage fix for string length, will add pagination at a later date
    //! ACCOUNT FOR IF THERE ARE NO COMMANDS
    for (i in guildCommands) {
      // fields[0].value +=
      //   `[\`\`${guildCommands[i].name}\`\`](${"https://a.com"} '${
      //     guildCommands[i].description
      //   }')` + "\n";
      fields[0].value +=
        `${guildCommands[i].name}` + "\n";
    }
    for (i in globalCommands) {
      // fields[1].value +=
      //   `[\`\`${globalCommands[i].name}\`\`](${"https://a.com"} '${
      //     globalCommands[i].description
      //   }')` + "\n";
      fields[1].value +=
        `${globalCommands[i].name}` + "\n";
    }
    if (!guildCommands || guildCommands?.length == 0) fields[0].value = "Nothing yet...";
    if (!globalCommands || globalCommands?.length == 0) fields[1].value = "Nothing yet..."; 
    const embed = new EmbedBuilder()
      .setTitle('Commands')
      .setFields(fields)
      .setFooter({text: "Page 1 | Version " + package.version});
    interaction.editReply({embeds: [embed]});
  },
};
