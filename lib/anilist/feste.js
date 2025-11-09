const { fetchAnilist, createMediaQuery } = require("./test");

async function main() {
  const res = await fetchAnilist(createMediaQuery("frieren"));
  console.log(res);
}

main();