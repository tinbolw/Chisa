const path = require("node:path");
const { 
  animeSearch, 
  mangaSearch, 
  characterSearch, 
  staffSearch, 
  userSearch, 
  studioSearch 
} = require(path.join(__dirname, "queries"));

module.exports = {
  fetchAnilist: async function (query) {
    const endpoint = "https://graphql.anilist.co/";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(query),
    });

    const data = await response.json();
    return data.data;
  },
  createMediaQuery: function(search, type) {
    let query = "";

    switch (type) {
      case "anime":
        query = animeSearch;
        break;
      case "manga":
        query = mangaSearch;
        break;
      case "character":
        query = characterSearch;
        break;
      case "user":
        query = userSearch;
        break;
      case "staff":
        query = staffSearch;
        break;
      case "studio":
        query = studioSearch;
        break;
      default:
        throw new Error("invalid query type");
    }

    return {
      query: query,
      variables: { "search": search },
    }
  }
}