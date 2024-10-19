const { SlashCommandBuilder } = require('discord.js');
const slashcommands = require('../../lib/getslashcommands');

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
      if (!command) {
        return interaction.editReply(`There is no command with name \`${commandName}\`!`);
      } else {
        delete require.cache[require.resolve(`./${command.data.name}.js`)]
        try {
          interaction.client.commands.delete(command.data.name);
          const newCommand = require(`./${command.data.name}.js`);
          interaction.client.commands.set(newCommand.data.name, newCommand);
          await interaction.editReply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } catch (error) {
          console.error(error);
          await interaction.editReply(`There was an error while reloading a command \`${command.data.name}\`:\n\`\`\`${error.message}\`\`\``);
        }
      }
    }
  },
};