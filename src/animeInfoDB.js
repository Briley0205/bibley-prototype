//animation db
import axios from "axios";

const headers = {
    "content-type": "application/json",
    "Accept": "applicatoin/json",
}
let variables = {
    page: 1,
    perPage: 25,
}
const gqlQuery = `
query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
        media(type: ANIME, sort: TRENDING_DESC) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            extraLarge
            large
            medium
          }
          bannerImage
      }
}
}`;
let trendingAnime = [];
const startAnimeInfoDB = async() => {
    try {
        console.log("🎠 Starting AnimeInfo DB");
        await axios.post("https://graphql.anilist.co", {
        headers,
        variables,
        query: gqlQuery,
    }).then(results => { trendingAnime.push(results.data.data.Page.media)});
    console.log("✔ AnimeInfo DB is ready!");
    } catch(err) {
        return console.log(err.message);
    }
}
startAnimeInfoDB();
export const getAnime = () => trendingAnime.flat();
