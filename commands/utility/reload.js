const { SlashCommandBuilder } = require('discord.js');
const slashcommands = require('../../lib/slashcommands/getslashcommands');
const fs = require('fs');

// todo this command should not be pushed to the global commands.
//* this command works assuming:
//* all commands are in subdirectories of the /commands folder
//* all commands are named the same as their filename 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads a command.')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('The command to reload.')
        .setAutocomplete(true)
        .setRequired(true)),
  async autocomplete(interaction) {
    const commandName = interaction.options.getString('command');
    const guildCommands = await slashcommands.getGuild();
    let commandMatches = [];
    guildCommands.forEach(command => {
      if (command.name.includes(commandName)) commandMatches.push({ name: command.name, value: command.name });
    });
    interaction.respond(commandMatches);
  },
  async execute(interaction) {
    if (interaction.user.id != '266413889682407428') {
      await interaction.editReply("You mayn't do this!");
    } else {
      // * the code below was definitely ripped from somewhere... probably the wiki or guide.
      const commandName = interaction.options.getString('command');
      const command = interaction.client.commands.get(commandName);
      var commandPaths = [];

      // load all command paths
      for (const folder of fs.readdirSync(__dirname + '/../')) {
        fs.readdirSync(__dirname + "/../" + folder)
          .filter((file) => file.endsWith(".js"))
          .forEach(file => {
            commandPaths.push(`${__dirname}/../${folder}/${file}`);
          });
      }
      //* https://stackoverflow.com/a/9363293, regex
      const commandPath = commandPaths.filter((command) => command.match(/[\w-]+\./)[0].slice(0, -1) == commandName)[0];

      if (!command) {
        return interaction.editReply(`There is no command with name \`${commandName}\`!`);
      } else {
        delete require.cache[require.resolve(commandPath)];
        try {
          interaction.client.commands.delete(command.data.name);
          const newCommand = require(commandPath);
          interaction.client.commands.set(newCommand.data.name, newCommand);
          await interaction.editReply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } catch (error) {
          console.error(error);
          await interaction.editReply(`There was an error while reloading the command \`${command.data.name}\`!`);
        }
      }
    }
  },
};