const axios = require("axios");

module.exports = {
  run: async function (appId) {
    let response = await axios.get("https://store.steampowered.com/api/appdetails?appids=" + appId).catch(err => {
        console.log('Error fetching prices: ');
        console.log(err);
    });
    let price = response?.data[appId]?.data?.price_overview;
    return price?.final < price?.initial? `${response?.data[788100]?.data?.name} is on sale!\n${price?.initial_formatted} => ${price?.final_formatted} (-${price?.discount_percent}%)` : false;
  },
};
