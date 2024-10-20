const gqlr = require('graphql-request');

module.exports = {
  fetchAnime: async function (name) {
    const query = gqlr.gql`
    {
      Media (search : "${name}" type:ANIME) {
        title {
          english
        }
        episodes
        description
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        status
        format
        duration
        popularity
        coverImage {
          extraLarge
        }
        siteUrl
      }
    }
    `;
    return await gqlr.request('https://graphql.anilist.co/', query)
      .then(async (response) => {
        return response.Media;
      })
      // todo error handling fix
      .catch((err) => {
        return err;
      });
  },
  searchAnime: async function (name) {
    const query = gqlr.gql`
    {
      Page(page:1) {
        media(search:"${name}", format_in:[TV, TV_SHORT, MOVIE, SPECIAL, OVA, ONA, MUSIC]) {
          title {
            english
          }
        }
      }
    }
    `;
    return await gqlr.request('https://graphql.anilist.co/', query)
      .then(async (response) => {
        let results = response.Page.media.filter((media) => media.title.english != null);
        results = results.slice(0,24); // limit 25
        results = results.map((media) => media.title.english);
        return results;
      })
      // todo error handling fix
      .catch((err) => {
        return err;
      });
  }
}