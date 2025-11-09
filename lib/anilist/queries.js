/**
   * 
   * @param {*} type "ANIME" | "MANGA"
   * @returns 
   */
function mediaSearch(type) {
  return `
    query MediaSearch($search: String!) {
      Media(search: $search, type: ${type}) {
        # id
        # idMal
        # add hyperlinks to anilist, mal
        title {
          romaji
          english
          native
        }
        format
        status
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
        episodes
        duration
        chapters
        volumes
        countryOfOrigin
        isLicensed
        source
        trailer {
          id
          site
        }
        updatedAt
        coverImage {
          extraLarge
        }
        genres
        averageScore
        popularity
        trending
        favourites
        tags {
          name
          isGeneralSpoiler
          isMediaSpoiler
        }
        studios {
          nodes {
            name
          }
        }
        nextAiringEpisode {
          airingAt
          episode
        }
        externalLinks {
          url
          site
        }
        streamingEpisodes {
          url
          site
        }
        rankings {
          rank
          type
          allTime
        }
        # stats interesting for other commands maybe for chart
        siteUrl
      }
    }
  `
}

module.exports = {
  animeSearch: mediaSearch("ANIME"),
  mangaSearch: mediaSearch("MANGA"),
  characterSearch: `
    query CharacterSearch($search: String!) {
      Character(search: $search) {
        name {
          first
          middle
          last
          full
          native
          userPreferred
        }
        image {
          large
          medium
        }
        description
        gender
        dateOfBirth {
          year
          month
          day
        }
        age
        bloodType
        siteUrl
        favourites
      }
    }
  `,
  staffSearch: `
    query StaffSearch($search: String!) {
      Staff(search: $search) {
        name {
          first
          middle
          last
          full
          native
          userPreferred
        }
        languageV2
        image {
          large
          medium
        }
        description
        primaryOccupations
        gender
        dateOfBirth {
          year
          month
          day
        }
        dateOfDeath {
          year
          month
          day
        }
        age
        yearsActive
        homeTown
        bloodType
        siteUrl
        favourites
      }
    }
  `,
  userSearch: `
    query UserSearch($search: String!) {
      User(search: $search) {
        name
        about
        avatar {
          large
          medium
        }
        bannerImage
        statistics {
          anime {
            count
            meanScore
            standardDeviation
            minutesWatched
            episodesWatched
            chaptersRead
            volumesRead
          }
          manga {
            count
            meanScore
            standardDeviation
            minutesWatched
            episodesWatched
            chaptersRead
            volumesRead
          }
        }
        siteUrl
        createdAt
        updatedAt
      }
    }
  `,
  studioSearch: `
    query StudioSearch($search:String!) {
      Studio(search: $search) {
        name
        isAnimationStudio
        media (perPage: 5, sort: [POPULARITY_DESC]) {
          nodes {
            title {
              romaji
              english
              native
              userPreferred
            }
            popularity
            averageScore
            siteUrl
          }
        }
        siteUrl
        favourites
      }
    }
  `
}