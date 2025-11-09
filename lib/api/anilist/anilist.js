module.exports = class AniListCharacter {
  
  // do i need to define a constructor if it doesn't do anything?
  constructor() {}

  async condensed() {
    if (!this.data) {
      throw new Error("No data!");
    } else {
      // return data or embed?
    }
  }

  async expanded() {
    if (!this.data) {
      throw new Error("No data!");
    } else {
      
    }
  }

  // is there a way to make an object the parameter and destructure it in the method?
  async fetch(fetchOptions) {

  }

  // property for info
  // check to see if undefined for not fetched yet
}