const gqlr = require('graphql-request');
const endpoint = 'https://graphql.anilist.co';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
/**
 * 
 * @param {Number} max The max
 * @returns Number
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const mediaMaxPages = {
  nsfw: {
    ANIME: 360, // as of 10/20/24
    MANGA: 1992, // as of 10/20/24
  },
  ANIME: 328, // as of 10/20/24
  MANGA: 1356, // as of 10/20/24
}

const mediaSlug = `
  title {
    english
    romaji
    native
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
`

module.exports = {
  // todo add NOVEL, MUSIC?
  // fetchChar: async function(characterName) {

  // },
  /**
   * Fetch media with the AniList API.
   * @param {('ANIME' | 'MANGA')} mediaType - The type of media to search.
   * @param {string} mediaTitle - The title of the media to search.
   * @param {boolean} nsfw - Whether or not to include NSFW content.
   */
  fetchMedia: async function (mediaType, mediaTitle, nsfw) {
    const query = gqlr.gql`
    {
      Media (search : "${mediaTitle}" type:${mediaType} isAdult:${nsfw}) {
        ${mediaSlug}
      }
    }
    `;
    const startTime = Date.now();
    return await gqlr.request(endpoint, query)
      .then((response) => {
        return {
          data: response.Media,
          timeElapsed: Date.now() - startTime,
        };
      })
      // todo error handling fix
      .catch((err) => {
        if (err.response.errors[0].status == 404) {
          return {
            data: err.response.errors[0]
          };
        }
      });
  },
  /**
   * Fetch a random media from the AniList API.
   * @param {('ANIME' | 'MANGA')} mediaType - The type of media to search.
   * @param {boolean} nsfw - Whether or not to include NSFW content.
   */
  randomMedia: async function (mediaType, nsfw) {
    const randomPage = getRandomInt(nsfw ? mediaMaxPages.nsfw[mediaType] : mediaMaxPages[mediaType]) + 1;
    const query = gqlr.gql`
    {
      Page (page:${randomPage}) {
        media(type:${mediaType}, isAdult:${nsfw}) {
          ${mediaSlug}
        }
      }
    }
    `;
    const startTime = Date.now();
    return await gqlr.request(endpoint, query)
      .then(async (response) => {
        const results = response.Page.media;
        return {
          data: results[getRandomInt(results.length)],
          timeElapsed: Date.now() - startTime,
        };
      })
      // todo error handling fix
      .catch((err) => {
        return err;
      });
  },
}