// sends timestamp for time inputted by user
// returned message can only be seen by user
const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
  // can set maxes for options based on previous options
  // https://discordjs.guide/legacy/slash-commands/advanced-creation#subcommands
    .setName('timestamp')
    .setDescription('Generate a timestamp')
    .addIntegerOption(option =>
      option
        .setName('month')
        // add timezone offset in future
        .setDescription('the month')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('day')
        // add timezone offset in future
        .setDescription('the day')
        .setRequired(true)
    ).addIntegerOption(option =>
      option
        .setName('year')
        // add timezone offset in future
        .setDescription('the year')
        .setRequired(true)
    ).addIntegerOption(option =>
      option
        .setName('hour')
        // add timezone offset in future
        .setDescription('the hour')
        .setRequired(false)
    ).addIntegerOption(option =>
      option
        .setName('minute')
        // add timezone offset in future
        .setDescription('the minute')
        .setRequired(false)
    ).addIntegerOption(option =>
      option
        .setName('second')
        // add timezone offset in future
        .setDescription('the second')
        .setRequired(false)
    )
    // need option for type of timestamp, relative long date, short date, etc
    // manually add selectable options from array later
    // .addStringOption(option =>
    //   option
    //     .setName('timezone')
    //     // add timezone offset in future
    //     .setDescription('the timezone')
    //     .setRequired(false)
    // )
    ,
  async execute(interaction) {
    // The date string, in format YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
    const month = interaction.options.getInteger("month");
    const day = interaction.options.getInteger("day");
    const year = interaction.options.getInteger("year");
    const hour = interaction.options.getInteger("hour");
    const minute = interaction.options.getInteger("minute");
    const second = interaction.options.getInteger("second");

    const date = `${year}-${month}-${day}`;
    const time = (hour && minute && second) ? `T${hour}:${minute}:${second}` : "";

    const parsedDate = Date.parse(`${date}${time}`);
    let response = "";
    if (isNaN(parsedDate)) {
      response = "Invalid date";
    } else {
      response = `\`<t:${parsedDate/1000}>\``;
    }
    interaction.reply(
      {
        content: response,
        flags: MessageFlags.Ephemeral,
      }
    )
  }
}
