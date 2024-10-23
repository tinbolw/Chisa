const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('bot uptime'),
  async execute(interaction) {
    // if it works its not stupid
    interaction.editReply(`I have been up for ${process.uptime() >= 86400 ? Math.floor(process.uptime() / 86400) + (Math.floor(process.uptime() / 86400) != 1 ? ' days ' : ' day ') : ""}${process.uptime() >= 3600 ? Math.floor((process.uptime() % 86400) / 3600) + (Math.floor((process.uptime() % 86400) / 3600) != 1 ? ' hours ' : ' hour ') : ""}${process.uptime() >= 60 ? Math.floor((process.uptime() % 86400 % 3600) / 60) + (Math.floor((process.uptime() % 86400 % 3600) / 60) != 1 ? ' minutes and ' : ' minute and ') : ""}${Math.floor(process.uptime() % 86400 % 3600 % 60)}${Math.floor(process.uptime() % 86400 % 3600 % 60) != 1 ? ' seconds' : 'second'}`);
  },
};
