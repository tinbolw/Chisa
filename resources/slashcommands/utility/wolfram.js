const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
// 56V79W-A6LJ3Q2954
module.exports = {
    data: new SlashCommandBuilder()
        .setName('wolfram')
        .setDescription('wolfram'),
    async execute(interaction) {
        
        const arg = interaction.options._hoistedOptions[0].value;
        axios.get(`http://api.wolframalpha.com/v1/simple?appid=56V79W-A6LJ3Q2954&i=${arg.replaceAll(' ', '+')}&ip=8.8.8.8`, {
            responseType: "text",
            responseEncoding: "base64",
        }).then((res) => {
            fs.writeFileSync('res.gif', res.data, 'base64');
            interaction.editReply({
                files: ['./res.gif']
            });
        }).catch(() => {
            interaction.editReply('Wolfram|Alpha did not understand your input.');
        });
    },
};
