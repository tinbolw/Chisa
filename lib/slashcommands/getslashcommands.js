const axios = require('axios');
require('dotenv').config();

module.exports = {
  getGuild: async function () {
    // Get guild commands
    return axios.get(`https://discord.com/api/v8/applications/
        ${process.env.CLIENT_ID}/guilds/
        ${process.env.GUILD_ID}/commands`,
      {
        headers: {
          "Authorization": `Bot ${process.env.TOKEN}`
        }
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getGlobal: async function () {
    // Get global commands
    return axios.get(`https://discord.com/api/v8/applications/
      ${process.env.CLIENT_ID}/commands`,
      {
        headers: {
          "Authorization": `Bot ${process.env.TOKEN}`
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