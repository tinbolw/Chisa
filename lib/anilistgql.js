const gqlr = require('graphql-request');
const { EmbedBuilder } = require('discord.js');
const striptags = require('striptags');

// media types
const mediaTypes = {
  ANIME: 'TV, TV_SHORT, MOVIE, SPECIAL, OVA, ONA',
  MANGA: 'MANGA, ONE_SHOT'
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

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = {
  // possible types: 'ANIME', 'MANGA'
  // todo add NOVEL, MUSIC?
  fetchMedia: async function (mediaType, mediaTitle) {
    const query = gqlr.gql`
    {
      Media (search : "${mediaTitle}" type:${mediaType}) {
        ${mediaSlug}
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
        media(search:"${mediaTitle}", format_in:[${mediaTypes[mediaType]}]) {
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
  },
  randomMedia: async function (mediaType, nsfw) {
    const randomPage = getRandomInt(nsfw ? mediaMaxPages.nsfw[mediaType] : mediaMaxPages[mediaType]) + 1;
    const query = gqlr.gql`
    {
      Page (page:${randomPage}) {
        media(format_in:[${mediaTypes[mediaType]}] isAdult:${nsfw}) {
          ${mediaSlug}
        }
      }
    }
    `;
    return await gqlr.request('https://graphql.anilist.co/', query)
      .then(async (response) => {
        const results = response.Page.media.filter((media) => media.title.english !== null);
        //* lots of null entries in the db, run again if there are no results due to that
        if (results.length == 0) module.exports.randomMedia(mediaType);
        return results[getRandomInt(results.length)];
      })
      // todo error handling fix
      .catch((err) => {
        return err;
      });
  },
  generateMediaEmbed: function (data, expanded, timeElapsed, mediaType) {
    const embed = new EmbedBuilder()
      .setTitle(data.title.english)
      .setDescription(`${striptags(data.description).substring(0, expanded ? 4094 : 257)}${expanded ? `` : `...`}`)
      .setURL(data.siteUrl)
      //? not sure if extraLarge is available for all anime, but if not, use last entry in
      //? coverImage instead
      .setImage(data.coverImage.extraLarge)
      .setColor(data.coverImage.color)
      .setFooter({ text: `Fetched in ${timeElapsed} ms | ${mediaType}`, iconURL: 'https://cdn.discordapp.com/attachments/975191225340686377/1297388691458625639/icon.png' });
    if (expanded) {
      let fields = [];
      //* due to the parsing requirements of nearly every field, assigning them dynamically is
      //* practically pointless due to the number of exceptions
      fields.push({ name: "Status", value: data.status.replaceAll('_', ' '), inline: true });
      fields.push({ name: "Format", value: data.format.replaceAll('_', ' '), inline: true });
      fields.push({ name: "Popularity", value: String(data.popularity), inline: true });
      if (data.episodes) { // parse out fields for manga, for which they do not exist
        fields.push({
          name: `${Math.floor(data.duration / 60) == 0 ? `Episode ` : ``}Duration`, value: `${Math.floor(data.duration / 60) == 0 ? `${data.duration} min` : `${Math.floor(data.duration / 60)} hr ${Math.floor(data.duration % 60)} min`}`, inline: true
        });
        if (data.episodes != 1) fields.push({ name: "Episodes", value: String(data.episodes), inline: true });
      }
      fields.push({ name: "Mean Score", value: String(data.meanScore), inline: true });
      fields.push({ name: "Start Date", value: `${data.startDate.month}/${data.startDate.day}/${data.startDate.year}`, inline: true });
      fields.push({ name: "End Date", value: `${data.endDate.month}/${data.endDate.day}/${data.endDate.year}`, inline: true });
      embed.setFields(fields);
    }
    return embed;
  }
}