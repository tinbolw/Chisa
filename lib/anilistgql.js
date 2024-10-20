const gqlr = require('graphql-request');

module.exports = {
  // possible types: 'ANIME', 'MANGA'
  fetchMedia: async function (mediaType, mediaTitle) {
    const query = gqlr.gql`
    {
      Media (search : "${mediaTitle}" type:${mediaType}) {
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
        meanScore
        coverImage {
          extraLarge
          color
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
  searchMedia: async function (mediaType, mediaTitle) {
    const query = gqlr.gql`
    {
      Page(page:1) {
        media(search:"${mediaTitle}", format_in:[${mediaType === 'ANIME' ? 'TV, TV_SHORT, MOVIE, SPECIAL, OVA, ONA, MUSIC' : mediaType === 'MANGA' ? 'MANGA, ONE_SHOT' : ''}]) {
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
        results = results.slice(0, 24); // limit 25
        results = results.map((media) => media.title.english);
        return results;
      })
      // todo error handling fix
      .catch((err) => {
        return err;
      });
  }
}