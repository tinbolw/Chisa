const gqlr = require('graphql-request');
const endpoint = 'https://graphql.anilist.co';

module.exports = {
  /**
   * Search for characters, staff, studios, and users on AniList
   * @param {'characters'|'staff'|'studios'|'users'} searchType The type of search
   * @param {string} name What to search for
   * @returns {String[]} An array of names
   */
  searchOthers: async function (searchType, name) {
    const query = gqlr.gql`
    {
      Page {
        ${searchType}(search: "${name}") {
          ${(searchType === 'characters' || searchType === 'staff') ?
        `name {
              full
            }` : `name`
      }
        }
      }
    }
    `;
    return await gqlr.request(endpoint, query)
      .then(async (response) => {
        let results = response.Page[searchType].slice(0, 25);
        return results.map((entry) => entry.name.full ?? entry.name);
      })
      // todo error handling fix
      .catch((err) => {
        return err;
      });
  },
  /**
   * Search media with the AniList API.
   * @param {'ANIME' | 'MANGA'} mediaType - The type of media to search.
   * @param {string} mediaTitle - The title of the media to search.
   * @param {boolean} nsfw - Whether or not to include NSFW content.
   */
  searchMedia: async function (mediaType, mediaTitle, nsfw) {
    const query = gqlr.gql`
    {
      Page {
        media(search: "${mediaTitle}", type: ${mediaType}, isAdult:${nsfw}) {
          title {
            english
            romaji
            native
          }
          id
        }
      }
    }
    `;
    return await gqlr.request(endpoint, query)
      .then(async (response) => {
        let results = response.Page.media.slice(0, 25); // max command options is 25
        return results.map((media) =>
        (
          {
            name: (media.title.english || media.title.romaji || media.title.native).substring(0, 100),
            // search by id to prevent same name shenanigans
            value: String(media.id)
          }
        ));
      })
      // todo error handling fix
      .catch((err) => {
        return err;
      });
  }
}