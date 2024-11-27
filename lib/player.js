// const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
// const { join } = require('node:path');

// module.exports = {
//     run: async function (interaction) {
//         console.log();
//         const connection = joinVoiceChannel({
//             channelId: interaction.member.voice.channelId,
//             guildId: interaction.guildId,
//             adapterCreator: interaction.guild.voiceAdapterCreator,
//         });
//         const player = createAudioPlayer();
//         const resource = createAudioResource(join(__dirname, './sounds/corn.mp3'));
//         const subscription = connection.subscribe(player);
//         player.play(resource);
//         setTimeout(() => {
//             subscription.unsubscribe()
//             connection.destroy();
//         }, 15000);
//     }
// }