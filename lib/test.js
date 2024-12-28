const gqlr = require('graphql-request');
const endpoint = 'https://graphql.anilist.co';

// define slugs?
const slugs = {
  Anime: `
  title {
    english
    romaji
    native
  }
  description
  siteUrl
  coverImage {
    extraLarge
    color
  }
  status
  format
  popularity
  episodes
  duration
  meanScore
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }`,
}
slugs.Manga = slugs.Anime + `
  
chapters
volumes
`;

// return array of the results which can be added to fields directly

//todo add example returns and input
/**
 * Parses an object of valid GraphQL document variables into a string. Bypasses the need for
 * manual assignment of variable types in the query, but requires manually defined exceptions
 * within the function itself. Should be limited to AniList use.
 * @param {object} requestOptions An object representation of valid GraphQL document variables
 * @returns {string}
 */
function parseRequestOptions(requestOptions) {
  let result = "";
  let keys = Object.keys(requestOptions);
  let values = Object.values(requestOptions);
  for (let i = 0; i < keys.length; i++) {
    let valueIsString = !(keys[i] === 'type') && typeof values[i] === 'string';
    result += keys[i] + ": " + (valueIsString ? "\"" : "") + values[i] + (valueIsString ? "\" " : " ");
  }
  return result;
}

class AnilistRequest {
  /**
   * Make a GraphQL AniList request. Stored to this.response.
   * @param {'Anime'|'Manga'|'Character'|'Staff'|'Studio'|'User'} requestType The type of request
   * to make.
   * @param {object} requestOptions The unique options for the specific request type
   */
  async request(requestType, requestOptions) {
    const query = gqlr.gql`
    {
      ${requestType === 'Anime' || requestType === 'Manga' ? 'Media' : requestType} (${parseRequestOptions(requestOptions)}) {
        ${slugs[requestType]}
      }
    }
    `;
    const startTime = Date.now();
    this.response = await gqlr.request(endpoint, query, requestOptions)
      .then((response) => {
        this.timeElapsed = Date.now() - startTime;
        return response[requestType === 'Anime' || requestType === 'Manga' ? 'Media' : requestType];
      })
      // todo error handling fix
      .catch((err) => {
        console.error(err);
        if (err.response.errors[0].status == 404) {
          return err.response.errors[0];
        }
      });
  }
  parseFields() {
    // todo
    return [];
  }
}
// todo take array from result and parse into an array of fields
// todo do it by order

module.exports = {
  AnilistRequest,
}