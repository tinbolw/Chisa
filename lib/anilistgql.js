const gqlr = require('graphql-request');

module.exports = {
  fetchAnime: async function (name) {
    const query = gqlr.gql`
    {
      Media (search : "${name}" type:ANIME) {
        title {
          english
        }
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
        return response;
      })
      // todo error handling fix
      .catch((err) => {
        return err;
      });
  }
}