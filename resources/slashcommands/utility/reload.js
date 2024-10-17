const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads a command.')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('The command to reload.')
        .setRequired(true)),
  async execute(interaction) {
    if (interaction.user.id != '266413889682407428') {
      await interaction.editReply("You can't do this!");
    } else {
      const commandName = interaction.options.getString('command', true).toLowerCase();
      const command = interaction.client.commands.get(commandName);

      if (!command) {
        return interaction.editReply(`There is no command with name \`${commandName}\`!`);
      } else {
        delete require.cache[require.resolve(`./${command.data.name}.js`)];

        try {
          interaction.client.commands.delete(command.data.name);
          const newCommand = require(`./${command.data.name}.js`);
          interaction.client.commands.set(newCommand.data.name, newCommand);
          await interaction.editReply(`Command \`${newCommand.data.name}\` was reloaded!`);
        } catch (error) {
          console.error(error);
          await interaction.editReply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
        }
      }
    }

  },
};