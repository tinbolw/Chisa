const axios = require('axios');
const path = require("node:path");
const config = require(path.join(__dirname, "../../config.json"));

// Command JSON

// Types: SUB_COMMAND = 1 SUB_COMMAND_GROUP = 2 STRING = 3 INTEGER = 4 BOOLEAN = 5 USER = 6 CHANNEL = 7 ROLE = 8 MENTIONABLE = 9

module.exports = {
  guild: async function () {
    // Get guild commands
    return axios.get('https://discord.com/api/v8/applications/751631739276886066/guilds/288143162394804224/commands', {
      headers: {
        "Authorization": "Bot " + config.token
      }
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  global: async function () {
    // Get global commands
    return axios.get('https://discord.com/api/v8/applications/751631739276886066/commands', {
      headers: {
        "Authorization": "Bot " + config.token
      }
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

// const command = {
//     name: "emojicollect",
//     description: "Collect emojis",
//     options: [
//         {
//             name: "name",
//             description: "username",
//             type: 3,
//             required: false
//         }
//     ],
// };

// Create global command

// async function createGlobalCommand(){
//     await interaction
//         .createApplicationCommand(command)
//         .then(console.log)
//         .catch(console.error);
// }
// createGlobalCommand();

// Edit Global Command

// async function editGlobalCommand(){
//     await interaction
//         .createApplicationCommand(command, null, "commandid")
//         .then(console.log)
//         .catch(console.error);
// }
// editGlobalCommand();

// // Edit Guild Command

// async function editGuildCommand() {
//     await interaction
//         .createApplicationCommand(command, "288143162394804224", "829946889460776990")
//         .then(console.log)
//         .catch(console.error);
// }
// editGuildCommand();
