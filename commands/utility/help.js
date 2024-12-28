const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const path = require('node:path');
const package = require(path.join(__dirname, '../../package.json'));
const getSlashCommands = require(path.join(__dirname, '../../lib/slashcommands/getslashcommands.js'));

//* current command has a listing for guild commands, which is primarily useful for development
//* if plans to expand, make it show global for all else instead

/**
 * Gets application commands json using the Discord API, formats them into Objects with name and
 * value keys, and chunks them into arrays of size 25.
 * @returns Array of arrays of commands, with each inner array having a max size of 25.
 */
async function chunkCommands() {
  // * will fetch commands every time page changes
  const guildCommands = await getSlashCommands.getGuild();
  // const globalCommands = await getSlashCommands.getGlobal();
  const pages = Math.ceil(guildCommands.length / 24);

  // remove irrelevant keypairs, and change key description to value
  guildCommands.forEach(command => {
    //* https://stackoverflow.com/a/47192402
    Object.keys(command).forEach((key) => ['name', 'description'].includes(key) || delete command[key]);
    //* https://stackoverflow.com/a/50101979, first comment
    delete Object.assign(command, { value: command.description }).description;
  });
  // todo formatting kinda weird for no commands
  var commandChunks = guildCommands.length == 0 ? [[{ name: 'There are no commands.', value: 'None!' }]] : [];

  for (let i = 0; i < pages; i++) {
    let chunkEnd = (i + 1) * 24;
    //* if anyone is reading this, let me know if there is a better way of formatting this
    commandChunks.push(guildCommands.slice(i * 24, i == pages - 1 ? guildCommands.length % 24 == 0 ? chunkEnd : guildCommands.length % 24 + chunkEnd : chunkEnd));
  }
  return commandChunks;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Commands and other info'),
  async execute(interaction) {
    const commandChunks = await chunkCommands();
    const maxPage = commandChunks.length;
    var page = 1;
    // set all command fields to be inline
    commandChunks.forEach(chunk => {
      chunk.forEach(command => {
        command.inline = true;
      })
    })

    function generateButtonRow() {
      const previous = new ButtonBuilder()
        .setCustomId('previous')
        .setLabel('<')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page == 1);

      const next = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('>')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(page == maxPage);
      return new ActionRowBuilder()
        .addComponents(previous, next);
    }

    function generateEmbedData() {
      const embed = new EmbedBuilder()
        .setTitle('Help')
        .setDescription('__**Commands**__')
        .setFields(commandChunks[page - 1])
        .setFooter({ text: `Page ${page}/${maxPage} | Version ${package.version}` });
      return { embeds: [embed], components: maxPage == 1 ? undefined : [generateButtonRow()] };
    }

    async function createCollector() {
      const collectorFilter = i => i.user.id === interaction.user.id;
      try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 30_000 });
        if (confirmation.customId === 'previous') {
          page--;
          await confirmation.update(generateEmbedData());
          createCollector();
        } else if (confirmation.customId === 'next') {
          page++;
          await confirmation.update(generateEmbedData());
          createCollector();
        }
      } catch (e) {
        // timeout
        console.log(e);
        await interaction.editReply({ components: [] });
      }
    }
    const response = await interaction.editReply(generateEmbedData());
    if (maxPage != 1) createCollector();
  },
};
